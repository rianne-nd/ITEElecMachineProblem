# MACHINE PROBLEM 1-1 — REVIEWER & DEFENSE PREP
### EMS Portal — Employee Management System
### ASP.NET MVC 5 + C# + AngularJS · client-side CRUD, no database

> Everything here is written against **your actual code** in `ITEElecMachineProblem`.
> Sections 1–3 are what you should be able to say out loud. Sections 4–13 are the technical
> detail a teacher will dig into. Section 14 is the question bank. Section 15 is your safety net.

---

# 1. THE 60-SECOND ANSWER (memorise the shape of this)

> "My application is an **Employee Management System** built on **ASP.NET MVC 5 with C#**, with an
> **AngularJS** front end. There are **five Views** — Login, Registration, Home (Index), About and
> Contact — all of which use one **custom Layout** called `_MainLayout.cshtml`.
>
> The **C# `MainController`** handles routing and serves each View, and it also exposes a
> `GetWelcomeMessage()` action that **sends data to a View** as JSON.
>
> The **Registration page** is the functional core: it does full **CRUD on an AngularJS array**
> (`$scope.userArray`) — no database, everything happens on the client. The employee records
> are created, read into a table, updated and deleted purely in AngularJS.
>
> All input validation is **client-side in AngularJS** and reports problems through **SweetAlert2**
> popups — required fields, maximum length, email format, contact-number format, password strength,
> confirm-password match, numeric, range, uniqueness, and regex patterns."

---

# 2. ARCHITECTURE — THE BIG PICTURE

```
                    ┌───────────────────────── BROWSER ─────────────────────────┐
                    │                                                           │
   USER clicks  ──► │   HTML / CSS  (Tailwind + Materialize)                    │
                    │        ▲                                                  │
                    │        │  {{ data binding }}                             │
                    │   ┌────┴─────────────────────┐    ┌───────────────────┐   │
                    │   │ Razor Views (.cshtml)    │◄───┤ Controller.js     │   │
                    │   │ Views/Main/*.cshtml      │    │ ($scope, funcs)   │   │
                    │   └──────────────────────────┘    └─────────┬─────────┘   │
                    │                                              │             │
                    └──────────────────────────────────────────────┼─────────────┘
                                                                   │
                                    ① full page request            │ ② $http AJAX
                                       (window.location.href)      │    (welcome msg)
                                                                   ▼
                    ┌──────────────────────── SERVER (IIS / ASP.NET) ────────────┐
                    │                                                            │
                    │   Global.asax.cs  ──►  Application_Start()                 │
                    │        │                                                   │
                    │        ├─► RouteConfig.cs      (URL ➜ controller/action)   │
                    │        ├─► FilterConfig.cs     (global filters)            │
                    │        └─► BundleConfig.cs     (script/CSS bundles)        │
                    │                       │                                    │
                    │                       ▼                                    │
                    │            MainController.cs  (C# backend)                 │
                    │             • Index()            ➜ Views/Main/Index        │
                    │             • LoginPage()        ➜ Views/Main/LoginPage    │
                    │             • RegistrationPage() ➜ ...RegistrationPage     │
                    │             • AboutPage()        ➜ ...AboutPage            │
                    │             • ContactPage()      ➜ ...ContactPage          │
                    │             • GetWelcomeMessage()➜ JSON  ◄── ② returns     │
                    └────────────────────────────────────────────────────────────┘
```

**Two round trips happen in this app:**
1. **Normal navigation** — a full page load through ASP.NET MVC (① above).
2. **The welcome message** — an AJAX call from AngularJS to the C# controller (② above), which is how "the Controller sends data to a View".

---

# 3. ⚠️ THE #1 THING TEACHERS PROBE: "THE TWO CONTROLLERS"

There are **two completely different things both called "controller"** in this project. If you can
explain the difference cleanly, you look like you understand the stack.

| | `MainController.cs` | `Controller.js` |
|---|---|---|
| **Language** | C# | JavaScript |
| **Runs on** | the **server** (IIS) | the **browser** |
| **Framework** | ASP.NET MVC | AngularJS |
| **Job** | Route the URL, return a View or JSON | Hold the data (`$scope`), do CRUD + validation |
| **Class name** | `MainController` | `ITEElecMachineProblemController` |
| **File** | `Controllers/MainController.cs` | `Scripts/HolyScripts/Controller.js` |
| **Talks to** | Views (Razor), returns `View()` / `Json()` | Views (HTML), via `ng-model` / `{{ }}` |

> **Say this if asked:** *"`MainController` is the ASP.NET MVC controller on the server — it decides
> which View to return. `Controller.js` is the AngularJS controller in the browser — it owns the
> `$scope`, the `userArray`, and all the CRUD logic. They're two different layers that share a name
> by convention, not the same thing."*

---

# 4. BACKEND / FILE MAP — WHAT EACH FILE DOES

