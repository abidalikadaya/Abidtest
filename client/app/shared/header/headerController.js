(function(app) {
    var header;
    (function(header){
        var headerController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
            $scope.logout = function(){
                $http.post(server.baseApiUrl+apis.logout).then(function (res) {
                    if(!!res.data.error){
                        console.log("error logging out");
                    }else{
                        $localStorage.$reset();
                        $state.go('login');
                    }
                });
            };
        }
        headerController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.headerController', headerController);
    }(app.header || (app.header = {})));
})(app || (app = {}));