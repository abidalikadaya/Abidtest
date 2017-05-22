(function(app) {
    var sidebar;
    (function(sidebar){
        var sidebarController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
        }
        sidebarController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.sidebarController', sidebarController);
    }(app.header || (app.header = {})));
})(app || (app = {}));