```
ITEElecMachineProblem/
│
├── Global.asax.cs ................ App_Start: runs ONCE when the app starts.
│                                   Calls RouteConfig, FilterConfig, BundleConfig.
│
├── App_Start/
│   ├── RouteConfig.cs ............ URL ROUTING. Default = Main / LoginPage.
│   ├── FilterConfig.cs ........... Registers global action filters (e.g. error handling).
│   └── BundleConfig.cs ........... Groups scripts/CSS into bundles.
│
├── Controllers/
│   └── MainController.cs ......... ⭐ THE BACKEND CONTROLLER
│                                   5 page actions + 1 JSON action (welcome message).
│
├── Models/
│   └── UserModel.cs .............. The C# shape of an employee record.
│                                   (Reference only — CRUD is client-side.)
│
├── Views/
│   ├── _ViewStart.cshtml ........ Tells EVERY view to use _MainLayout.
│   ├── Shared/
│   │   └── _MainLayout.cshtml ... ⭐ THE CUSTOM LAYOUT: header, nav, footer,
│   │                               CSS/JS includes, ng-app + ng-controller.
│   └── Main/
│       ├── LoginPage.cshtml
│       ├── RegistrationPage.cshtml ⭐ FORM + CRUD TABLE
│       ├── Index.cshtml .......... Home (welcome message)
│       ├── AboutPage.cshtml
│       └── ContactPage.cshtml
│
└── Scripts/HolyScripts/ .......... ⭐ THE ANGULARJS 3-TIER SPLIT
    ├── Module.js ................. Creates the module (the app container).
    ├── Service.js ................ Reusable $http calls (talks to C#).
    └── Controller.js ............. ⭐ $scope, data, CRUD, ALL VALIDATION.
```

---

# 5. REQUEST LIFECYCLE — WHAT HAPPENS ON EVERY PAGE LOAD

```
  ① You type / open   http://localhost:44348/Main/RegistrationPage
                              │
  ②                        IIS / ASP.NET starts up
                              │
  ③                     RouteConfig.cs matches the URL
                        ┌──────────────────────────────────────────┐
                        │ name:   "Default"                        │
                        │ url:    {controller}/{action}/{id}       │
                        │ defaults: Main / LoginPage               │
                        └──────────────────────────────────────────┘
                              │
                              ▼   controller = "Main", action = "RegistrationPage"
  ④             MainController.RegistrationPage()  runs in C#
                              │
                              ▼   return View();
  ⑤                MVC looks for the matching View file:
                        Views/Main/RegistrationPage.cshtml
                              │
  ⑥             _ViewStart.cshtml says: Layout = "~/Views/Shared/_MainLayout.cshtml"
                              │
  ⑦        _MainLayout.cshtml is rendered around the view:
                        <head>  → Tailwind, Materialize, SweetAlert2 CSS
                        <body ng-app="ITEElecMachineProblemModule"
                              ng-controller="ITEElecMachineProblemController">
                            header / nav
                            @RenderBody()   ← the view's HTML goes HERE
                            footer
                            scripts: jQuery → Materialize → SweetAlert2 → angular
                                     → Module.js → Service.js → Controller.js
                        </body>
                              │
  ⑧            Browser downloads the finished HTML and runs the scripts
                              │
  ⑨        AngularJS sees ng-app → boots the module
                              │
  ⑩        ng-controller creates $scope and runs Controller.js top-to-bottom:
                        $scope.userArray = [];
                        $scope.editingIndex = -1;
                        $scope.today = "...";
                        $scope.registrationFunc = function () {...};
                        ... etc.
                              │
  ⑪        AngularJS walks the DOM, binds every {{ }} and ng-model to $scope
                              │
  ⑫                      PAGE IS INTERACTIVE ✅
```

**Script order matters** — `angular.min.js` must load **before** `Module.js`, and `Module.js` before
`Service.js` and `Controller.js`, because each file depends on the previous one.

---

# 6. THE ANGULARJS 3-TIER FLOW

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Module.js                                                               │
 │   var app = angular.module("ITEElecMachineProblemModule", []);          │
 │   ➜ Creates the module = the container/namespace for the whole app.     │
 │     "app" is now a global variable the other two files use.             │
 └───────────────────────────────┬─────────────────────────────────────────┘
                                 │ app.service(...)
                                 ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Service.js                                                              │
 │   app.service('ITEElecMachineProblemService', function ($http) {        │
 │       this.GetWelcomeMessage = function () {                            │
 │           return $http.get('/Main/GetWelcomeMessage');                  │
 │       };                                                                │
 │   });                                                                   │
 │   ➜ Tier that talks to the SERVER. Reusable, one place for HTTP calls.  │
 │     $http is AngularJS's built-in AJAX service (dependency injection).  │
 └───────────────────────────────┬─────────────────────────────────────────┘
                                 │ injected into the controller
                                 ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Controller.js                                                           │
 │   app.controller('ITEElecMachineProblemController',                     │
 │              function ($scope, ITEElecMachineProblemService) { ... });  │
 │   ➜ Holds $scope (the data), all CRUD functions, all validation.        │
 └───────────────────────────────┬─────────────────────────────────────────┘
                                 │ $scope exposed to HTML
                                 ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Views (.cshtml)                                                         │
 │   ng-model="firstName"   ➜  two-way bind input  →  $scope.firstName     │
 │   {{udata.FName}}        ➜  one-way bind scope  →  text on screen       │
 │   ng-click="registrationFunc()"  ➜ calls the function in Controller.js  │
 │   ng-repeat="udata in userArray" ➜ loops the array to build table rows  │
 └─────────────────────────────────────────────────────────────────────────┘
