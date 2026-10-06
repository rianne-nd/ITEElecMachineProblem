app.controller('ITEElecMachineProblemController', function ($scope, ITEElecMachineProblemService) {

    $scope.userArray = [];

    // -1 is registering
    $scope.editingIndex = -1;

    var now = new Date();
    var mm = ('0' + (now.getMonth() + 1)).slice(-2);
    var dd = ('0' + now.getDate()).slice(-2);
    $scope.today = now.getFullYear() + '-' + mm + '-' + dd;

    $scope.redirectFunc = function (targetURL) {
        window.location.href = targetURL;
    };

    $scope.GetWelcomeMessage = function () {
        var getData = ITEElecMachineProblemService.GetWelcomeMessage();

        getData.then(function (returnedData) {
            Swal.fire({
                title: 'Welcome Message',
                text: returnedData.data,
                icon: 'info',
                confirmButtonText: 'OK'
            });
        });
    }

    $scope.loginFunc = function () {
        window.location.href = '/Main/Index';
    }

    $scope.clearLoginFunc = function () {
        $scope.loginUsername = '';
        $scope.loginPassword = '';
    }

    $scope.patterns = {
        empID: /^\d+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        contactNumber: /^09\d{9}$/
    };

    $scope.onEmpIDInput = function () {
        if ($scope.empID) {
            $scope.empID = $scope.empID.replace(/\D/g, '');
        }
    };

    $scope.onContactNumberInput = function () {
        if ($scope.contactNumber) {
            $scope.contactNumber = $scope.contactNumber.replace(/\D/g, '');
        }
    };

    $scope.clearRegistrationFunc = function () {
        $scope.empID = '';

        $scope.firstName = '';
        $scope.middleName = '';
        $scope.suffix = '';
        $scope.lastName = '';
        $scope.birthday = '';
        $scope.email = '';

        $scope.password = '';
        $scope.confirmPassword = '';

        $scope.contactNumber = '';
        $scope.position = '';
        $scope.department = '';

        $scope.editingIndex = -1;

        if ($scope.regForm) {
            $scope.regForm.$setPristine();
            $scope.regForm.$setUntouched();
        }
    };

    // userindex = the row being edited, or -1 when registering a new record
    $scope.validateForm = function (userindex) {

        if ($scope.firstName == undefined || $scope.firstName == '') {
            Swal.fire({
                title: 'Notification!',
                text: 'First name is required.',
                icon: 'error'
            });
            return false;
        }
        if ($scope.lastName == undefined || $scope.lastName == '') {
            Swal.fire({
                title: 'Notification!',
                text: 'Last name is required.',
                icon: 'error'
            });
            return false;
        }
        if (!/^\d+$/.test($scope.empID)) {
            Swal.fire({
                title: 'Notification!',
                text: 'Employee ID must be numeric.',
                icon: 'error'
            });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.email)) {
            Swal.fire({
                title: 'Notification!',
                text: 'Please enter a valid email address.',
                icon: 'error'
            });
            return false;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test($scope.password)) {
            Swal.fire({
                title: 'Notification!',
                text: 'Password must be 8+ characters with uppercase, lowercase, number, and special character.',
                icon: 'error'
            });
            return false;
        }
        if ($scope.password != $scope.confirmPassword) {
            Swal.fire({
                title: 'Notification!',
                text: 'Passwords do not match.',
                icon: 'error'
            });
            return false;
        }
        if (!/^09\d{9}$/.test($scope.contactNumber)) {
            Swal.fire({
                title: 'Notification!',
                text: 'Contact number must start with 09 and be exactly 11 digits.',
                icon: 'error'
            });
            return false;
        }
        if ($scope.position == undefined || $scope.position == '') {
            Swal.fire({
                title: 'Notification!',
                text: 'Position is required.',
                icon: 'error'
            });
            return false;
        }
        if ($scope.department == undefined || $scope.department == '') {
            Swal.fire({
                title: 'Notification!',
                text: 'Department is required.',
                icon: 'error'
            });
            return false;
        }
        if ($scope.birthday == undefined || $scope.birthday == '') {
            Swal.fire({
                title: 'Notification!',
                text: 'Birthday is required.',
                icon: 'error'
            });
            return false;
        }
        if (new Date($scope.birthday) > new Date($scope.today)) {
            Swal.fire({
                title: 'Notification!',
                text: 'Birthday cannot be a future date.',
                icon: 'error'
            });
            return false;
        }

        // unique check
        for (var i = 0; i < $scope.userArray.length; i++) {

            if (i == userindex) {
                continue;
            }
            if ($scope.userArray[i].EmpID == $scope.empID) {
                Swal.fire({
                    title: 'Notification!',
                    text: 'Employee ID already exists.',
                    icon: 'error'
                });
                return false;
            }
            if ($scope.userArray[i].Email == $scope.email) {
                Swal.fire({
                    title: 'Notification!',
                    text: 'Email already exists.',
                    icon: 'error'
                });
                return false;
            }
        }

        return true;
    };

    $scope.touchAllFields = function () {
        if ($scope.regForm) {
            angular.forEach($scope.regForm, function (control) {
                if (control && control.$setTouched) {
                    control.$setTouched();
                }
            });
        }
    };

    $scope.registrationFunc = function () {
        $scope.touchAllFields();

        if ($scope.validateForm(-1) == false) {
            return;
        }

        var userData = {

            EmpID: $scope.empID,

            FName: $scope.firstName,
            MName: $scope.middleName,
            Suffix: $scope.suffix,
            LName: $scope.lastName,
            Birthday: $scope.birthday,
            Email: $scope.email,

            Password: $scope.password,

            ContactNumber: $scope.contactNumber,
            Position: $scope.position,
            Department: $scope.department
        };

        $scope.userArray.push(userData);
        Swal.fire({
            title: 'Notification!',
            text: 'Registered Successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        $scope.clearRegistrationFunc();
    }

    $scope.editFunc = function (index) {
        var row = $scope.userArray[index];

        $scope.empID = row.EmpID;

        $scope.firstName = row.FName;
        $scope.middleName = row.MName;
        $scope.suffix = row.Suffix;
        $scope.lastName = row.LName;
        $scope.birthday = row.Birthday;
        $scope.email = row.Email;

        $scope.password = row.Password;
        $scope.confirmPassword = row.Password;

        $scope.contactNumber = row.ContactNumber;

        $scope.position = row.Position;
        $scope.department = row.Department;

        $scope.editingIndex = index;

        if ($scope.regForm) {
            $scope.regForm.$setPristine();
            $scope.regForm.$setUntouched();
        }
    };

    $scope.updateFunc = function (userindex) {
        $scope.touchAllFields();

        if ($scope.validateForm(userindex) == false) {
            return;
        }

        var row = $scope.userArray[userindex];
        row.EmpID = $scope.empID;
        row.FName = $scope.firstName;
        row.MName = $scope.middleName;
        row.Suffix = $scope.suffix;
        row.LName = $scope.lastName;
        row.Birthday = $scope.birthday;
        row.Email = $scope.email;
        row.Password = $scope.password;
        row.ContactNumber = $scope.contactNumber;
        row.Position = $scope.position;
        row.Department = $scope.department;

        Swal.fire({
            title: 'Notification!',
            text: 'Updated Successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        $scope.clearRegistrationFunc();
    };

    $scope.deleteFunc = function (userindex) {
        Swal.fire({
            title: 'Deleting user',
            text: "Are you sure?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then(function (result) {
            if (result.isConfirmed) {

                $scope.$apply(function () {
                    $scope.userArray.splice(userindex, 1);
                });

                Swal.fire({
                    title: 'Deleted!',
                    text: 'The record has been removed.',
                    icon: 'success'
                });
            }
        });
    };


});
