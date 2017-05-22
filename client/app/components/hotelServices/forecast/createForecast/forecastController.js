(function (app) {
    var forecast;
    (function (createProject) {
        'use strict'

        var hotelForecastController = function ($scope, $rootScope, $uibModal, $log, $http, server, apis, growl, $localStorage, $timeout) {
            $scope.forecastViewText = true;
            $scope.forecastViewInput = false;
            $scope.forecastBoxShow = false;
            $scope.showConfirmChangeMessage = false;

            $scope.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

            $scope.monthIndex = {
                1 : 'jan',
                2 : 'feb',
                3 : 'mar',
                4 : 'apr',
                5 : 'may',
                6 : 'jun',
                7 : 'jul',
                8 : 'aug',
                9 : 'sep',
                10 : 'oct',
                11 : 'nov',
                12 : 'dec'
            }

            //Get hotel project with it's period
            $http.get(server.baseApiUrl+apis.getHotelProjectWithPeriod).then(function(projectListWithYear){
                if(projectListWithYear.data.success){
                    $scope.projectListWithYear  = projectListWithYear.data.data;
                    $scope.projectWithYearMap = _.groupBy($scope.projectListWithYear, 'projectId');
                }else{
                    growl.error("Error getting projects and periods Data");
                }
             });

            $scope.editView = function(){
                $scope.forecastViewText = false;
                $scope.forecastViewInput = true;
            }

            $scope.saveView = function(){
                $scope.finalSaveSubmit("save");
            }

            $scope.submitForecast = function(){
                $scope.finalSaveSubmit("submit");
            };

            $scope.approveForecast = function(){

            }

            $scope.rejectForecast = function(){
                angular.element("#comment-modal").modal('show');
            }

            $scope.rejectForecastSubmit = function(){
                console.log($scope.rejectCommentText);
                angular.element("#comment-modal").modal('hide');
            }

            $scope.finalSaveSubmit = function(operation){
                $scope.forecastViewText = true;
                $scope.forecastViewInput = false;
                var payload = {
                    forecastData : $scope.forecastData,
                    operation : operation
                };
                console.log(payload.forecastData);
                $http.post(server.baseApiUrl+apis.saveHotelForecast, payload).then(function(response){
                    if(response.data.success){
                        growl.success("Forecast data save successfully");
                    }else{
                        growl.error("Error in saving forecast field data");
                    }
                });
            }

            $scope.updatePeriod = function(projectId){
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }

            $scope.updateTotals = function(row, column){
                var occupancy = [[0,1], 4], // (1/0)*100
                    doubleOccupancy = [[3,11], 5], // ( (11/3)*100 ) - 100
                    averageDailyRate = [[1,12], 6], // round off (12/1)
                    averageDailyRateBreakfast = [[1,8,9,12], 7], // round off ( ((8*9)+12)/1 )
                    revenuePerAvailableRoom = [[0,12], 10], // round off (12/0)
                    totalRevenue = [[12,13,14], 15], // round off (12/0)
                    monthwiseData = {},
                    totalColumnData = {},
                    revenueRow = 15,
                    accumulativeRow = 16,
                    accumulativeCount = 0;

                $timeout(function () {
                    monthwiseData = _.map($scope.forecastData, $scope.monthIndex[column]);
                    var count = 0;
                    _.each($scope.forecastData[row],function(value, key){
                        if(_.includes(_.values($scope.monthIndex),key) && parseInt(value)){
                            count += parseInt(value);
                        }
                    });
                    $scope.forecastData[row].total = count;
                    totalColumnData = _.map($scope.forecastData, 'total');
                    if(_.includes(occupancy[0], row)){
                       $scope.forecastData[occupancy[1]][$scope.monthIndex[column]] = Math.round((parseInt(monthwiseData[1]) / parseInt(monthwiseData[0])) * 100);
                       $scope.forecastData[occupancy[1]]['total'] = Math.round((parseInt(totalColumnData[1]) / parseInt(totalColumnData[0])) * 100) || '';
                    }
                    if(_.includes(doubleOccupancy[0], row)){
                        $scope.forecastData[doubleOccupancy[1]][$scope.monthIndex[column]] = Math.round(((parseInt(monthwiseData[11]) / parseInt(monthwiseData[3])) * 100) - 100);
                        $scope.forecastData[doubleOccupancy[1]]['total'] = Math.round(((parseInt(totalColumnData[11]) / parseInt(totalColumnData[3])) * 100) - 100) || '';
                    }
                    if(_.includes(averageDailyRate[0], row)){
                         $scope.forecastData[averageDailyRate[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[1]));
                         $scope.forecastData[averageDailyRate[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[1])) || '';
                    }
                    if(_.includes(averageDailyRateBreakfast[0], row)){
                        $scope.forecastData[averageDailyRateBreakfast[1]][$scope.monthIndex[column]]  = Math.round((parseInt(monthwiseData[8]) * parseInt(monthwiseData[9])) + parseInt(monthwiseData[12])) / parseInt(monthwiseData[1]).toFixed(2);
                        $scope.forecastData[averageDailyRateBreakfast[1]]['total'] = Math.round((parseInt(totalColumnData[8]) * parseInt(totalColumnData[9])) + parseInt(totalColumnData[12])) / parseInt(totalColumnData[1]).toFixed(2) || '';
                    }
                    if(_.includes(revenuePerAvailableRoom[0], row)){
                        $scope.forecastData[revenuePerAvailableRoom[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[0]));
                        $scope.forecastData[revenuePerAvailableRoom[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[0])) || '';
                    }
                    if(_.includes(totalRevenue[0], row)){
                        $scope.forecastData[totalRevenue[1]][$scope.monthIndex[column]] = (parseInt(monthwiseData[12]) + parseInt(monthwiseData[13]) +  parseInt(monthwiseData[14]));
                        $scope.forecastData[totalRevenue[1]]['total'] = (parseInt(totalColumnData[12]) + parseInt(totalColumnData[13]) +  parseInt(totalColumnData[14])) || '';
                    }

                    var monthsTemp = [];
                    _.each($scope.monthIndex, function(value, key){
                        monthsTemp.push(value);
                        var sumData = _.at($scope.forecastData[revenueRow], monthsTemp),
                            sumRow = _.sum(sumData);
                        $scope.forecastData[accumulativeRow][value] = sumRow;
                    });

                }, 30);
            }

            $scope.getForecastDataCall = function(selectedProject, selectedPeriod){
                $scope.forecastBoxShow = true;
                $http.post(server.baseApiUrl+apis.getHotelForecast, {projectId : selectedProject, projectYear:selectedPeriod }).then(function(response){
                    $scope.forecastData  = response.data.data;
                });
            }

            $scope.updateForecastData = function(selectedProject, selectedPeriod){
                if($scope.showConfirmChangeMessage){
                    swal({
                        title: "Are you sure?",
                        text: "Please save chnages. You will not be able to recover once you chnage the project",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, chnage it!",
                        cancelButtonText: "No, cancel please!",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            $scope.getForecastDataCall(selectedProject, selectedPeriod);
                        }
                    });
                }else{
                    $scope.showConfirmChangeMessage = true;
                    $scope.getForecastDataCall(selectedProject, selectedPeriod);
                }
            }
		}

        hotelForecastController.$inject = ['$scope','$rootScope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$timeout'];
        
        angular.module('employeeApp').controller('app.hotelForecastController', hotelForecastController);
    }(app.forecast || (app.forecast = {})));
})(app || (app = {}));