```

> **Why split into 3 files?** Separation of concerns — the module *declares*, the service *fetches*,
> the controller *orchestrates*. It also mirrors the architecture taught in class.

---

# 7. DATA FLOW: THE WELCOME MESSAGE (Controller ➜ View)

This is the requirement *"the Controller must demonstrate the ability to send data to a View"*.

```
   ┌───────────────────────────────────────────────────────────────────────┐
   │ MainController.cs  (C# / SERVER)                                      │
   │                                                                       │
   │   public JsonResult GetWelcomeMessage()                               │
   │   {                                                                   │
   │       return Json("Welcome to the Employee Management System!",       │
   │                   JsonRequestBehavior.AllowGet);                      │
   │   }                                                                   │
   └───────────────────────────────┬───────────────────────────────────────┘
                                   │  HTTP GET /Main/GetWelcomeMessage
                                   │  response body:  "Welcome to the ..."
                                   ▼
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Service.js  (BROWSER)                                                 │
   │   return $http.get('/Main/GetWelcomeMessage');   → returns a PROMISE  │
   └───────────────────────────────┬───────────────────────────────────────┘
                                   │  .then(...)
                                   ▼
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Controller.js                                                         │
   │   $scope.GetWelcomeMessage = function () {                            │
   │       var getData = ITEElecMachineProblemService.GetWelcomeMessage(); │
   │       getData.then(function (returnedData) {                          │
   │           Swal.fire({ title: 'Welcome Message',                       │
   │                       text: returnedData.data, ... });                │
   │       });                                                             │
   │   }                                                                   │
   └───────────────────────────────┬───────────────────────────────────────┘
                                   │  ng-init="GetWelcomeMessage()"
                                   ▼
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Views/Main/Index.cshtml  (HOME PAGE)                                  │
   │   <div ... ng-init="GetWelcomeMessage()">                             │
   │   ➜ Runs the function when the Home page loads, and the message       │
   │     pops up as a SweetAlert.                                          │
   └───────────────────────────────────────────────────────────────────────┘
```

**Extra detail worth knowing:**
- `$scope.GetWelcomeMessage()` returns **before** the data arrives — that's why we use `.then()`.
  The `.then()` callback runs later, when the server finally replies.
- `returnedData.data` — `$http` wraps the response; the **actual JSON payload is in `.data`**.
- `JsonRequestBehavior.AllowGet` — by default ASP.NET MVC **blocks JSON from being returned to a GET**
  request (a security measure against JSON hijacking). `AllowGet` explicitly permits it. You'll be
  asked about this.

---

# 8. ⭐ EVERY INPUT VALIDATION — FULL REFERENCE

All validation lives in **`Controller.js` → `$scope.validateForm(userindex)`**.
It returns **`true`** if the form is valid, or shows a SweetAlert and returns **`false`** on the first
rule that fails (so only **one** message appears at a time).

## 8.1 The form fields

| # | Field (label) | `id` | `ng-model` | Type | Required |
|---|---|---|---|---|---|
| 1 | Employee ID | `emp_id` | `empID` | text | yes (via numeric regex) |
| 2 | First Name | `first_name` | `firstName` | text | yes |
| 3 | Middle Name | `middle_name` | `middleName` | text | **optional** |
| 4 | Last Name | `last_name` | `lastName` | text | yes |
| 5 | Suffix | `suffix` | `suffix` | text | **optional** |
| 6 | Birthday | `birthday` | `birthday` | date | yes |
| 7 | Email Address | `email` | `email` | email | yes (via format regex) |
| 8 | Password | `password` | `password` | password | yes (via strength regex) |
| 9 | Confirm Password | `confirm_password` | `confirmPassword` | password | yes (match) |
| 10 | Contact Number | `contact_number` | `contactNumber` | tel | yes (via format regex) |
| 11 | Position | `position` | `position` | text | yes |
| 12 | Department | `department` | `department` | text | yes |

## 8.2 The validation rules, in the exact order they run

| Order | Validation type | Field(s) | Rule | Message shown |
|---|---|---|---|---|
| 1 | **Required** | First Name | empty / undefined | `First name is required.` |
| 2 | **Required** | Last Name | empty / undefined | `Last name is required.` |
| 3 | **Numeric** | Employee ID | `/^\d+$/` | `Employee ID must be numeric.` |
| 4 | **Email format** | Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `Please enter a valid email address.` |
| 5 | **Password strength** | Password | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/` | `Password must be 8+ characters with uppercase, lowercase, number, and special character.` |
| 6 | **Confirm password** | Password vs Confirm | must be equal | `Passwords do not match.` |
| 7 | **Contact format** | Contact Number | `/^09\d{9}$/` | `Contact number must start with 09 and be exactly 11 digits.` |
| 8 | **Required** | Position | empty / undefined | `Position is required.` |
| 9 | **Required** | Department | empty / undefined | `Department is required.` |
| 10 | **Required** | Birthday | empty / undefined | `Birthday is required.` |
| 11 | **Range** | Birthday | not a future date | `Birthday cannot be a future date.` |
| 12 | **Max length** | Employee ID | ≤ 10 | `Employee ID cannot exceed 10 digits.` |
| 13 | **Max length** | First Name | ≤ 50 | `First name cannot exceed 50 characters.` |
| 14 | **Max length** | Middle Name *(if filled)* | ≤ 50 | `Middle name cannot exceed 50 characters.` |
| 15 | **Max length** | Suffix *(if filled)* | ≤ 10 | `Suffix cannot exceed 10 characters.` |
| 16 | **Max length** | Last Name | ≤ 50 | `Last name cannot exceed 50 characters.` |
| 17 | **Max length** | Email | ≤ 254 | `Email cannot exceed 254 characters.` |
| 18 | **Max length** | Password | ≤ 254 | `Password cannot exceed 254 characters.` |
| 19 | **Max length** | Position | ≤ 50 | `Position cannot exceed 50 characters.` |
| 20 | **Max length** | Department | ≤ 50 | `Department cannot exceed 50 characters.` |
| 21 | **Uniqueness** | Employee ID | not already in `userArray` | `Employee ID already exists.` |
| 22 | **Uniqueness** | Email | not already in `userArray` | `Email already exists.` |
| — | *(pass)* | — | — | returns `true` ✅ |

## 8.3 Validation decision tree

```
                     validateForm(userindex) called
                                 │
                                 ▼
        ┌──── Is First Name empty/undefined? ────┐
        │ YES → Swal "First name is required."   │
        │       return FALSE ✗                   │
        └───────────────────────────────────────-┘
                                 │ NO
                                 ▼
                  ... Last Name required ...
                                 │
                                 ▼
        ┌──── Does empID match /^\d+$/ ? ────────┐
        │ NO → Swal "Employee ID must be numeric"│
        │      return FALSE ✗                    │
        └───────────────────────────────────────-┘
                                 │ YES
                                 ▼
                  ... Email format, Password, Confirm,
                      Contact, Position, Department, Birthday ...
                                 │
                                 ▼
        ┌──── Is birthday a FUTURE date? ────────┐
        │ YES → Swal "Birthday cannot be a       │
        │       future date."  return FALSE ✗    │
        └───────────────────────────────────────-┘
                                 │ NO
                                 ▼
                  ... all maximum-length checks ...
                                 │
                                 ▼
        ┌──────────── Loop userArray: i = 0 .. n-1 ────────────┐
        │   if (i == userindex) continue;      ← skip itself   │
        │   if (array[i].EmpID == empID)  → "Employee ID       │
        │                                     already exists."│
        │   if (array[i].Email == email)  → "Email already     │
        │                                     exists."        │
        └──────────────────────────────────────────────────────┘
                                 │ all clear
                                 ▼
                          return TRUE ✅
```

## 8.4 The regexes explained (you WILL be asked)

**Employee ID — `/^\d+$/`**
- `^` start · `\d` any digit 0-9 · `+` one or more · `$` end
- → "the whole value must be one or more digits, nothing else"
- Note: because `+` requires **at least one** digit, an empty ID also fails here — that's why
  Employee ID has no separate "required" check.

**Email — `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`**
- `[^\s@]+` = one or more characters that are **not** whitespace and **not** `@` → the local part
- `@` a literal at-sign
- `[^\s@]+` again → the domain name
- `\.` a literal dot
- `[^\s@]+` → the extension (com, ph, …)
- → rejects `juan`, `juan@`, `@mail.com`, `juan @mail.com`, `juan@mail`

**Contact Number — `/^09\d{9}$/`**
- literally `09`, then `\d{9}` = **exactly nine more digits** → **11 digits total, must start with 09**

**Password — `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/`**
- `(?=.*[a-z])` **lookahead** = "somewhere ahead there is a lowercase letter"
- `(?=.*[A-Z])` = an uppercase letter
- `(?=.*\d)` = a digit
- `(?=.*[\W_])` = a **special character** (`\W` = not a word character; `_` added explicitly)
- `.{8,}` = **at least 8** of any character
- Lookaheads **don't consume** characters, so all five conditions are checked against the same string.

**Birthday range — `new Date($scope.birthday) > new Date($scope.today)`**
- `$scope.today` is built once at the top of `Controller.js` as `"YYYY-MM-DD"`.
- Both sides are converted to `Date` objects before comparing, because comparing a **Date to a
  string** in JavaScript silently gives `false` (the string becomes `NaN`).

---

# 9. CRUD — THE FULL LIFECYCLE

```
┌──────────────────────────── CREATE ─────────────────────────────────────────┐
│  User fills the form  ➜  clicks "Register Employee"                         │
│                                                                             │
│  registrationFunc()                                                         │
│      │                                                                      │
│      ├─ if ( validateForm(-1) == false ) return;      ← validate FIRST       │
│      │                                                                      │
│      ├─ var userData = { EmpID, FName, MName, Suffix, LName,                 │
│      │                   Birthday, Email, Password,                          │
│      │                   ContactNumber, Position, Department };              │
│      │                                                                      │
│      ├─ $scope.userArray.push(userData);        ← ADD TO THE ARRAY            │
│      │                                                                      │
│      ├─ Swal.fire({ ... "Registered Successfully!" ... })                    │
│      └─ $scope.clearRegistrationFunc();         ← empty the form             │
│                                                                             │
│  ➜ ng-repeat notices the array grew and draws a NEW ROW automatically        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── READ ───────────────────────────────────────────┐
│  <tr ng-repeat="udata in userArray">                                        │
│      <td>{{udata.EmpID}}</td>  <td>{{udata.FName}}</td>  ...                │
│                                                                             │
│  ➜ The table is generated FROM the array. No rows are hand-written in HTML.  │
│  ➜ One row per object, and it re-draws itself whenever the array changes.    │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── UPDATE ─────────────────────────────────────────┐
│  User clicks "Edit" on a row   ➜  editFunc($index)                          │
│      • copies array[index] values back into the form ($scope.firstName etc.) │
│      • $scope.editingIndex = index;          ← remembers WHICH row           │
│                                                                             │
│  User changes values, then clicks "Update"  ➜  updateFunc($index)            │
│      │                                                                      │
│      ├─ if ( validateForm(userindex) == false ) return;   ← validate FIRST   │
│      ├─ row.EmpID = $scope.empID;  row.FName = $scope.firstName;  ...        │
│      ├─ Swal.fire({ ... "Updated Successfully!" ... })                       │
│      └─ $scope.clearRegistrationFunc();                                     │
│                                                                             │
│  ➜ The SAME object is modified, so ng-repeat redraws the row in place.       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── DELETE ─────────────────────────────────────────┐
│  User clicks "Delete"  ➜  deleteFunc($index)                                │
│      │                                                                      │
│      ├─ Swal.fire({ title:"Deleting user", showCancelButton: true, ... })     │
│      │        .then(function (result) {          ← ASYNC! runs LATER         │
│      │            if (result.isConfirmed) {                                  │
│      │                $scope.$apply(function () {                            │
│      │                    $scope.userArray.splice(userindex, 1);             │
│      │                });                     ← remove 1 item at that index  │
│      │                Swal.fire({ ... "Deleted!" ... });                     │
│      │            }                                                          │
│      │        });                                                            │
│                                                                             │
│  ➜ splice(index, 1) = "starting at index, remove 1 element" → array shrinks  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why `splice` and not `delete`?**
`delete array[i]` leaves an **empty hole** — the array length doesn't change and `ng-repeat`
still renders a blank row. `splice(i, 1)` actually **removes** the element and shifts everything down,
so the array gets shorter and the row genuinely disappears.

---

# 10. THE `-1` CONVENTION AND `editingIndex`

```
  $scope.editingIndex = -1;    ← means "we are NOT editing anything (register mode)"
```

| Action | Passed to `validateForm` | Uniqueness loop skips | Why |
|---|---|---|---|
| **Register** (new record) | `-1` | nothing | no row belongs to this form yet |
| **Update** (existing row) | the row's `$index` | that row | otherwise it would flag itself as a duplicate |

The uniqueness loop:

```javascript
for (var i = 0; i < $scope.userArray.length; i++) {
    if (i == userindex) {      // ← skip the row being edited
        continue;
    }
    if ($scope.userArray[i].EmpID == $scope.empID) { ... "already exists" ... }
}
```

> **Say this:** *"-1 is a sentinel meaning 'no row is being edited'. Since array indexes start at 0,
> -1 can never match a real row, so during registration every existing record gets checked for
> duplicates. When updating, we pass the real index and skip that one row — otherwise the record
> would be compared against itself and always report a duplicate."*

---

# 11. WHY `$scope.$apply()` IN DELETE (a classic question)

```
   AngularJS keeps the page in sync through its "digest cycle".
   Anything that happens INSIDE AngularJS (ng-click, ng-model) triggers a digest automatically.
   Anything ASYNCHRONOUS and OUTSIDE AngularJS does NOT.

   ng-click → deleteFunc()
        │
        ├─ Swal.fire(...)  opens the popup and returns a PROMISE immediately
        │
        └─ .then(function(result){ ... })   ← this callback fires LATER, from SweetAlert2's
                                              own code, OUTSIDE AngularJS's digest.

                $scope.userArray.splice(...)   ← the data changes...
                ...but the view never re-renders! The row stays on screen.

                ✅ FIX:  $scope.$apply(function () { ... })
                         → forces AngularJS to run a digest right now,
                           so ng-repeat redraws the table immediately.
```

> **Say this:** *"SweetAlert2's `.then()` callback runs outside AngularJS's digest cycle, so changing
> the array there wouldn't refresh the view. `$scope.$apply()` re-enters the digest and makes the
> table update."*

---

# 12. WHY `type="button"` AND `ng-submit="$event.preventDefault()"`

- `type="button"` stops the button from acting as a **submit** button. The form is handled entirely
  by AngularJS `ng-click`, so a native submit (which would reload the page) is never wanted.
- `ng-submit="$event.preventDefault()"` is a second safety net: if the form ever *is* submitted
  (e.g. the user presses **Enter** in a text field), AngularJS cancels the default browser
  submission so the page doesn't reload and wipe the array.

---

# 13. WHERE THE DATA LIVES (and why it disappears)

```
   $scope.userArray = [];     ← an ordinary JavaScript ARRAY, held in browser memory.
                                There is NO database (the brief says none is required).

   Record shape (a plain JS object):
   {
       EmpID: "1001",
       FName: "Juan", MName: "Santos", Suffix: "Jr.", LName: "Dela Cruz",
       Birthday: <Date obj or "1990-05-07">,
       Email: "juan@mail.com",
       Password: "Abc123!x",
       ContactNumber: "09171234567",
       Position: "Developer",
       Department: "IT"
   }
```

**When you navigate to another page it resets.** Navigation uses `window.location.href`, which is a
**full page reload** — the browser throws away the old page, re-downloads the HTML and re-runs
`Controller.js` from the top, where `$scope.userArray = []` runs again. That's *expected* for this
activity (no database, no persistence).

---

# 14. ⭐ QUESTION BANK — ANSWERS READY

### A. Concepts

**Q: What is MVC?**
A: Model–View–Controller, a separation-of-concerns pattern. **Model** = the data shape
(`UserModel.cs`), **View** = what the user sees (`Views/Main/*.cshtml`), **Controller** = handles the
request and decides what to send back (`MainController.cs`).

**Q: Where is your Model used?**
A: `Models/UserModel.cs` documents the employee record shape on the C# side. The CRUD itself is
client-side (in the AngularJS array), as the brief requires, so the model is a **reference/contract**
— it's what you'd bind to if we later saved to a database.

**Q: Why are there two controllers?** → *see Section 3.* This is the most likely trick question.

**Q: What is the difference between `ActionResult` and `JsonResult`?**
A: Both are return types of controller actions. `ActionResult` is the general base — `View()` returns
an HTML page. `JsonResult` returns **JSON data** instead of HTML; that's what `GetWelcomeMessage()`
uses so AngularJS can read it with `$http`.

**Q: What does `return View();` do?**
A: It tells MVC to render the view whose name matches the action, inside the folder matching the
controller — e.g. action `RegistrationPage` in `MainController` → `Views/Main/RegistrationPage.cshtml`.

**Q: What is a Layout and why did you use one?**
A: A shared master page. `_MainLayout.cshtml` holds the header, navigation, footer, and all the CSS/JS
includes, and pulls in each page with `@RenderBody()`. `Views/_ViewStart.cshtml` assigns it to every
view, so all five pages share one consistent structure and I only write the chrome once.

**Q: How does routing work?**
A: `RouteConfig.cs` maps the URL pattern `{controller}/{action}/{id}` to a controller and action. The
default is `controller = "Main", action = "LoginPage"`, so opening the site's root lands on the Login page.

**Q: Where is `RouteConfig` called from?**
A: `Global.asax.cs` → `Application_Start()`, which runs once when the application starts. It also
calls `FilterConfig.RegisterGlobalFilters()` and `BundleConfig.RegisterBundles()`.

### B. AngularJS

**Q: What is `ng-app` and `ng-controller`?**
A: `ng-app="ITEElecMachineProblemModule"` on `<body>` tells AngularJS which module boots the app.
`ng-controller="ITEElecMachineProblemController"` attaches that controller's `$scope` to the element
and everything inside it.

**Q: What is `$scope`?**
A: The glue object between the JavaScript and the HTML. Whatever you put on `$scope` becomes
available in the view (`ng-model`, `{{ }}`), and vice-versa — that's **two-way data binding**.

**Q: `ng-model` vs `{{ }}`?**
A: `ng-model` is **two-way** — it binds an input to a scope variable in both directions.
`{{ }}` is **interpolation / one-way** — it just prints a scope value into the page.

**Q: What is `ng-repeat`?**
A: A directive that loops over a collection and clones the element once per item. I use it to build
the table: `ng-repeat="udata in userArray"`.

**Q: What is `$index`?**
A: The current loop position (0, 1, 2 …) that `ng-repeat` exposes. I pass it to
`editFunc($index)` / `updateFunc($index)` / `deleteFunc($index)` so the function knows which row.

**Q: What is `ng-init`?**
A: Runs an expression when the element is initialised. I use `ng-init="GetWelcomeMessage()"` on the
Home page so the welcome message is fetched as soon as the page loads.

**Q: What is a service, and why not just call `$http` in the controller?**
A: A service is a reusable, injectable object. Putting the `$http` calls in `Service.js` keeps the
controller focused on logic and gives one place to change endpoints — the "3-tier split" the lesson
teaches (Module → Service → Controller).

**Q: What is dependency injection here?**
A: AngularJS reads the function parameters and supplies them. In
`function ($scope, ITEElecMachineProblemService)` AngularJS injects the scope and my service — I never
`new` them myself.

**Q: What is the digest cycle?**
A: AngularJS's loop that compares watched values with their previous values and updates the DOM when
they differ. It runs automatically after AngularJS events; `$apply()` forces an extra one.

### C. Validation

**Q: Walk me through your validation.**
A: *(Use the table in Section 8.2 — start with the two required name checks, then the regex checks,
then the extra required fields, then range, then max lengths, and finally uniqueness. Mention that it
returns `false` on the first failure so the user sees one clear message at a time.)*

**Q: Why do you check `== undefined || == ''`?**
A: `undefined` means the user never touched the field; `''` means they typed and cleared it. Both mean
"empty", so both must be rejected. Checking only one would let the other slide through.

**Q: Why is there no "required" check for Email/Password/Contact/Employee ID?**
A: Their **format regexes already reject empty strings** — `+` requires at least one character, and a
bare `@` or `09` prefix can't match nothing. The explicit required checks are only needed for plain
text fields.

**Q: Why is Middle Name / Suffix not required?**
A: They're optional by design. Notice their max-length checks are also **guarded** with
`!= undefined && != ''` — so an empty optional field skips the length check instead of crashing on
`.length` of undefined.

**Q: How do you prevent duplicates?**
A: A loop over `userArray` compares the new Employee ID and Email against every existing record,
skipping the row currently being edited (`i == userindex`). If a match is found, it shows
`Employee ID already exists.` / `Email already exists.` and returns `false`.

**Q: Why is uniqueness the last check?**
A: It's the most expensive (it loops the whole array), so it only runs after all the cheap single-field
checks have passed.

**Q: How would you add a minimum length?**
A: Add `if ($scope.firstName.length < 2) { Swal.fire(...); return false; }` right after the required check.
Min-length was deliberately left out here; the password rule already enforces a minimum of 8.

**Q: Is this server-side or client-side validation?**
A: Client-side, in AngularJS. The brief explicitly asks for AngularJS client-side validation. A real
system would repeat the rules server-side, because client-side validation can be bypassed.

### D. CRUD / Data

**Q: What happens when you click Register?**
A: *(Recite the CREATE diagram in Section 9.)*

**Q: Why doesn't the table update on its own after a `push`?**
A: It does — `registrationFunc` runs inside an `ng-click`, which is an AngularJS event, so AngularJS
runs a digest afterwards and `ng-repeat` redraws. The problem case is only the **deletion**, whose
change happens inside SweetAlert2's async callback (Section 11).

**Q: How would you make the data persist across pages?**
A: Store it in `sessionStorage` or `localStorage` — `JSON.stringify($scope.userArray)` on every change
and `JSON.parse` it when the controller loads. Or, for real persistence, POST it to the C# controller
and save it server-side/database.

**Q: Is there a database?** A: No — the brief says none is required; the array is the "temporary collection".

**Q: What would change if you used a database?**
A: You'd add an Entity Framework model, a connection string in `Web.config`, and CRUD actions in
`MainController` for insert/select/update/delete. The AngularJS service would call those actions
instead of only `GetWelcomeMessage()`, and the array would be replaced by data from the server.

### E. Design / stack

**Q: What CSS framework did you use and why?**
A: **Tailwind CSS** as the primary framework (explicitly allowed by the brief) plus **Materialize CSS**
for the framework baseline, and **SweetAlert2** for all dialogs. Bootstrap is **not** used as the
primary framework, as the brief forbids it.

**Q: Why did you use `window.location.href` for navigation instead of `<a href>`?**
A: To keep navigation in one place (`redirectFunc`) so it's consistent and easy to change; it also
mirrors the professor's pattern. It does mean a **full page reload**, which is why the array resets.

---

# 15. ⚠️ WATCH-OUTS — KNOW THESE BEFORE HE ASKS

1. **The Login page has a Username field** ✅ — which is exactly what the brief's Section VI
   requires ("Username field, Password field, Login button, Clear button, Registration link").
   The field is `id="login_username"`, `ng-model="loginUsername"`, `type="text"`, and
   `clearLoginFunc()` clears both `loginUsername` and `loginPassword`.

2. **"Register Employee" always creates a new record** — even if you clicked **Edit** first. If you
   edit a row and then press Register (instead of Update), you get a duplicate. Update is only done
   through the row's own **Update** button, or by the separate update path. *If asked:* acknowledge it
   and say the fix is to route the button by `editingIndex` (if `-1` → register, else → update).

3. **Minimum length is not implemented** — only maximum. Be ready to say it was intentional (the
   password rule enforces a minimum of 8) and to write the one-line fix on the spot.

4. **Records are lost on refresh** — expected, no database. Say it confidently; it's the designed
   behaviour for this activity.

5. **The password is stored in plain text in the array** — fine for this activity, but say that a real
   system would hash it and never send it back to the client.

6. **`UserModel.cs` isn't wired into the CRUD** — it's a reference contract, not a data source.
   (And the password is *not* excluded from the table's underlying object; it simply isn't displayed.)

7. **Console warnings are not errors.** AngularJS 1.x may log deprecation notices; those don't affect
   the app.

---

# 16. GLOSSARY — SAY THESE WORDS CORRECTLY

| Term | Meaning in this project |
|---|---|
| **MVC** | Model–View–Controller — the architectural pattern ASP.NET uses |
| **Razor** | The `@`-syntax in `.cshtml` that mixes C# into HTML (`@RenderBody()`, `@ViewBag.Title`) |
| **Layout** | The shared master page (`_MainLayout.cshtml`) |
| **`@RenderBody()`** | Placeholder in the layout where the current view's HTML is injected |
| **Action** | A public method on a controller (`Index()`, `LoginPage()`) |
| **Routing** | Mapping URLs to controller/action (`RouteConfig.cs`) |
| **`JsonResult`** | An action return type that sends JSON instead of HTML |
| **`JsonRequestBehavior.AllowGet`** | Explicit permission to return JSON to a GET request |
| **AngularJS module** | The app container created in `Module.js` by `angular.module(...)` |
| **`$scope`** | The object that connects JavaScript data to the HTML |
| **Directive** | An HTML extension AngularJS provides (`ng-model`, `ng-repeat`, `ng-click`, `ng-if`) |
| **Interpolation** | Printing a scope value with `{{ }}` |
| **Data binding** | Automatic syncing between `$scope` and the DOM |
| **Service** | A reusable injectable object (`ITEElecMachineProblemService`) |
| **Dependency injection** | AngularJS supplying `$scope` / the service as function parameters |
| **Promise / `.then()`** | How `$http` hands you the response *later*, when it arrives |
| **Digest cycle / `$apply()`** | AngularJS's refresh loop; `$apply` forces it manually |
| **Regex / lookahead** | Pattern matching; `(?=...)` checks without consuming characters |
| **Sentinel value** | A special value meaning something ("`-1` = not editing") |
| **CRUD** | Create, Read, Update, Delete |

---

# 17. QUICK RECIPES — IF HE ASKS YOU TO ADD SOMETHING

**Add a required field**
1. Add the input in `RegistrationPage.cshtml`: `<input id="x" ng-model="x" /><label for="x">X</label>`
2. Clear it in `clearRegistrationFunc()`
3. Add a required check in `validateForm()`
4. Add it to the `userData` object in `registrationFunc()`
5. Add it to `editFunc()` and `updateFunc()`
6. Add a `<td>{{udata.X}}</td>` and a `<th>` in the table

**Add a minimum length**
```javascript
if ($scope.firstName.length < 2) {
    Swal.fire({ title: 'Notification!', text: 'First name must be at least 2 characters.', icon: 'error' });
    return false;
}
```

**Add a new uniqueness rule**
Copy an existing block inside the `for` loop and change the property:
```javascript
if ($scope.userArray[i].ContactNumber == $scope.contactNumber) {
    Swal.fire({ title: 'Notification!', text: 'Contact number already exists.', icon: 'error' });
    return false;
}
```

**Make the Register button switch to Update while editing**
```html
<button ng-click="(editingIndex == -1) ? registrationFunc() : updateFunc(editingIndex)">
    {{ editingIndex == -1 ? 'Register Employee' : 'Update Employee' }}
</button>
```

**Persist the data across pages (optional)**
```javascript
// when the controller loads:
$scope.userArray = JSON.parse(sessionStorage.getItem('employees') || '[]');
// after every push / update / delete:
sessionStorage.setItem('employees', JSON.stringify($scope.userArray));
```

---

# 18. THE DEMO ORDER (if you have to present live)

1. Open the app → it lands on **Login** (the default route).
2. Show **Clear** empties the fields → click **Login** → it redirects to **Home**.
3. On **Home**, the welcome message pops up — say *"that text came from the C# controller via `$http`"*.
4. Go to **Registration**. Click **Register** with empty fields → the first validation message appears.
5. Type a bad email → *"Please enter a valid email address."*
6. Type a weak password → the strength message. Fix it, mismatch the confirm → the mismatch message.
7. Enter a non-`09` contact number → the format message.
8. Pick a **future** birthday → *"Birthday cannot be a future date."*
9. Fill everything correctly → success → **the row appears in the table**.
10. Register a **duplicate** Employee ID / Email → the "already exists" message.
11. Click **Edit** → the form fills in → change the Position → click **Update** → the table updates.
12. Click **Delete** → the confirmation dialog appears → confirm → the row disappears.
13. Say: *"the table only refreshes because I wrapped the `splice` in `$scope.$apply()` — SweetAlert's
    callback runs outside AngularJS's digest cycle."*
14. Show **About** and **Contact** and the shared Layout/nav as the final "all pages connected" proof.

---

*Generated from the live source: `MainController.cs`, `Controller.js`, `Service.js`, `Module.js`,
`RouteConfig.cs`, `Global.asax.cs`, `UserModel.cs`, `Views/Main/RegistrationPage.cshtml`,
`Views/Shared/_MainLayout.cshtml`, `Views/_ViewStart.cshtml`.*
