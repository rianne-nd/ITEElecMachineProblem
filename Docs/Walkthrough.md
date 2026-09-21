# MP1 Walkthrough — How EMS Portal Works

A from-scratch explanation of your own Machine Problem, written so you can re-derive every part of it and defend it out loud.

**Read this in order the first time.** After that, use §14 (Q&A) and §15 (cheat sheet) for revision.

---

## 1. The 30-second summary

> EMS Portal is an ASP.NET MVC app. A custom layout wraps five custom views. AngularJS owns the browser side: a controller holds `$scope.userArray`, an array of employee records. The Registration page binds a form to `$scope` with `ng-model`, pushes records into the array, and renders them with `ng-repeat`. Edit/Update/Delete manipulate the same array. One thing goes to the server — the Home page asks the C# controller for a welcome message, which travels back through a service and is shown with SweetAlert2.

**The one-sentence version for your professor:** *"The CRUD is entirely client-side in an AngularJS array; the C# controller is used to supply data to a view."*

---

## 2. The big picture

```
┌──────────────────────────── BROWSER ─────────────────────────────┐
│                                                                  │
│   _MainLayout.cshtml  ── the shell ──────────────────────────┐   │
│     • <head>: Materialize CSS, Material Icons, SweetAlert2   │   │
│     • <header>: nav bar (Home/Registration/About/Contact)    │   │
│     • @RenderBody()  ◄── the page is injected HERE           │   │
│     • <footer>: quick links                                  │   │
│     • scripts: jQuery → Materialize → SweetAlert2 → Angular  │   │
│                → Module.js → Service.js → Controller.js      │   │
│                                                              │   │
│   Views/Main/LoginPage      RegistrationPage   Index   About   Contact
│                    │                                 │            │
│                    ▼                                 │            │
│      ╔═════════════════════════════╗                 │            │
│      ║  Controller.js  ($scope)    ║                 │            │
│      ║  userArray, editingIndex,   ║                 │            │
│      ║  registrationFunc, …        ║                 │            │
│      ╚═════════════╤═══════════════╝                 │            │
│                    │ only ONE method uses it         │            │
│                    ▼                                  │            │
│      ╔═════════════════════════════╗                 │            │
│      ║  Service.js  (HTTP only)    ║                 │            │
│      ║  this.GetWelcomeMessage     ║                 │            │
│      ╚═════════════╤═══════════════╝                 │            │
└────────────────────┼─────────────────────────────────┼────────────┘
                     │  $http.get('/Main/GetWelcomeMessage')
                     ▼
┌──────────────────────── SERVER (IIS Express) ────────────────────┐
│   RouteConfig.cs:  {controller}/{action}                         │
│                     ▼                                            │
│   MainController.cs                                              │
│     • Index() LoginPage() RegistrationPage() AboutPage()          │
│       ContactPage()        → return View()   (renders a page)     │
│     • GetWelcomeMessage()  → return Json("…", AllowGet)  (data)   │
└──────────────────────────────────────────────────────────────────┘
```

**The single most important thing to understand:** there are **two completely different kinds of work** happening in this app, and mixing them up is the fastest way to look confused.

```
┌───────────────────────────────────┬───────────────────────────────────┐
│  TYPE A — LOCAL (browser only)    │  TYPE B — ROUND TRIP (to the C#)  │
├───────────────────────────────────┼───────────────────────────────────┤
│  Register                         │  Load the Home page               │
│  Edit                             │  → asks C# for the welcome message│
│  Update                           │                                   │
│  Delete                           │  Uses:                            │
│  Clear                            │    Controller.js → Service.js →   │
│                                   │    MainController.cs → back       │
│  Uses ONLY Controller.js.         │                                   │
│  Never touches the server.        │  Does NOT touch userArray.        │
│  Never touches Service.js.        │                                   │
└───────────────────────────────────┴───────────────────────────────────┘
```

> The spec says *"No database is required… CRUD functionality will be implemented on the client side using AngularJS."* That is why the entire CRUD is Type A. If he asks *"why doesn't Register save to the database?"* — this is the answer, and it's in the spec.

---

## 3. What happens when the page first loads

