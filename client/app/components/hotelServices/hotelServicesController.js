(function (app){
    var hotel;
    (function (hotel) {
        'use strict'

        var hotelServicesController = function($scope,$uibModal,$log,$http, server, apis, growl, $localStorage){
            
        $scope.hotelData={};
        
        $scope.hotelData.actual = [
                {
                description:"Rooms Available",
                dayActual:"281",
                },
                 {
                description:"Rooms Sold",
                dayActual:"239",
                },
                {
                description:"Complimentary",
                dayActual:"8",
                },
                 {
                description:"Total Rooms Occupied",
                dayActual:"247",
                },
                 {
                description:"Occupancy % ",
                dayActual:"85%",
                },
                 {
                description:"Double Occupancy %",
                dayActual:"14%",
                },
            ]; 

            console.log($scope.hotelData);  
        hotelServicesController.$inject = ['$scope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage'];

        
        };
        angular.module('employeeApp').controller('app.hotelServicesController', hotelServicesController);
       
    }(app.hotel || (app.hotel = {})));
})(app || (app = {}));