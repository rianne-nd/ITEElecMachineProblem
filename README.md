# ITE Electronic Machine Problem 1-1 — Implementation Checklist

## Project Overview
ASP.NET MVC application with an AngularJS frontend. Theme: **Employee Management System ("EMS Portal")**.
Demonstrates client-side CRUD (in-memory AngularJS array — no database), form validation, and dynamic data binding.

---

## 1. Tech Stack & Setup
- [x] **ASP.NET MVC & C# Integration** — ASP.NET MVC 5, .NET Framework 4.7.2
- [x] **AngularJS Frontend Integration** — `angularjs` 1.8.2 installed; module in `Scripts/HolyScripts/Module.js` (module renamed to `ITEElecMachineProblemModule`)
- [x] **Non-Bootstrap CSS Framework** — Materialize CSS linked via CDN in `_MainLayout.cshtml`
- [x] **Custom Styling** — Materialize is the primary framework; page-level styling deferred to the frontend teammate
- [x] **No Default Templates** — default `HomeController`, `Views/Home/*`, `Views/Shared/_Layout.cshtml`, and `Error.cshtml` removed

> Note: the Bootstrap NuGet package and its files are still present but **unused** — acceptable as long as nothing references them.

---

## 2. Layout & Controllers
- [x] **Custom Master Layout (`_MainLayout.cshtml`)** — logo/branding (EMS Portal), nav bar linking all pages, header with Material icons, JS dependencies at the bottom
  - [x] Footer element (Materialize `page-footer blue darken-3` — EMS Portal branding, matches the nav theme)
- [x] **Custom C# Controller (`MainController.cs`)** — actions: `Index()`, `LoginPage()`, `RegistrationPage()`, `AboutPage()`, `ContactPage()`, and `GetWelcomeMessage()` (JSON)
- [x] **Server Data Passing** — `GetWelcomeMessage()` returns JSON consumed by AngularJS `$http`

---

## 3. Core Page Views

### Login View (`LoginPage.cshtml`)
- [x] Username input field
- [x] Password input field (bound with `ng-model="loginPassword"`)
- [x] Login button (redirects to `/Main/Index`)
- [x] Clear button (wired to `clearFunc()` — clears username + password)
- [x] Link/button to Registration page ("Register here")

### Registration View (`RegistrationPage.cshtml`)
- [ ] Registration form (page currently shows only a heading)
- [ ] Live dynamic data table (`ng-repeat`)

### Home View (`Index.cshtml`)
- [x] Displays welcome message from C# controller — `ng-init="GetWelcomeMessage()"` shows it via SweetAlert2

### About View (`AboutPage.cshtml`)
- [ ] Application info — heading only
- [ ] Features — not implemented
- [ ] Tech stack — not implemented
- [ ] Team details — not implemented

### Contact View (`ContactPage.cshtml`)
- [ ] Contact details — heading only
- [ ] Office location — not implemented
- [ ] Email — not implemented
- [ ] Social links — not implemented

---

## 4. Client-Side CRUD Operations (AngularJS)
- [x] In-memory array — `$scope.userarray = []` initialized in `Controller.js`
- [ ] CREATE — not implemented
- [ ] READ — not implemented
- [ ] UPDATE — not implemented
- [ ] DELETE — not implemented

---

## 5. Client-Side Form Validation (AngularJS)
- [ ] Required fields
- [ ] Email format
- [ ] Contact number
- [ ] Password strength
- [ ] Password matching
- [ ] Uniqueness rules
- [ ] User feedback (SweetAlert2)

---

## 6. System Flow & Navigation
- [x] All 5 views interconnected via nav header/links (`_MainLayout.cshtml`)
- [x] Login workflow redirects to Home dashboard (`/Main/Index`)

---

## Summary of Completed Features
- ✅ 5/5 Tech Stack & Setup
- ✅ 3/3 Layout & Controllers
- ✅ 5/5 Login View
- ✅ 1/1 Home View
- ✅ 2/2 System Flow & Navigation
- ⬜ 1/5 CRUD
- ⬜ 0/7 Validation
- ⬜ 0/2 Registration View
- ⬜ 0/4 About View
- ⬜ 0/4 Contact View

---

## Remaining Work (next up)
- Registration form + `ng-repeat` data table
- Complete CRUD (CREATE/READ/UPDATE/DELETE) in `Controller.js`
- Form validation rules
- About page content
- Contact page content
- (Frontend teammate) final styling pass on footer/layout/pages

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
- SweetAlert2 is used for all notifications (no vanilla `alert()`).
- AngularJS handles all dynamic data binding and DOM manipulation.
- Bootstrap files are present but unused (allowed — just don't reference them).
