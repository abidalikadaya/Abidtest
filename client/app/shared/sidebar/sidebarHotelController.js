(function(app) {
    var sidebar;
    (function(sidebar){
        var sidebarHotelController = function ($scope, $location, $http, server, apis, $state, $localStorage,$rootScope){
            // if(!!$localStorage.userInfo){
            //     //$scope.username = $localStorage.userInfo.userName;
            //     $scope.userRoles = { isAdmin:false,isOperator:false,isController:false,isDashboard:false};
            //     var hotelUser = _.filter($localStorage.userInfo,["pluginName","Hotel"]);
            //     $scope.userRoles.isAdmin = _.some(hotelUser, {'roleName': 'admin'});
            //     $scope.userRoles.isOperator = _.some(hotelUser, {'roleName': 'operator'});
            //     $scope.userRoles.isController = _.some(hotelUser, {'roleName': 'controller'});
            //     $scope.userRoles.isDashboard = _.some(hotelUser, {'roleName': 'dashboard'});

            //     console.log($scope.userRoles);
            // }
        }
        sidebarHotelController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage','$rootScope'];
        angular.module('employeeApp').controller('app.sidebarHotelController', sidebarHotelController);
    }(app.header || (app.header = {})));
})(app || (app = {}));