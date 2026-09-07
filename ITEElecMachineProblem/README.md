# Machine Problem 1-1 — Build Roadmap & Checklist

> Companion to `Professor Rulebook & Architectural Guidelines.md`. The rulebook is the **rules**; this is the **plan** for applying them. Follow the phases top-to-bottom.

---

## 1. What the professor is actually grading (essential requirements)

From the brief + the lessons, these are non-negotiable:

1. **5 custom pages:** Login, Registration, Home (Index), About, Contact.
2. **Custom Controller** (not the default one) with an action per page, that **sends data to a View** (the Home welcome message).
3. **Custom Layout** (not the default one) with app name/logo, nav menu, header, footer, shared styling.
4. **Full client-side CRUD** on the Registration page using an **AngularJS array** (no database).
5. **Thorough validation** — NOT just "is it empty" (email format, password rules, confirm-password match, contact-number format, numeric, length, uniqueness, etc.).
6. **Navigation** — every page connected (menus, buttons, links).
7. **No Bootstrap** as the primary CSS framework (Materialize is the lesson default).
8. **No default ASP.NET pages/layout** — everything custom.
9. **The 3-file AngularJS split** (Module.js / Service.js / Controller.js) + correct script order + SweetAlert2 (no vanilla `alert()`).

---

## 2. Decide the theme (do this first)

**Recommendation: Employee Management System.**

Why: it is literally the professor's running example — his `UserModel` already has `FName/MName/LName/Position`, and his welcome-message example is *"Welcome to the Employee Management System!"*. Building what he demoed makes your code look exactly like the lessons (maximum anti-AI-detection alignment) and means you already have working reference code.

**Recommended registration fields** (each one maps to a required validation type):

| Field | Validation type it demonstrates |
|---|---|
| Employee ID | numeric + uniqueness |
| First / Middle / Last Name | required + length |
| Username | required + length + uniqueness |
| Email | format + uniqueness |
| Password | strength (length, upper, lower, number, special) |
| Confirm Password | match password |
| Contact Number | format (digits only) |
| Position | required |
| Department | required |
| Address | optional / length |
| Date of Birth | range/format |

If you'd rather do "System Users" or "Students", only the **field names and labels** change — the structure below is identical. Tell me the domain and I'll swap the field list.

---

## 3. Target file structure (what you'll end up with)

```
ITEElecMachineProblem/
├── App_Start/
│   └── RouteConfig.cs                 (default landing → Main/LoginPage)
├── Controllers/
│   └── MainController.cs              (all 5 actions + welcome message)
├── Models/
│   └── UserModel.cs                   (OPTIONAL — only if you demo 3-tier $http)
├── Views/
│   ├── _ViewStart.cshtml              (points to _MainLayout)
│   ├── Shared/
│   │   └── _MainLayout.cshtml         (CDNs, nav, header, footer, script order)
│   └── Main/
│       ├── LoginPage.cshtml
│       ├── RegistrationPage.cshtml
│       ├── Index.cshtml               (Home)
│       ├── AboutPage.cshtml
│       └── ContactPage.cshtml
├── Scripts/
│   ├── jquery-3.7.0.min.js
│   ├── angular.min.js
│   └── HolyScripts/
│       ├── Module.js
│       ├── Service.js
│       └── Controller.js
└── Content/
    └── Images/                        (any images go here, never loose in Content/)
```

---

## 4. Phase-by-phase roadmap

Work strictly in this order. Each phase is "create the file(s), then add the code."

### PHASE 0 — Plan (no code)
- [ ] Pick the domain (recommended: Employee Management System).
- [ ] Lock the field list (from Section 2).
- [ ] Sketch the flow: Login → Home → About / Contact / Registration; Login also links to Registration.

### PHASE 1 — Project setup
- [ ] **Create project:** ASP.NET Web Application (.NET Framework), **Empty** template, check **MVC** + **Configure for HTTPS**, target **4.8.1**.
- [ ] **Install NuGet:** `angularjs` (all lowercase) version **1.8.2**.
- [ ] **Set the default route** in `App_Start/RouteConfig.cs` to land on Login:

```csharp
routes.MapRoute(
    name: "Default",
    url: "{controller}/{action}/{id}",
    defaults: new { controller = "Main", action = "LoginPage", id = UrlParameter.Optional }
);
```

