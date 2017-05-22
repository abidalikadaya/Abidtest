(function(app) {
    var sidebar;
    (function(sidebar){
        var sidebarHRManagementController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
        }
        sidebarHRManagementController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.sidebarHRManagementController', sidebarHRManagementController);
    }(app.header || (app.header = {})));
})(app || (app = {}));