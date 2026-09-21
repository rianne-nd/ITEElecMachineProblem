# MP1 Compliance Audit — EMS Portal

**Project:** `C:\Users\Kath Puno\source\repos\ITEElecMachineProblem`
**Checked against:** the Rulebook (Weeks 1–4 conventions) **and** the MP1 task spec (`MACHINE PROBLEM 1-1.md`)

**Legend**

| Mark | Meaning |
|---|---|
| ✅ | Compliant — matches the rulebook / requirement |
| ⚠️ | Works, but deviates from a documented rule or is worth a second look |
| ❌ | Missing or non-compliant — likely to cost marks |

**Files audited:** `Module.js`, `Service.js`, `Controller.js`, `MainController.cs`, `UserModel.cs`, `_MainLayout.cshtml`, `_ViewStart.cshtml`, `RouteConfig.cs`, all five views.

---

## Headline verdict

**This is a strong submission.** Every hard requirement of MP1 is met, and all the rules that cause *silent* failures — the ones that give no error and just quietly produce wrong output — are correct. Specifically:

- All five views are custom; **no default controller, layout, or view survives**.
- The module/service/controller split is exactly right.
- **Every JavaScript object key matches its `UserModel` property exactly** (`EmpID`, `FName`, `MName`, `LName`, `Username`, `Email`, `Password`, `ContactNumber`, `Position`, `Department`).
- `var getData` → `.then(function (returnedData))` → `returnedData.data` is followed to the letter.
- No vanilla `alert()`, no raw hex codes in `class`, no `getElementById`.
- Validation is genuinely thorough — regex for email, password complexity, contact number, employee ID, plus uniqueness across three fields.

The gaps are **not** in the plumbing. They are in (1) **validation breadth** — the one area the spec says will be checked thoroughly — and (2) a handful of **style deviations** from rules the professor stated in class.

---

## A. Rulebook compliance

### A1. Golden rules (§0)

| # | Rule | Verdict | Evidence |
|---|---|---|---|
| 1 | Build order C# → Service → Controller → view | ✅ | `GetWelcomeMessage` exists in all four layers, consistent names |
| 2 | One job per file | ✅ | `Module.js` is literally one line; `Service.js` creates one request and does nothing else; `Controller.js` holds all logic |
| 3 | Never merge the three declarations | ✅ | Three separate files under `Scripts/HolyScripts/` |
| 4 | `<Project>Module` / `Service` / `Controller` | ✅ | `ITEElecMachineProblemModule` / `…Service` / `…Controller` |
| 5 | No identifier starts with a digit | ✅ | Project name has no leading digit |
| 6 | View state lives on `$scope` | ✅ | `$scope.userArray`, `$scope.empID`, `$scope.editingIndex`, … |
| 7 | Names match exactly across files | ✅ | Verified field by field — see A2 |
| 8 | `var getData` before `.then` | ✅ | `Controller.js:11-13` |
| 9 | Every `if` gets an `else` | ⚠️ | `validateForm` uses 10 early-return `if`s with no `else` — see C1 |
| 10 | Indent; never one-line logic | ✅ | Consistent 4-space indentation throughout |
| 11 | Project-wide imports in the layout | ✅ | Materialize, Icons, SweetAlert2 all in `_MainLayout` |
| 12 | Stop → rebuild → run after `.cs` edits | n/a | Process rule |
| 13 | Design for laptop, tablet, and phone | ⚠️ | Grid is responsive, but the nav bar is **hidden on tablet/phone with no replacement** — see C4 |

### A2. Naming conventions (§3)