### PHASE 2 — C# backend (Controller first, per professor's order)
- [ ] **Create `Controllers/MainController.cs`** (Add → Controller → MVC 5 Controller - Empty), with one action per page:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ITEElecMachineProblem.Controllers
{
    public class MainController : Controller
    {
        public ActionResult LoginPage()
        {
            return View();
        }

        public ActionResult RegistrationPage()
        {
            return View();
        }

        public ActionResult Index()
        {
            ViewBag.WelcomeMessage = "Welcome to the Employee Management System!";
            return View();
        }

        public ActionResult AboutPage()
        {
            return View();
        }

        public ActionResult ContactPage()
        {
            return View();
        }
    }
}
```

> 💡 The `Index()` + `ViewBag.WelcomeMessage` satisfies "the controller must send data to a View". Keep it.

- [ ] (OPTIONAL, from lessons — not required by the MP) Create `Models/UserModel.cs` and add `$http` service methods if you want to demonstrate the full 3-tier fetch. For this MP, CRUD is **client-side only**, so you can skip this and still meet every requirement.

### PHASE 3 — Layout (the shared shell)
- [ ] **Create `Views/Shared/_MainLayout.cshtml`** (MVC 5 Layout Page). Include: Materialize CSS + icons + SweetAlert2 CSS in `<head>`; nav menu + header + footer in `<body>`; the exact script order at the bottom; `ng-app` + `ng-controller` on `<body>`.

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title>@ViewBag.Title</title>

    <!-- Materialize CSS & Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/iconfont/material-icons.min.css">

    <!-- SweetAlert2 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
</head>
<body ng-app="ITEElecMachineProblemModule" ng-controller="ITEElecMachineProblemController">

    <!-- NAVIGATION MENU -->
    <nav>
        <div class="nav-wrapper">
            <a href="/Main/Index" class="brand-logo">EmployeeMS</a>
            <ul class="right">
                <li><a href="/Main/Index">Home</a></li>
                <li><a href="/Main/RegistrationPage">Registration</a></li>
                <li><a href="/Main/AboutPage">About</a></li>
                <li><a href="/Main/ContactPage">Contact</a></li>
            </ul>
        </div>
    </nav>

    <div class="container">
        @RenderBody()
    </div>

    <!-- FOOTER -->
    <footer class="page-footer">
        <div class="container">© 2024 Employee Management System</div>
    </footer>

    <!-- JavaScript Dependencies -->
    <script src="~/Scripts/jquery-3.7.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
    <script src="~/Scripts/angular.min.js"></script>

    <!-- Application Scripts -->
    <script src="~/Scripts/HolyScripts/Module.js"></script>
    <script src="~/Scripts/HolyScripts/Service.js"></script>
    <script src="~/Scripts/HolyScripts/Controller.js"></script>
</body>
</html>
```

- [ ] **Create `Views/_ViewStart.cshtml`** so every view uses the layout:

```html
@{
    Layout = "~/Views/Shared/_MainLayout.cshtml";
}
```

### PHASE 4 — The 5 Views
- [ ] **`Views/Main/LoginPage.cshtml`** — username + password fields, Login button, Clear button, registration link.
- [ ] **`Views/Main/RegistrationPage.cshtml`** — the form (Materialize `input-field col` grid) + the `ng-repeat` table with Edit/Delete column.
- [ ] **`Views/Main/Index.cshtml`** — render the welcome message: `<h1>@ViewBag.WelcomeMessage</h1>`.
- [ ] **`Views/Main/AboutPage.cshtml`** — app description / features / technologies.
- [ ] **`Views/Main/ContactPage.cshtml`** — contact info.

Skeleton for the **Registration form + table** (the core page):

```html
<div class="row">
    <div class="input-field col s12 m6 l4">
        <input id="emp_id" type="text" ng-model="empID" />
        <label for="emp_id">Employee ID</label>
    </div>
    <div class="input-field col s12 m6 l4">
        <input id="first_name" type="text" ng-model="firstName" />
        <label for="first_name">First Name</label>
    </div>
    <!-- ...repeat for every field, ng-model matching the $scope variable... -->
</div>

<div class="row">
    <div class="col s12 m6 l4">
        <a class="waves-effect waves-light btn" style="width:100%" ng-click="registrationFunc()">
            <i class="material-icons left">person_add</i> Register
        </a>
    </div>
    <div class="col s12 m6 l4">
        <a class="waves-effect waves-light btn" style="width:100%" ng-click="updateFunc()">
            <i class="material-icons left">save</i> Update
        </a>
    </div>
</div>

<table class="striped">
    <tr>
        <th>ID</th><th>First Name</th><th>Last Name</th><th>Username</th><th>Email</th><th>Position</th><th>Action</th>
    </tr>
    <tr ng-repeat="udata in userarray">
        <td>{{udata.EmpID}}</td>
        <td>{{udata.FName}}</td>
        <td>{{udata.LName}}</td>
        <td>{{udata.Username}}</td>
        <td>{{udata.Email}}</td>
        <td>{{udata.Position}}</td>
        <td>
            <button ng-click="editFunc($index)">EDIT</button>
            <button ng-click="deleteFunc($index)">DELETE</button>
        </td>
    </tr>
</table>
```