```
①  Browser:  GET /Main/LoginPage
                    │
②  RouteConfig:     url: "{controller}/{action}/{id}"
                    controller = "Main"   action = "LoginPage"
                    (also sets the DEFAULT page: LoginPage first)
                    │
③  MainController:  public ActionResult LoginPage()  →  return View();
                    │
④  Razor:           renders LoginPage.cshtml  INSIDE  _MainLayout.cshtml
                    @RenderBody() is replaced by the login markup
                    │
⑤  HTML arrives. Scripts execute top to bottom:
                    jQuery → Materialize JS → SweetAlert2 → angular.min.js
                    → Module.js  (defines `app`)
                    → Service.js (registers the service)
                    → Controller.js (registers the controller)
                    │
⑥  Angular bootstraps because <body> says:
                    ng-app="ITEElecMachineProblemModule"
                    ng-controller="ITEElecMachineProblemController"
                    │
⑦  The controller function RUNS:
                    $scope.userArray = [];      ← empty array created
                    $scope.editingIndex = -1;   ← "not editing anything"
                    │
⑧  Angular walks the DOM and processes every directive:
                    ng-model  → binds each input to a $scope property
                    ng-repeat → renders one <tr> per array item
                    ng-init   → (Index only) calls GetWelcomeMessage()
```

**Why `Module.js` must load first:** it creates the global `app`. `Service.js` and `Controller.js` both start with `app.` — if `Module.js` hasn't run, you get `ReferenceError: app is not defined`. (That exact bug bit you in the earlier project: `Module.js` was committed as an empty file containing only a byte-order mark.)

---

## 4. File responsibilities

| File | Owns | Must never contain |
|---|---|---|
| `Module.js` | Declaring the module. One line. | Anything else |
| `Service.js` | Creating HTTP requests | Logic, validation, `$scope` |
| `Controller.js` | All logic: the array, CRUD, validation, redirects | Raw `$http` calls |
| `_MainLayout.cshtml` | Shell: head imports, nav, footer, script tags | Page-specific content |
| `MainController.cs` | Routing targets + data endpoints | HTML |
| `UserModel.cs` | The record's shape (10 properties) | Logic |
| `RouteConfig.cs` | Which page loads first, and URL shape | Anything else |
| `Views/Main/*.cshtml` | One page's markup | Script/link imports already in the layout |

---

## 5. The AngularJS pieces, one at a time

### 5.1 `ng-app` — starts Angular
```html
<body ng-app="ITEElecMachineProblemModule" ng-controller="ITEElecMachineProblemController">
```
`ng-app` names the **module** to boot. Everything inside `<body>` is Angular's territory. Putting it on `<body>` in the *layout* means all five pages get Angular automatically.

### 5.2 `$scope` — the bridge between JavaScript and HTML
```
        Controller.js                          the page
   ┌──────────────────────┐             ┌──────────────────────┐
   │  $scope.firstName    │ ◄─────────► │  ng-model="firstName"│
   │  $scope.userArray    │ ◄─────────► │  ng-repeat="udata in │
   │  $scope.editingIndex │             │              userArray"
   └──────────────────────┘             └──────────────────────┘
```
**Nothing in the view can see a plain `var`.** `var userArray = []` would be invisible to `ng-repeat`. Only `$scope.userArray` is reachable. This is the single most-tested idea in the subject.

### 5.3 `ng-model` — two-way binding
```html
<input id="first_name" type="text" ng-model="firstName" />
```
- **Typing** into the box updates `$scope.firstName`.
- **Setting** `$scope.firstName` in JavaScript updates the box.

*Both directions.* That is why `editFunc` can fill the form just by assigning to `$scope`, and why `clearRegistrationFunc` empties it the same way.

### 5.4 `ng-click` — Angular's `onclick`
```html
<button class="btn blue darken-3" ng-click="registrationFunc()">Register</button>
```
Different from plain `onclick` because the function is resolved **on the `$scope`**, not in global JavaScript.

### 5.5 `ng-init` — run something on load
```html
<div class="container center-align" ng-init="GetWelcomeMessage()">
```
Runs `GetWelcomeMessage()` once, when the view is compiled. Only `Index.cshtml` uses it.

