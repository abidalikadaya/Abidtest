(function(app) {
    var sidebar;
    (function(sidebar){
        var sidebarAdminController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
        }
        sidebarAdminController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.sidebarAdminController', sidebarAdminController);
    }(app.header || (app.header = {})));
})(app || (app = {}));