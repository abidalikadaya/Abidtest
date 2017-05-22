(function(app) {
    var sidebarBlankController;
    (function(sidebarBlankController){
        var sidebarBlankController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
        }
        sidebarBlankController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.sidebarBlankController', sidebarBlankController);
    }(app.sidebarBlankController || (app.sidebarBlankController = {})));
})(app || (app = {}));