### 5.6 `ng-repeat` — the dynamic table
```html
<tr ng-repeat="udata in userArray">
    <td>{{udata.EmpID}}</td>
    ...
    <button ng-click="editFunc($index)">Edit</button>
```
```
   $scope.userArray                     the DOM
   ┌──────────────┐                 ┌──────────────────┐
   │ index 0  ●───┼────────────────►│ <tr> row 1       │
   │ index 1  ●───┼────────────────►│ <tr> row 2       │
   │ index 2  ●───┼────────────────►│ <tr> row 3       │
   └──────────────┘                 └──────────────────┘
        ▲                                    │
        │  $index = 0,1,2…                   │  $index is the row's
        └────────────────────────────────────┘  position in the array
```
- `udata` is **one record** — the loop variable. It is *not* the whole array.
- `$index` is the row's position, and it **only exists inside `ng-repeat`**.
- The table is generated, not written. The spec explicitly requires this.

### 5.7 `{{ }}` — displaying data
```html
<td>{{udata.EmpID}}</td>
```
Braces go **back end → front end** (display). `ng-model` goes **front end → back end** (input). He states this as a rule: *"kapag mag-fetch ng data from back end to front end, double bracket yung ginagamit natin."*

---

## 6. CREATE — adding an employee

```
  user types into the 11 inputs
            │  (ng-model keeps $scope in sync)
            ▼
  click Register  ──►  registrationFunc()
            │
            ▼
  ① validateForm()  ── returns false? ──► Swal error, STOP.  Nothing is added.
            │ true
            ▼
  ② build the object to match UserModel's shape:
     var userData = { EmpID: $scope.empID, FName: $scope.firstName, … }
            │
            ▼
  ③ $scope.userArray.push(userData)
            │
            ▼
  ④ Swal.fire("Registered Successfully!")
            │
            ▼
  ⑤ clearRegistrationFunc()  → empties every field, resets editingIndex = -1
            │
            ▼
  ⑥ ng-repeat notices the array grew → a new <tr> appears
```

**Why step ⑤ matters:** clearing the form after a successful add prevents someone from double-clicking Register and pushing the same record twice.

**Why the object keys are PascalCase while the inputs are camelCase:**
```
   $scope.firstName  ──►  FName : value   ──►  UserModel.FName  (C#)
     (the input)          (the record key)      (the data class)
```
The object literal is the **translation layer**. Both spellings are deliberate.

---

## 7. READ — displaying the array

Already covered by `ng-repeat` in §5.6. The key requirements from the spec:

| Spec requirement | How it's met |
|---|---|
| Table displays records from the AngularJS array | `ng-repeat="udata in userArray"` |
| Generated dynamically | No hardcoded `<tr>` — one template row repeats |
| Must not manually write individual rows | ✅ zero hand-written rows |
| Must contain an Action column | `<th>Action</th>` with Edit + Delete buttons |
| Must reflect changes automatically | Angular re-renders whenever `userArray` changes |

**Why the table updates by itself:** AngularJS watches `$scope.userArray`. `push()` and `splice()` change the array, Angular re-runs `ng-repeat`, and the DOM follows. You never touch the DOM yourself — no `innerHTML`, no `createElement`.

---

## 8. UPDATE — editing an employee

This is the most interesting flow, because of `editingIndex`.

```
  $scope.userArray = [ row0 , row1 , row2 ]
                        ▲      ▲      ▲
                     index 0  index 1  index 2

  ── Step 1: click Edit on row 1 ────────────────────────────────
      editFunc(1)
        • copies row1's values INTO the form ($scope.firstName = row.FName, …)
        • $scope.confirmPassword = row.Password   ← so confirm doesn't block you
        • $scope.editingIndex = 1                 ← "I am editing row 1"

        ┌──────────────────────────────────────────────┐
        │  editingIndex = -1  →  NOT editing (default) │
        │  editingIndex =  1  →  editing array[1]      │
        └──────────────────────────────────────────────┘

  ── Step 2: user changes the form, clicks Update ───────────────
      updateFunc()
        ① editingIndex === -1 ?  → Swal "Click EDIT on a row first." → STOP
        ② validateForm()  →  invalid? → Swal error → STOP
        ③ var row = $scope.userArray[$scope.editingIndex]
           row.FName = $scope.firstName   ← overwrite the SAME object
           row.Email = $scope.email  …     (no push, no splice)
        ④ editingIndex = -1        ← leave edit mode
        ⑤ Swal "Updated Successfully!" + clear the form
```

