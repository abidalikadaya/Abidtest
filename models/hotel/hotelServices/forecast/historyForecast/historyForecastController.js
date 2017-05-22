(function (app) {
    var historyForecast;
    (function (viewForecast) {
        'use strict'

        var hotelHistoryForecastController = function ($scope, $rootScope, $uibModal, $log, $http, server, apis, growl, $localStorage, $timeout) {
            $http.get(server.baseApiUrl+apis.getHotelProjectWithPeriod).then(function(projectListWithYear){
                if(projectListWithYear.data.success){
                    $scope.projectListWithYear  = projectListWithYear.data.data;
                    $scope.projectWithYearMap = _.groupBy($scope.projectListWithYear, 'projectId');
                }else{
                    growl.error("Error getting projects and periods Data");
                }
             });

             $scope.updatePeriod = function(projectId){
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }

            $scope.getHistoryDate = function() {
                
            }
		}

        hotelHistoryForecastController.$inject = ['$scope','$rootScope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$timeout'];
        
        angular.module('employeeApp').controller('app.hotelHistoryForecastController', hotelHistoryForecastController);
    }(app.historyForecast || (app.historyForecast = {})));
})(app || (app = {}));