> ⚠️ No `<html>`/`<body>` tags in any view — only the layout has them.

### PHASE 5 — The 3 AngularJS files (in this exact order)
- [ ] **`Scripts/HolyScripts/Module.js`:**

```javascript
var app = angular.module("ITEElecMachineProblemModule", []);
```

- [ ] **`Scripts/HolyScripts/Service.js`** (define the service; for a client-side CRUD it stays minimal, but the file MUST exist):

```javascript
app.service("ITEElecMachineProblemService", function ($http) {
    // (Optional) add $http methods here if you demo the 3-tier fetch from lessons
});
```

- [ ] **`Scripts/HolyScripts/Controller.js`** — the real work. Skeleton:

```javascript
app.controller("ITEElecMachineProblemController", function ($scope, ITEElecMachineProblemService) {

    $scope.userarray = [];
    $scope.editingIndex = -1;      // remembers which row is being edited

    // LOGIN: redirect to Home
    $scope.loginFunc = function () {
        window.location.href = "/Main/Index";
    };

    // CLEAR: empty the login fields
    $scope.clearFunc = function () {
        $scope.username = "";
        $scope.password = "";
    };

    // CREATE
    $scope.registrationFunc = function () {
        if (/* TODO: validation fails */) {
            Swal.fire({ title: "Notification!", text: "Please fix the errors.", icon: "error" });
        } else {
            var userdata = {
                EmpID: $scope.empID,
                FName: $scope.firstName,
                MName: $scope.middleName,
                LName: $scope.lastName,
                Username: $scope.username,
                Email: $scope.email,
                Password: $scope.password,
                ContactNumber: $scope.contactNumber,
                Position: $scope.position,
                Department: $scope.department
            };

            $scope.userarray.push(userdata);
            Swal.fire({ title: "Notification!", text: "Registered successfully!", icon: "success" });
            $scope.clearForm();
        }
    };

    // UPDATE: load the clicked row back into the form
    $scope.editFunc = function (userindex) {
        var row = $scope.userarray[userindex];
        $scope.empID = row.EmpID;
        $scope.firstName = row.FName;
        $scope.middleName = row.MName;
        $scope.lastName = row.LName;
        $scope.username = row.Username;
        $scope.email = row.Email;
        $scope.position = row.Position;
        $scope.department = row.Department;
        $scope.editingIndex = userindex;
    };

    // UPDATE: save the edited values
    $scope.updateFunc = function () {
        if ($scope.editingIndex < 0) {
            Swal.fire({ title: "Notification!", text: "Click EDIT on a row first.", icon: "error" });
            return;
        }
        // TODO: re-run validation
        var row = $scope.userarray[$scope.editingIndex];
        row.EmpID = $scope.empID;
        row.FName = $scope.firstName;
        // ...assign the rest...
        $scope.editingIndex = -1;
        Swal.fire({ title: "Notification!", text: "Record updated.", icon: "success" });
    };

    // DELETE with confirmation
    $scope.deleteFunc = function (userindex) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then(function (result) {
            if (result.isConfirmed) {
                $scope.userarray.splice(userindex, 1);
                Swal.fire({ title: "Deleted!", text: "The record has been removed.", icon: "success" });
            }
        });
    };

    // REDIRECT (registration link etc.)
    $scope.redirectFunc = function (page) {
        window.location.href = "/Main/" + page;
    };
});
```

### PHASE 6 — Validation (the heavily-graded part)
Fill in the `TODO` branches with **field-appropriate** checks. Examples to understand and adapt:

