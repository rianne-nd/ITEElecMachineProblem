app.service('ITEElecMachineProblemService', function ($http) {

    this.GetWelcomeMessage = function () {
        return $http.get('/Main/GetWelcomeMessage');
    };

    
});
