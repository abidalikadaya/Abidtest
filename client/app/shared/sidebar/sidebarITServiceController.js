(function(app) {
    var sidebar;
    (function(sidebar){
        var sidebarITServiceController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
        }
        sidebarITServiceController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.sidebarITServiceController', sidebarITServiceController);
    }(app.header || (app.header = {})));
})(app || (app = {}));