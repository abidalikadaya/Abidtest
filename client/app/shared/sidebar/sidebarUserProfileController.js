(function(app) {
    var sidebar;
    (function(sidebar){
        var sidebarUserProfileController = function ($scope, $location, $http, server, apis, $state, $localStorage){
            if(!!$localStorage.userInfo){
                $scope.username = $localStorage.userInfo.userName;
            }
        }
        sidebarUserProfileController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage'];
        angular.module('employeeApp').controller('app.sidebarUserProfileController', sidebarUserProfileController);
    }(app.header || (app.header = {})));
})(app || (app = {}));