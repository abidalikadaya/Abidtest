(function(app) {
    var sidebar;
    (function(sidebar){
        var sidebarProcurementController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
        }
        sidebarProcurementController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.sidebarProcurementController', sidebarProcurementController);
    }(app.header || (app.header = {})));
})(app || (app = {}));