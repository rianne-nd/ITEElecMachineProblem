app.controller('ITEElecMachineProblemController', function ($scope, ITEElecMachineProblemService) {

    $scope.userArray = [];
    $scope.editingIndex = -1;

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

    $scope.clearRegistrationFunc = function () {
        $scope.empID = '';
        $scope.firstName = '';
        $scope.middleName = '';
        $scope.lastName = '';
        $scope.username = '';
        $scope.email = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.contactNumber = '';
        $scope.position = '';
        $scope.department = '';
        $scope.editingIndex = -1;
    };

    $scope.validateForm = function () {
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
        if ($scope.username == undefined || $scope.username == '') {
            Swal.fire({
                title: 'Notification!',
                text: 'Username is required.',
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
        if (!/^\d{11}$/.test($scope.contactNumber)) {
            Swal.fire({
                title: 'Notification!',
                text: 'Contact number must be exactly 11 digits.',
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

        // Uniqueness (skip the row currently being edited)
        for (var i = 0; i < $scope.userArray.length; i++) {

            if (i == $scope.editingIndex) {
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
            if ($scope.userArray[i].Username == $scope.username) {
                Swal.fire({
                    title: 'Notification!',
                    text: 'Username already exists.',
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

    $scope.registrationFunc = function () {

        if ($scope.validateForm() == false) {
            return;
        }

        var userData = {
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
        $scope.lastName = row.LName;
        $scope.username = row.Username;
        $scope.email = row.Email;
        $scope.password = row.Password;
        $scope.confirmPassword = row.Password;
        $scope.contactNumber = row.ContactNumber;
        $scope.position = row.Position;
        $scope.department = row.Department;
        $scope.editingIndex = index;
    };

    $scope.updateFunc = function () {
        if ($scope.editingIndex === -1 ) { //if its in editting mode
            Swal.fire({
                title: 'Notification!',
                text: 'Click EDIT on a row first.',
                icon: 'error'
            });

            return;
        }

        if ($scope.validateForm() == false) {
            return;
        }

        var row = $scope.userArray[$scope.editingIndex];
        row.EmpID = $scope.empID;
        row.FName = $scope.firstName;
        row.MName = $scope.middleName;
        row.LName = $scope.lastName;
        row.Username = $scope.username;
        row.Email = $scope.email;
        row.Password = $scope.password;
        row.ContactNumber = $scope.contactNumber;
        row.Position = $scope.position;
        row.Department = $scope.department;

        $scope.editingIndex = -1;

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

                $scope.userArray.splice(userindex, 1);

                Swal.fire({
                    title: 'Deleted!',
                    text: 'The record has been removed.',
                    icon: 'success'
                });
            }
        });
    };


});
