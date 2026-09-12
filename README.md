# ITE Electronic Machine Problem 1-1 — Implementation Checklist

## Project Overview
ASP.NET MVC application with an AngularJS frontend. Theme: **Employee Management System ("EMS Portal")**.
Demonstrates client-side CRUD (in-memory AngularJS array — no database), form validation, and dynamic data binding.

---

## 1. Tech Stack & Setup
- [x] **ASP.NET MVC & C# Integration** — ASP.NET MVC 5, .NET Framework 4.7.2
- [x] **AngularJS Frontend Integration** — `angularjs` 1.8.2 installed; module in `Scripts/HolyScripts/Module.js` (`ITEElecMachineProblemModule`)
- [x] **Non-Bootstrap CSS Framework** — Materialize CSS linked via CDN in `_MainLayout.cshtml`
- [x] **Custom Styling** — Materialize is the primary framework (cards, grid, striped tables, helper text); deeper styling can be refined by the frontend teammate
- [x] **No Default Templates** — default `HomeController`, `Views/Home/*`, `Views/Shared/_Layout.cshtml`, and `Error.cshtml` removed

> Note: the Bootstrap NuGet package and its files are still present but **unused** — acceptable as long as nothing references them.

---

## 2. Layout & Controllers
- [x] **Custom Master Layout (`_MainLayout.cshtml`)** — logo/branding (EMS Portal), nav bar linking all pages, header with Material icons, footer, JS dependencies at the bottom
  - [x] Footer element (Materialize `page-footer blue darken-3` — EMS Portal branding + Quick Links, matches the nav theme)
- [x] **Custom C# Controller (`MainController.cs`)** — actions: `Index()`, `LoginPage()`, `RegistrationPage()`, `AboutPage()`, `ContactPage()`, and `GetWelcomeMessage()` (JSON)
- [x] **Server Data Passing** — `GetWelcomeMessage()` returns "Welcome to the Employee Management System!" as JSON, consumed by AngularJS `$http`

---

## 3. Core Page Views

### Login View (`LoginPage.cshtml`)
- [x] Card layout (centered)
- [x] Username input field
- [x] Password input field (bound with `ng-model="loginPassword"`)
- [x] Login button (redirects to `/Main/Index`)
- [x] Clear button (wired to `clearLoginFunc()` — clears username + password)
- [x] Link/button to Registration page ("Register here")

### Registration View (`RegistrationPage.cshtml`)
- [x] Registration form in a card (11 fields, `ng-model` bound)
- [x] Helper text under each field describing its requirements
- [x] Live dynamic data table in a card (`ng-repeat`) with per-row Edit/Delete + top Register/Update buttons

### Home View (`Index.cshtml`)
- [x] Card-style Home dashboard with welcome heading and quick action buttons
- [x] Displays welcome message from C# controller — `ng-init="GetWelcomeMessage()"` shows it via SweetAlert2

### About View (`AboutPage.cshtml`)
- [x] Application info
- [x] Features list
- [x] Tech stack (short paragraph)

### Contact View (`ContactPage.cshtml`)
- [x] Contact details (email / phone / office)
- [x] Working `mailto:` and `tel:` links

---

## 4. Client-Side CRUD Operations (AngularJS)
- [x] In-memory array — `$scope.userArray = []` initialized in `Controller.js`
- [x] CREATE — `registrationFunc()` pushes a validated record to `userArray`
- [x] READ — the table renders `userArray` via `ng-repeat`
- [x] UPDATE — `editFunc()` loads a row into the form, `updateFunc()` saves it back
- [x] DELETE — `deleteFunc()` removes a row after a confirm Swal

---

## 5. Client-Side Form Validation (AngularJS)
- [x] Required fields
- [x] Email format
- [x] Contact number (exactly 11 digits)
- [x] Numeric Employee ID
- [x] Password strength
- [x] Password matching
- [x] Uniqueness rules (EmpID / Username / Email)
- [x] User feedback (SweetAlert2)

---

## 6. System Flow & Navigation
- [x] All 5 views interconnected via nav header/links and footer Quick Links (`_MainLayout.cshtml`)
- [x] Login workflow redirects to Home dashboard (`/Main/Index`)
- [x] Default route lands on `Main/LoginPage`

---

## Summary of Completed Features
- ✅ 5/5 Tech Stack & Setup
- ✅ 3/3 Layout & Controllers
- ✅ 6/6 Login View
- ✅ 2/2 Home View
- ✅ 3/3 About View
- ✅ 2/2 Contact View
- ✅ 2/2 Registration View
- ✅ 5/5 CRUD
- ✅ 7/7 Validation
- ✅ 3/3 System Flow & Navigation

---

## Optional Polish (not required by the brief)
- Show the controller's welcome message on the Home page body (currently a SweetAlert popup)
- Add 1–2 sample records to `userArray` so the table is populated on load
- Add length validation (min/max) for name/username fields
- (Frontend teammate) final styling pass
- Replace the placeholder Contact details (email/phone/address) with real ones

---

## Technologies Used
- **Backend**: ASP.NET MVC 5, C#, .NET Framework 4.7.2
- **Frontend**: AngularJS 1.x, Materialize CSS, SweetAlert2
- **Icons**: Material Design Icons
- **HTTP Client**: AngularJS `$http` service

---

## File Structure
```
ITEElecMachineProblem/
├── App_Start/
│   ├── RouteConfig.cs
│   ├── BundleConfig.cs
│   └── FilterConfig.cs
├── Controllers/
│   └── MainController.cs
├── Models/
│   └── UserModel.cs
├── Views/
│   ├── _ViewStart.cshtml
│   ├── Main/
│   │   ├── Index.cshtml
│   │   ├── LoginPage.cshtml
│   │   ├── RegistrationPage.cshtml
│   │   ├── AboutPage.cshtml
│   │   └── ContactPage.cshtml
│   └── Shared/
│       └── _MainLayout.cshtml
├── Scripts/
│   ├── HolyScripts/
│   │   ├── Module.js
│   │   ├── Service.js
│   │   └── Controller.js
│   ├── angular.min.js
│   └── [other libraries]
└── Content/
    └── [CSS files]
```

---

## How to Run
1. Open the solution in Visual Studio
2. Build the solution (Ctrl+Shift+B)
3. Press F5 to run with debugging, or Ctrl+F5 without debugging
4. Default route lands on `Main/LoginPage`; home is at `Main/Index`

---

## Notes
- Uses in-memory storage via an AngularJS array (no database); all data operations are client-side only.
- Because data is in-memory, records reset on a full page reload/navigation — that is expected for this activity.
- SweetAlert2 is used for all notifications (no vanilla `alert()`).
- AngularJS handles all dynamic data binding and DOM manipulation.
- Bootstrap files are present but unused (allowed — just don't reference them).