### Two things you must be able to explain

**(a) Why `-1`?** It's a *sentinel*. Array indexes start at 0, so `-1` is a value that can never be a valid index. It means "no row is currently being edited." `updateFunc` checks it before doing anything.

**(b) Why does uniqueness validation skip a row?**
```javascript
for (var i = 0; i < $scope.userArray.length; i++) {
    if (i == $scope.editingIndex) {
        continue;          // ← skip YOURSELF
    }
    …check EmpID / Username / Email…
}
```
Without that `continue`, editing a record would compare it against **itself**, find a duplicate, and refuse to save. This is the detail that shows you understood the problem rather than copied a loop.

**(c) Why doesn't Update need `push` or `splice`?** Because `$scope.userArray[$scope.editingIndex]` is a *reference* to the existing object. Assigning to its properties mutates the object that's already in the array, so the table re-renders in place.

---

## 9. DELETE — removing an employee

```
  click Delete on row 1
        │
        ▼
  deleteFunc(1)
        │
        ▼
  ┌─────────────────────────────────────────────────┐
  │ Swal.fire({                                     │
  │     title: 'Deleting user',                     │
  │     text: "Are you sure?",                      │
  │     icon: 'warning',                            │
  │     showCancelButton: true  ◄── gives a Cancel  │
  │ })                                              │
  └───────────────────┬─────────────────────────────┘
                      │  returns a PROMISE
                      ▼
        .then(function (result) {
            if (result.isConfirmed) {      ◄── only true if they clicked "Yes"
                $scope.userArray.splice(userindex, 1);
            }
        });
```

**`splice(index, 1)`** = "starting at `index`, remove 1 item." The array closes the gap automatically, so row 2 becomes the new row 1.