| Thing | Expected | Actual | Verdict |
|---|---|---|---|
| Layout file | leading `_` | `_MainLayout.cshtml` | ✅ |
| View files | PascalCase, no `_` | `LoginPage`, `RegistrationPage`, `Index`, `AboutPage`, `ContactPage` | ✅ |
| C# controller | ends in `Controller` | `MainController` | ✅ |
| Model class | PascalCase, `…Model` | `UserModel` | ✅ |
| JS folder | PascalCase | `HolyScripts` | ✅ |
| Module variable | `app` | `app` | ✅ |
| C# actions ↔ view names | identical | `Index`↔`Index.cshtml`, `LoginPage`↔`LoginPage.cshtml`, … | ✅ |
| `ng-model` | lower camelCase | `firstName`, `lastName`, `contactNumber`, … | ✅ |
| Record keys | **PascalCase** | `FName`, `MName`, `LName`, `Position`, … | ✅ |
| Record keys ↔ C# model properties | **identical** | All 10 match exactly | ✅ |
| `ng-repeat` item | lower camelCase | `udata` | ✅ |
| Promise holder | `getData` | `getData` | ✅ |
| `.then` parameter | `returnedData` | `returnedData` | ✅ |
| Scope functions | `$scope.<verb>Func` | `redirectFunc`, `registrationFunc`, `editFunc`, `updateFunc`, `deleteFunc`, `loginFunc`, `clearLoginFunc`, `clearRegistrationFunc` | ✅ mostly |
| | | `GetWelcomeMessage`, `validateForm` | ⚠️ see note |

> **Note on `GetWelcomeMessage` and `validateForm`.** These two don't carry the `…Func` suffix. That is *defensible*, because a stronger rule overrides it: **the C# action name must be copied into the service and the controller unchanged.** `GetWelcomeMessage` appears identically in `MainController.cs`, `Service.js`, and `Controller.js`, which is exactly what he asked for. Don't rename it — you'd break the cross-file match to satisfy a cosmetic one. `validateForm` is a private helper that never crosses files, so it's free to be named anything.
>
> **Be ready to answer this if he asks.** The two rules genuinely conflict here; "I kept the C# name identical across all three files" is the right answer.

### A3. JavaScript conventions (§4)

| Rule | Verdict | Evidence |
|---|---|---|
| 4.1 `Module.js` — one line, module declared, `[]` empty | ✅ | `var app = angular.module("ITEElecMachineProblemModule", []);` |
| 4.2 Service — `this.X = function`, request creation only | ✅ | `this.GetWelcomeMessage = function () { return $http.get('/Main/GetWelcomeMessage'); };` |
| 4.2 `$http.get` for the no-parameter pattern | ✅ | This **is** his Pattern 1 — GET is correct here |
| 4.3 Controller — `var getData` then `.then` | ✅ | `Controller.js:10-21` |
| 4.3 Payload read as `returnedData.data` | ✅ | `Controller.js:16` |
| 4.4 No `getElementById`; use `ng-model` | ✅ | Zero occurrences |
| 4.5 Script load order | ✅ | **Exact match** to his reference layout: jQuery → Materialize JS → SweetAlert2 → angular → Module → Service → Controller |
| 4.6 SweetAlert2 v2 for all user-facing messages | ✅ | 15 `Swal.fire` calls, zero vanilla `alert()` |
| 4.6 SweetAlert2 imported project-wide | ✅ | Both the `.css` and the `.all.min.js` are in `_MainLayout` |

### A4. View & design conventions (§5)

| Rule | Verdict | Evidence |
|---|---|---|
| Import placement (project-wide → layout) | ✅ | `_MainLayout.cshtml:9-15, 66-67` |
| CDN, matching his reference | ✅ | Same cdnjs Materialize 1.0.0, same `material-design-icons`, same `sweetalert2@11` |
| Grid classes inside `class`, order s→m→l | ✅ | `col s12 m6`, `col s12 m6 offset-m3` |
| Nothing exceeds 12 columns per row | ✅ | Max 6 + 6 |
| Every field wrapped in its own `<div>` | ✅ | Every input is inside `<div class="input-field col s12 m6">` |
| Materialize input = `input` **then** `label for` | ⚠️ | Uses `placeholder=` + `<span class="helper-text">` instead of `<label for="…">` — see C3 |
| Palette colours, never raw hex in `class` | ✅ | `blue darken-3`, `red`, `grey` — no hex anywhere |
| Buttons as anchors with icon tags | ⚠️ | Layout/Login/Index use `<a class="btn">` ✅; RegistrationPage uses `<button class="btn">` ⚠️ — see C5 |
| Delete replaced markup | ✅ | No duplicated blocks |
| Responsive across breakpoints | ⚠️ | Nav hidden on med-and-down — see C4 |

### A5. C# conventions (§6)