```javascript
// Required + empty (professor's dual-check pattern)
if (($scope.firstName == undefined || $scope.firstName == "") ||
    ($scope.lastName == undefined || $scope.lastName == "")) {
    Swal.fire({ title: "Notification!", text: "First/Last name is required.", icon: "error" });
    return;
}

// Email format
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test($scope.email)) {
    Swal.fire({ title: "Notification!", text: "Please enter a valid email address.", icon: "error" });
    return;
}

// Contact number (digits only, 11 digits)
if (!/^\d{11}$/.test($scope.contactNumber)) {
    Swal.fire({ title: "Notification!", text: "Contact number must be 11 digits.", icon: "error" });
    return;
}

// Password strength (min 8, upper, lower, number, special)
if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test($scope.password)) {
    Swal.fire({ title: "Notification!", text: "Password must be 8+ chars with upper, lower, number, and special.", icon: "error" });
    return;
}

// Confirm password
if ($scope.password != $scope.confirmPassword) {
    Swal.fire({ title: "Notification!", text: "Passwords do not match.", icon: "error" });
    return;
}

// Uniqueness (username / employee ID / email)
for (var i = 0; i < $scope.userarray.length; i++) {
    if ($scope.userarray[i].Username == $scope.username ||
        $scope.userarray[i].EmpID == $scope.empID ||
        $scope.userarray[i].Email == $scope.email) {
        Swal.fire({ title: "Notification!", text: "Username / ID / Email already exists.", icon: "error" });
        return;
    }
}
```

### PHASE 7 — Navigation & polish
- [ ] Wire every button/link: Login → Home, Login → Register link → Registration, nav menu → all pages.
- [ ] Replace **every** `alert()` with `Swal.fire`.
- [ ] Ensure `style="width:100%"` on full-width buttons and Materialize `input-field` wrappers on all inputs.

### PHASE 8 — Test & self-audit
- [ ] Run in **Chrome** with script debugging enabled (Ctrl+Shift+F9 to clear breakpoints).
- [ ] Walk the entire **Anti-AI Red Flag Checklist** (Section 18 of the rulebook) before submitting.
- [ ] Confirm: no default pages, no Bootstrap, no single-line code, no `document.getElementById`, no `onclick`, correct script order.

---

## 5. Complete todo checklist

**Phase 0 — Plan**
- [ ] Choose domain (recommended: Employee Management System)
- [ ] Lock registration field list
- [ ] Sketch page flow

**Phase 1 — Setup**
- [ ] New Empty MVC project (.NET Framework 4.8.1, HTTPS)
- [ ] NuGet `angularjs` 1.8.2
- [ ] RouteConfig default → Main/LoginPage

**Phase 2 — Backend**
- [ ] MainController.cs with 5 actions
- [ ] Index() sets ViewBag.WelcomeMessage
- [ ] (Optional) UserModel.cs + $http service methods

**Phase 3 — Layout**
- [ ] _MainLayout.cshtml (CDNs + nav + footer + script order + ng-app)
- [ ] _ViewStart.cshtml

**Phase 4 — Views**
- [ ] LoginPage.cshtml
- [ ] RegistrationPage.cshtml (form + ng-repeat table)
- [ ] Index.cshtml (welcome message)
- [ ] AboutPage.cshtml
- [ ] ContactPage.cshtml

**Phase 5 — AngularJS files**
- [ ] Module.js
- [ ] Service.js
- [ ] Controller.js (array, CRUD, redirect, Swal)

**Phase 6 — Validation**
- [ ] Required/empty
- [ ] Email format
- [ ] Contact number format
- [ ] Password strength
- [ ] Confirm password match
- [ ] Uniqueness (ID/username/email)

**Phase 7 — Navigation & polish**
- [ ] All buttons/links wired
- [ ] All alerts → Swal.fire
- [ ] Materialize wrappers + full-width buttons

**Phase 8 — Test**
- [ ] Run in Chrome, debug
- [ ] Pass the anti-AI checklist

---

## Quick answers to "how do we do it?"

- **Start with the backend, not the front end** (professor's own order: C# controller → Service.js → Controller.js → View).
- **One `MainController`** holds all five page actions (matches the lessons).
- **CRUD lives entirely in `Controller.js`** using `$scope.userarray` — no database, no C# model required for CRUD.
- **The only server→view data** is the Home welcome message via `ViewBag`.
- **Service.js must still exist** (architecture compliance) even though CRUD is client-side.
- **Every popup is `Swal.fire`, never `alert()`.**
- **Every redirect uses `window.location.href` starting with `/`** (e.g. `"/Main/AboutPage"`).