**Why `.then` is needed here but not for Register:** `Swal.fire` with `showCancelButton` is *asynchronous* — it returns a promise that resolves only after the user answers. Without `.then`, the code would delete immediately and never wait for confirmation. (This is the same promise idea as the C# round trip in §10.)

The spec says *"A confirmation mechanism is strongly recommended"* — this is exactly that.

---

## 10. The C# round trip — the welcome message

This is the only Type B flow. It is the piece the spec calls out in §IV (*"The Controller must also demonstrate the ability to send data to a View"*).

```
  Index.cshtml
  <div ng-init="GetWelcomeMessage()">          ← fires on page load
              │
              ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Controller.js                                           │
  │   $scope.GetWelcomeMessage = function () {              │
  │       var getData =                                     │
  │           ITEElecMachineProblemService                  │
  │               .GetWelcomeMessage();      ◄── STEP 1     │
  │       getData.then(function (returnedData) {  ◄── STEP 2│
  │           Swal.fire({                                   │
  │               text: returnedData.data     ◄── STEP 4    │
  │           });                                           │
  │       });                                               │
  │   }                                                     │
  └────────────────────────┬────────────────────────────────┘
                           │
                           ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Service.js                                              │
  │   this.GetWelcomeMessage = function () {                │
  │       return $http.get('/Main/GetWelcomeMessage');      │
  │   };                          ◄── creates the request   │
  └────────────────────────┬────────────────────────────────┘
                           │  HTTP GET
                           ▼
  ┌─────────────────────────────────────────────────────────┐
  │ MainController.cs                                       │
  │   public JsonResult GetWelcomeMessage() {               │
  │       return Json("Welcome to the Employee Management   │
  │              System!", JsonRequestBehavior.AllowGet);   │
  │   }                            ◄── STEP 3  the answer   │
  └────────────────────────┬────────────────────────────────┘
                           │  JSON travels back to the browser
                           ▼
              returnedData.data  →  SweetAlert2 shows it
```

### The four steps to memorise
1. **Controller.js** asks the service for the HTTP method and stores it in `getData`.
2. **`.then(...)`** runs when the server replies.
3. **MainController.cs** produces the value and wraps it in `Json(...)`.
4. The result is on **`.data`**.

### Why `returnedData.data` and not `returnedData`?
The `$http` promise resolves to a **response object**, not to your raw value. That object has `.data`, `.status`, `.headers`, `.config`. The C# return value always sits in `.data`. Printing `returnedData` alone shows the whole envelope.

### Why `JsonRequestBehavior.AllowGet`?
By default ASP.NET MVC **refuses** to return JSON in response to a GET request, as a security measure. `AllowGet` explicitly opts in. Omit it and the browser gets an error instead of your data.

### Why is the app's whole CRUD not on the server?
Because the spec forbids a database and says CRUD must be done in AngularJS. The C# side is used *exactly* where the spec asks for it: supplying the welcome message to the Home view.

---

## 11. Validation inventory

`validateForm()` is called by **both** `registrationFunc` (Create) and `updateFunc` (Update) — so one ruleset protects both paths.

```
  validateForm()
      │
      ├── Required:      firstName, lastName, username, position, department
      ├── Numeric:       empID         /^\d+$/            digits only
      ├── Email format:  email         /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      ├── Password:      password      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
      │                                 → 8+ chars, lower, upper, number, special
      ├── Match:         password == confirmPassword
      ├── Contact no.:   contactNumber /^\d{11}$/         exactly 11 digits
      └── Uniqueness:    empID, username, email must not already exist
                         (skipping the row currently being edited)
      │
      └── returns true / false   ← the CALLER decides what to do with it
```

**Design note worth saying out loud:** `validateForm` **returns a boolean** and shows its own message. The caller does:
```javascript
if ($scope.validateForm() == false) {
    return;                 // stop — don't push, don't update
}
```
That way the same validation serves Create and Update without duplication.

**Regex explained, line by line** (be ready for this):

| Pattern | Meaning |
|---|---|
| `^\d+$` | start, one-or-more digits, end |
| `^[^\s@]+@[^\s@]+\.[^\s@]+$` | not-space/not-@ one or more, then `@`, then not-space/not-@ one or more, then a literal `.`, then more |
| `(?=.*[a-z])` | lookahead: at least one lowercase somewhere |
| `(?=.*[A-Z])` | lookahead: at least one uppercase somewhere |
| `(?=.*\d)` | lookahead: at least one digit somewhere |
| `(?=.*[\W_])` | lookahead: at least one non-word character (special) |
| `.{8,}` | then at least 8 of any character |

Lookaheads let you check several independent conditions **without consuming** the string, which is why one regex can enforce complexity.

**What's missing** (see the Compliance Audit for detail): length min/max validation, and no use of AngularJS's own `ng-pattern` / `ng-minlength` / `required` directives or MVC DataAnnotations.

---

## 12. Navigation map

```
                        ┌───────────────┐
                        │  LoginPage    │  ◄── DEFAULT page
                        │  (start here) │      (RouteConfig)
                        └───────┬───────┘
              ┌─────────────────┼──────────────────┐
              │                 │                  │
     Login button          Clear button      "Register here"
     redirectFunc         clearLoginFunc     redirectFunc
     ('/Main/Index')      (empties both)     ('/Main/RegistrationPage')
              │                                    │
              ▼                                    ▼
     ┌─────────────────┐                 ┌──────────────────────┐
     │   Index (Home)  │                 │  RegistrationPage    │
     │  ng-init asks   │                 │  full CRUD + table   │
     │  C# for welcome │                 └──────────────────────┘
     └────────┬────────┘
              │
     ┌────────┴────────┬─────────────────┐
     ▼                 ▼                 ▼
┌─────────┐     ┌────────────┐    ┌──────────────┐
│ About   │     │  Contact   │    │ Registration │
└─────────┘     └────────────┘    └──────────────┘

  Every page also carries the persistent nav bar in _MainLayout:
  Home · Registration · About · Contact · Logout(→LoginPage)
  and the footer Quick Links repeat four of them.
```

Nothing is isolated — every page is reachable from every other page through the layout nav, which is what spec §XVII requires.

---

## 13. Why this architecture (the "why" answers)

| Decision | Reason |
|---|---|
| 5 views in `Views/Main/` | The folder must match the controller's root name (`Main` ← `MainController`) |
| A custom layout | Spec forbids the default layout; layout avoids repeating nav/footer in 5 files |
| `ng-app` on `<body>` in the layout | One declaration covers all five pages |
| CRUD in an Angular array | Spec: no database, client-side CRUD |
| `UserModel.cs` in `Models/` | His rule: "anything about data goes in Models" |
| `JsonResult` for the welcome message | His stated preference for non-basic return types, and keeps the Angular side uniform |
| One `redirectFunc(url)` | His Week 2 suggestion: one reusable redirect, parameterised |
| Only one service method | Spec doesn't require server CRUD; the service exists to show the correct layering |

---

## 14. Questions he is likely to ask — with answers

### On AngularJS fundamentals

**Q: What is `$scope`?**
It's the glue object between the controller and the view. Anything the HTML needs to read or write must be attached to `$scope`. A plain `var` in the controller is invisible to the page.

**Q: Why is `userArray` on `$scope` and not a normal variable?**
Because `ng-repeat` reads it from the view. `var userArray = []` would never render a single row.

**Q: Difference between `ng-model` and `{{ }}`?**
`ng-model` is two-way *input* binding — data flows from the page into `$scope`. `{{ }}` is one-way *output* interpolation — data flows from `$scope` onto the page. He states it as: front-end-to-back-end uses a scope variable; back-end-to-front-end uses double braces.

**Q: What does `ng-repeat` do, and where did you put it?**
It loops over an array and stamps out one element per item. It's on the `<tr>`, not the `<table>` — putting it on the table would repeat the header row too.

**Q: What is `$index`?**
The zero-based position of the current item inside `ng-repeat`. It only exists inside `ng-repeat`. You pass it to `editFunc($index)` and `deleteFunc($index)` so the controller knows which row.

**Q: Difference between `ng-click` and `onclick`?**
`onclick` calls a global JavaScript function. `ng-click` evaluates an Angular expression against the `$scope`, so it can call `$scope.registrationFunc()` and participate in the digest cycle so the view updates.

**Q: What is `ng-init` for, and where did you use it?**
It runs an expression once when the view compiles. You used it on `Index.cshtml` to call `GetWelcomeMessage()` on load.

**Q: What is `ng-app` doing on the `<body>` tag?**
It tells Angular which module to bootstrap, and marks that everything inside `<body>` belongs to Angular. Putting it in the layout means all five pages get it.

### On the module / service / controller split

**Q: Why three separate files?**
Separation of concerns: the module declares, the service creates HTTP requests, the controller holds logic and executes. He explicitly warns that AI tools merge them into one file, which is the wrong approach.

**Q: Why must `Module.js` load before the other two?**
It defines the global `app`. `Service.js` and `Controller.js` both begin with `app.`, so if `Module.js` hasn't run, they throw `ReferenceError: app is not defined`.

**Q: What is `Service.js` actually for in your app — it only has one function?**
It exists to keep the layering correct. It creates the HTTP request; the controller executes it. The spec's CRUD doesn't need the server, so one method is all that's required.

**Q: Why `$http.get` here when he usually uses POST?**
This is his own "no parameter" pattern — that one returns `$http.get(...)` directly. POST is his preference for parameterised calls.

### On the CRUD logic

**Q: Walk me through what happens when I click Register.**
`registrationFunc()` runs → `validateForm()` checks every rule and returns `false` if anything fails (showing a SweetAlert and stopping) → otherwise it builds a `userData` object whose keys match `UserModel` → `push` into `$scope.userArray` → success alert → clear the form. `ng-repeat` sees the array grew and renders the new row.

**Q: Where does the data live? What happens on refresh?**
Only in the browser's memory, inside `$scope.userArray`. A refresh wipes it. That's expected — the spec says no database.

**Q: How does Edit know which record to change?**
The button passes `$index`, so `editFunc(index)` receives the row's position. It copies that row's values into the form's `$scope` properties and stores `editingIndex = index`.

**Q: What does `editingIndex` do, and why does it start at `-1`?**
It remembers which row is being edited. `-1` is the sentinel for "not editing", because no array index can be negative. `updateFunc` refuses to run when it's `-1`.

**Q: Why does Update need a validation call too?**
Because a user can edit a record into an invalid state — clear the email, break the password rule, or duplicate another record's username. Update must enforce the same rules as Create.

**Q: In your uniqueness check, why do you skip one index?**
Editing row 1 means row 1's own username is still in the array. Without `continue`, the record would be compared against itself, reported as a duplicate, and could never be saved.

**Q: Why doesn't Update push a new object?**
It mutates the existing object via `$scope.userArray[$scope.editingIndex]`, which is a reference to the object already stored in the array. So the table updates in place and no duplicate is created.

**Q: What does `splice(index, 1)` do?**
Removes 1 element starting at `index`. The array re-indexes itself, and `ng-repeat` re-renders.

**Q: Why does Delete use `.then` when Register doesn't?**
Because the delete confirmation dialog is asynchronous — `Swal.fire` with `showCancelButton` returns a promise that settles when the user answers. The `.then` waits for that answer and only splices if `result.isConfirmed` is true.

**Q: What stops someone from clicking Update before Edit?**
The `editingIndex === -1` check, which shows "Click EDIT on a row first." and returns.

**Q: Why do you set `confirmPassword` in `editFunc`?**
Because the stored record only has one password. Loading it into both password boxes means the "passwords match" rule passes and doesn't block your own edit.

### On validation

**Q: What kinds of validation did you implement?**
Required fields, numeric-only for employee ID, email format, password complexity (length + upper + lower + number + special), confirm-password matching, an 11-digit contact number pattern, and uniqueness for employee ID, username, and email.

**Q: How does the password regex work?**
Four lookaheads check for a lowercase, an uppercase, a digit, and a special character independently, then `.{8,}` requires at least 8 characters total.

**Q: Why is validation in the controller and not in the HTML?**
Because the rules have to run before anything is stored, and the same ruleset must serve both Create and Update. He also taught that validation belongs inside the registration function, not the markup.

**Q: How do you stop a bad record from being added?**
`validateForm()` returns `false`, and the caller `return`s immediately — so `push` is never reached.

**Q: Is your validation complete?** *(danger question — answer honestly)*
It covers required, format, pattern, match, and uniqueness. It does **not** yet cover length min/max, and it's hand-written JavaScript rather than AngularJS's `ng-pattern`/`ng-minlength` directives or MVC DataAnnotations. Naming the gap yourself is far better than being caught by it.

### On the C# side

**Q: How does the welcome message get from C# to the page?**
`Index.cshtml` has `ng-init="GetWelcomeMessage()"` → the controller stores the HTTP call in `getData` → `.then` waits → the service performed `$http.get('/Main/GetWelcomeMessage')` → `MainController.GetWelcomeMessage()` returns `Json(..., JsonRequestBehavior.AllowGet)` → the value is read from `returnedData.data` and shown by SweetAlert2.

**Q: Why `returnedData.data` and not just `returnedData`?**
`$http` resolves to a response envelope containing `.data`, `.status`, `.headers`, `.config`. The C# value is inside `.data`.

**Q: What is `JsonRequestBehavior.AllowGet`?**
MVC blocks JSON responses to GET requests by default for security. `AllowGet` explicitly permits it. Without it the request errors.

**Q: Why is a plain string wrapped in `JsonResult` instead of returning `string`?**
He stated he doesn't use basic return types for his actions — he uses `JsonResult`. It also keeps the Angular side uniform, since everything is read from `.data`. *(Be ready to say exactly this.)*

**Q: How does `/Main/GetWelcomeMessage` reach that method without any route attribute?**
`RouteConfig` defines `{controller}/{action}/{id}` with a default controller of `Main`. So the URL maps `Main` → `MainController` and `GetWelcomeMessage` → that public method automatically.

**Q: Is there real authentication?**
No. The spec says it isn't required. The Login button simply redirects to Home/Index.

### On structure and design

**Q: Which page loads first, and where is that decided?**
`LoginPage`, decided in `RouteConfig.cs` (`action = "LoginPage"`).

**Q: Why does `Views/Main/` exist?**
The folder under `Views` must match the controller's root name. `MainController` → `Views/Main/`.

**Q: Why is the layout name prefixed with an underscore?**
His rule: layout pages start with `_`, view pages do not. It distinguishes them at a glance.

**Q: What is `_ViewStart.cshtml` for?**
It sets the default layout for every view, so each page doesn't have to.

**Q: Why did you delete `HomeController` and the default views?**
The spec's "Important" section forbids submitting the default pages, default layout, or sample pages. Everything in the app is custom.

**Q: Which CSS framework, and why not Bootstrap?**
Materialize CSS 1.0.0, chosen because the spec forbids Bootstrap as the primary framework. Bootstrap files remain in `Content/` and `Scripts/` from the template but are **not referenced anywhere**.

**Q: How did you make it responsive?**
Materialize's 12-column grid — inputs use `col s12 m6` so they're full-width on phones and two-per-row from tablet up. *(Known gap: the nav bar is hidden on tablet/phone with no hamburger replacement.)*

**Q: What does `ng-disabled` / a form object do?** *(if asked about Angular validation)*
AngularJS creates a `FormController` per `<form>`; `formName.$invalid` and `formName.fieldName.$error` let you disable the submit button and show per-field messages. Not currently used here.

### The one he actually cares about

**Q: Explain to me why you put things where you put them.**
This is the real test, and it's the one he warned the class about: *"Nakita niyo yung mga sagutan niyo sa akin kanina hindi niyo maintindihan kung ano yung paglalagay niyo sa website niyo"* — students couldn't explain their own AI-generated layouts.

For every element you should be able to say the *why*:
- `ng-repeat` on `<tr>` — so only the row repeats, not the header.
- `editingIndex = -1` — sentinel, because no index is negative.
- Object keys PascalCase — they must match `UserModel`'s properties exactly.
- `var getData` before `.then` — because `$http` returns a promise, and the variable keeps the flow readable.
- `splice(index, 1)` — remove one element at that position; the array re-indexes itself.
- One `redirectFunc(url)` — one reusable function instead of five near-identical ones.

---

## 15. Quick-reference cheat sheet

### The six directives you used

| Directive | One line |
|---|---|
| `ng-app` | Names the module; starts Angular |
| `ng-controller` | Attaches a controller to a DOM section |
| `ng-model` | Two-way binding on an input |
| `ng-click` | Click handler resolved against `$scope` |
| `ng-init` | Runs once on load |
| `ng-repeat` | Loops an array; exposes `$index` |

### The controller's members

| Member | Purpose |
|---|---|
| `$scope.userArray` | The employee collection (CRUD storage) |
| `$scope.editingIndex` | Which row is being edited; `-1` = none |
| `$scope.redirectFunc(url)` | Reusable navigation |
| `$scope.loginFunc()` | ⚠️ defined but unused |
| `$scope.clearLoginFunc()` | Empties the login fields |
| `$scope.clearRegistrationFunc()` | Empties all 11 fields + resets `editingIndex` |
| `$scope.validateForm()` | All validation; returns `true`/`false` |
| `$scope.registrationFunc()` | CREATE |
| `$scope.editFunc(index)` | Loads a row into the form |
| `$scope.updateFunc()` | UPDATE |
| `$scope.deleteFunc(index)` | DELETE (with confirmation) |
| `$scope.GetWelcomeMessage()` | The C# round trip |

### The rules that cause silent failures

| Mistake | What happens |
|---|---|
| Object key ≠ `UserModel` property | Value is silently dropped / empty |
| Variable not on `$scope` | The view can't see it |
| `ng-repeat` on `<table>` instead of `<tr>` | The whole table repeats, headers included |
| No `else`/`return` after a validation failure | The invalid record still gets added |
| Uniqueness check without skipping the edited row | You can never save an edit |
| Reading `returnedData` instead of `returnedData.data` | You get the whole HTTP envelope |
| Omitting `JsonRequestBehavior.AllowGet` | The GET request errors |

### The one diagram to be able to draw from memory

```
  ng-model  ──►  $scope  ──►  userArray  ──►  ng-repeat  ──►  {{ }}
   (input)      (bridge)     (storage)      (loop)        (display)

                     │
                     └── one method only ▼
                    Service.js  ──►  MainController.cs  ──►  Json(...)
                                        ▲                        │
                                        └──── returnedData.data ──┘
```