| Rule | Verdict | Evidence |
|---|---|---|
| `public` + explicit return type | ✅ | All 6 actions |
| One `ActionResult` per view, name matches the file | ✅ | 5 actions for 5 views |
| No custom route attributes | ✅ | Routing is `{controller}/{action}` |
| Objects/lists → `JsonResult` + `Json(…, AllowGet)` | ✅ | `MainController.cs:37-40` |
| Simple value → `string` | ⚠️ | `GetWelcomeMessage` returns `JsonResult` wrapping a string — see note |
| Data class in `Models/`, auto-properties | ✅ | `Models/UserModel.cs` |
| Model property names match the JS keys | ✅ | All 10 verified |
| Data class actually used | ⚠️ | `UserModel` is not referenced by any action — see C6 |

> **On `JsonResult` for a string.** The rulebook lists "simple values → `string`", but he also said plainly: *"hindi po ako gumagamit ng mga basic ah data type return type for my function. Ang ginagamit ko po is Jason result."* Wrapping the welcome message in JSON is therefore **consistent with his stated personal preference**, and it keeps the Angular side uniform (`returnedData.data`). Keep it — but be ready to explain *why* you wrapped a plain string in JSON, because it's an obvious question.

### A6. Formatting & anti-patterns (§7, §9)

| Rule | Verdict |
|---|---|
| Indentation, no one-line logic | ✅ |
| Conditions grouped clearly | ✅ (one `if` per field, `A \|\| B` inside each) |
| Declare a variable before using it | ✅ (`getData`, `userData`, `row`, `i`) |
| No `getElementById` | ✅ |
| No default controller/layout/view | ✅ — `HomeController`, `Views/Home/`, `_Layout.cshtml` are all **gone** |
| No vanilla `alert()` | ✅ |
| No SweetAlert v1 | ✅ (v11) |
| No `<button>` nested inside a Materialize anchor | ✅ |
| No raw hex in `class` | ✅ |

---

## B. MP1 requirement checklist

| Spec section | Requirement | Verdict |
|---|---|---|
| III | Five views: Login, Registration, Home/Index, About, Contact | ✅ all five exist and are custom |
| III | CSS framework other than Bootstrap | ✅ Materialize 1.0.0 (Bootstrap unreferenced) |
| IV | Custom controller, not the default | ✅ `MainController`; `HomeController` deleted |
| IV | Controller must send data to a View | ✅ `GetWelcomeMessage` → `Index` |
| V | Custom layout with logo, nav, header, footer, styling | ✅ `_MainLayout` has all five |
| V | Required views use the custom layout | ✅ All five + `_ViewStart` |
| VI | Login: username, password, Login, Clear, Registration link | ✅ |
| VI-A | Login redirects to Home/Index | ✅ `redirectFunc('/Main/Index')` |
| VI-B | Clear empties username and password | ✅ `clearLoginFunc()` |
| VI-C | Registration link | ✅ "Register here" |
| VII | Registration form with appropriate employee fields | ✅ 11 fields |
| VIII | Complete CRUD using an AngularJS array | ✅ |
| IX | Array as temporary collection | ✅ `$scope.userArray = []` |
| IX | May include sample records | ⚠️ none — optional, but see C7 |
| X | CREATE: validate → object → push → appears in table | ✅ |
| XI | READ: dynamically generated table, Action column | ✅ `ng-repeat`, no hardcoded rows |
| XII | UPDATE: load into form, modify, validate, update object, table reflects | ✅ `editFunc` + `editingIndex` |
| XIII | DELETE: identify, confirm, remove, table reflects | ✅ `Swal` confirmation + `splice` |
| XIV | Home/Index with welcome message **from the C# Controller** | ✅ `ng-init="GetWelcomeMessage()"` |
| XV | About page | ✅ |
| XVI | Contact page | ✅ |
| XVII | All pages connected via nav | ✅ header nav + footer quick links + buttons |
| XVIII | **Validation, checked thoroughly** | ⚠️ strong but incomplete — see C1, C2 |
| XIX | Client-side validation with meaningful feedback | ✅ messages are clear and specific |

---

## C. Findings, by priority

### Priority 1 — most likely to cost marks

**C1. No length validation (min / max / string length).** ❌

The spec explicitly lists **Length Validation** — *"Minimum length, Maximum length, String length"* — and nothing in `validateForm` checks length. Everything is either "not empty" or a regex.

