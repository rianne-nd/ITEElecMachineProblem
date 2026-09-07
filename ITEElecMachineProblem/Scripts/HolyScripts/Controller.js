app.controller('ITEElecMachineProblemController', function ($scope, ITEElecMachineProblemService) {

    $scope.userarray = [];

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

    $scope.clearFunc = function () {
        $scope.loginUsername = '';
        $scope.loginPassword = '';
    }


});