*Suggested additions:*
```javascript
if ($scope.firstName.length < 2 || $scope.firstName.length > 50) { … }
if ($scope.username.length < 5 || $scope.username.length > 20) { … }
if ($scope.position.length > 50) { … }
```

---

**C2. Validation is hand-written JavaScript, not AngularJS or ASP.NET MVC validation.** ⚠️

The spec says: *"You must research the different types of validation available in ASP.NET MVC and AngularJS and determine which validations are appropriate."* Your checks are plain regex and `if` statements inside the Angular controller — correct and working, but they demonstrate **JavaScript**, not the frameworks' own validation features.

*Suggested additions (choose what fits):*
- **AngularJS form validation:** put the inputs in a `<form name="regForm">`, add `required`, `ng-minlength="5"`, `ng-maxlength="20"`, `ng-pattern="/^\d+$/"` to the inputs, and disable the button with `ng-disabled="regForm.$invalid"`. This shows you used Angular's validation directives. You can also display `regForm.username.$error` messages inline.
- **ASP.NET MVC:** put `[Required]`, `[StringLength(50, MinimumLength = 2)]`, `[EmailAddress]`, `[RegularExpression(...)]` on `UserModel` properties. (Note: without server-side binding this won't run — but it shows the research, and he *did* teach data classes.)

Even adding just the AngularJS constraint attributes would visibly answer this requirement.

---

### Priority 2 — deviations from stated rules

**C3. Inputs use `placeholder` instead of the Materialize `<label for>` pattern.** ⚠️

His documented pattern is:
```html
<div class="input-field col s12 m6">
    <input id="first_name" type="text" ng-model="firstName">
    <label for="first_name">First Name</label>
</div>
```
Yours uses `placeholder="First Name"` + `<span class="helper-text">`. Two consequences: you lose Materialize's **animated floating label**, and your `id` attributes (`emp_id`, `first_name`, …) are now orphaned — no `<label for>` points at them.

*Fix:* replace each `placeholder="X"` with a `<label for="id">X</label>` placed **after** the input. Keep the helper-text spans — they're good.

---

**C4. The nav bar disappears on tablet and phone with nothing replacing it.** ⚠️

`_MainLayout.cshtml:25` uses `class="right hide-on-med-and-down"`. On a tablet or phone the menu is hidden, and there's no Materialize **sidenav** (hamburger) — so the only remaining navigation is the footer's Quick Links.

*Fix:* add a Materialize sidenav with a `sidenav-trigger` button in the nav wrapper:
```html
<a href="#" data-target="mobile-nav" class="sidenav-trigger"><i class="material-icons">menu</i></a>
<ul class="sidenav" id="mobile-nav"> … same links … </ul>
```
and initialise it with `M.Sidenav.init(document.querySelectorAll('.sidenav'))`. This also directly supports golden rule 13 ("design for laptop, tablet, and phone").

---

**C5. `RegistrationPage` uses `<button class="btn">` for Register/Update and the table actions.** ⚠️

His rule: *"in a Materialize button, the ng-click goes on the anchor tag and the inner button tag must be removed."* Your `_MainLayout`, `LoginPage`, and `Index` follow this correctly. `RegistrationPage` does not.

*Nuance worth knowing:* his own reference code kept plain `<button>` in the **table** for EDIT/DELETE, so the table is defensible. The **Register** and **Update** buttons are the clearer deviation — those are the main form buttons:

```html
<a class="btn blue darken-3" ng-click="registrationFunc()">
<i class="material-icons left">person_add</i> Register</a>
```

---

**C6. `UserModel.cs` is never used.** ⚠️

Nothing in `MainController` takes a `UserModel` parameter, so the class is currently dead code. It matches the JS keys perfectly, which is excellent, but a grader may ask "where is your model used?"

*Options:* either wire one action to accept it (e.g. a `CollectiveSave(UserModel model)` that returns `Json(model, JsonRequestBehavior.AllowGet)`), or be ready to explain that it documents the record shape and is ready for the database phase. Wiring it is the stronger answer and it demonstrates the `JsonResult` + model pattern he taught in Week 4.

---

**C7. No sample records in the array.** ⚠️

Spec section IX says *"You may also include initial/sample records."* It's optional, but pre-loading two rows means the table demonstrates READ the instant the page loads, before anyone types anything. Cheap win for a demo:
```javascript
$scope.userArray = [
    { EmpID: '001', FName: 'Juan', MName: 'Reyes', LName: 'Dela Cruz', Username: 'juan123',
      Email: 'juan@email.com', Password: 'Juan@1234', ContactNumber: '09171234567',
      Position: 'Developer', Department: 'IT' },
    { EmpID: '002', FName: 'Maria', MName: 'Santos', LName: 'Santos', Username: 'maria456',
      Email: 'maria@email.com', Password: 'Maria@1234', ContactNumber: '09181234567',
      Position: 'Designer', Department: 'Creative' }
];
```
⚠️ **Careful:** if you add samples, uniqueness validation will then block you from re-using those IDs/usernames/emails during testing.

---

### Priority 3 — polish and code hygiene

**C8. `loginFunc` is dead code.** ⚠️ `Controller.js:23-25` defines `$scope.loginFunc`, but `LoginPage.cshtml:20` calls `redirectFunc('/Main/Index')` instead. Delete `loginFunc`, or use it. (Minor: `loginFunc` and `redirectFunc` do the same thing, and `loginFunc` has no `}` semicolon consistency either.)

**C9. `href=""` on the "Register here" link is risky.** ⚠️ `LoginPage.cshtml:24` uses `<a href="" ng-click="redirectFunc('/Main/RegistrationPage')">`. An empty `href` resolves to the *current* URL, so the browser's default navigation can fight with your `window.location.href` assignment — the link may reload the login page instead of going to Registration. Change it to `href="#!"` (the Materialize convention you already use for the brand logo) or to a plain `<a>` without `href`.

**C10. Empty employee ID / contact number give the wrong message.** ⚠️
```javascript
if (!/^\d+$/.test($scope.empID))       → "Employee ID must be numeric."
if (!/^\d{11}$/.test($scope.contactNumber)) → "Contact number must be exactly 11 digits."
```
If the field is *blank*, the user is told the format is wrong rather than that the field is required. Add an explicit required check first, then the format check — the same two-step pattern he taught in Week 2.

**C11. No range validation anywhere.** ⚠️ The spec lists Range Validation "where applicable". You have no numeric-range field (no Date of Birth, no salary, no age). Either add one field that supports a range check, or be ready to say range validation isn't applicable to your field set. Adding a Date of Birth with an "age must be 18+" style check would close this off cleanly.

**C12. `editingIndex` isn't reset when a delete removes the row being edited.** ⚠️ Edge case: click Edit on row 2, then Delete row 0 — `editingIndex` still points at the old numeric position, which now refers to a *different* record. Low impact, but worth a line in `deleteFunc`: if `$scope.editingIndex === userindex`, reset it to `-1`.

**C13. `// GET: Main` scaffold comment.** Cosmetic — it's the only leftover from the generated controller.

---

## D. What is genuinely well done

Worth knowing, because these are the things most likely to be asked about:

1. **`editingIndex` is the right design.** Using a sentinel of `-1` for "not editing" and skipping that index during uniqueness checks (`Controller.js:132-134`) is a real, thoughtful touch — it lets you edit a record without tripping its own uniqueness rule. That's the kind of detail that reads as understanding rather than copying.
2. **The uniqueness loop covers three fields** and correctly `continue`s past the row being edited.
3. **Password complexity regex** `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$` is textbook-correct lookahead usage.
4. **`editFunc` pre-fills `confirmPassword` from the stored password** so the confirm check doesn't block your own edit. Small thing, correct thing.
5. **Update guards against being clicked with no row selected** and tells the user to click Edit first.
6. **Delete uses `showCancelButton`** — exactly the "confirmation mechanism strongly recommended" from the spec.
7. **`redirectFunc(targetURL)` is parameterised**, so one function serves every link — this is the "one reusable redirect function" he asked for in Week 2.
8. **The layout order matches his reference byte-for-byte** in spirit: same CDNs, same order, same icon library.
9. **No defaults survive.** `HomeController`, `Views/Home/`, and `_Layout.cshtml` are all gone, which is the explicit "Important" instruction at the top of the spec.
