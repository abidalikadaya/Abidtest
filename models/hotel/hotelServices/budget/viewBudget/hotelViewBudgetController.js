(function (app) {
    var budget;
    (function (viewBudget) {
        'use strict'

        var hotelViewBudgetController = function ($scope, $rootScope, $uibModal, $log, $http, server, apis, growl, $localStorage, $timeout) {
            //$scope.budgetViewText = true;
           // $scope.budgetViewInput = false;
            $scope.cloneBudgetData = [];
            $scope.budgetBoxShow = false;
            //$scope.showConfirmChangeMessage = false;
            $scope.daysInMonthList = [];

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

            $scope.daysInMonth = function(month,year) {
                return new Date(year, month, 0).getDate();
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
                    monthwiseData = _.map($scope.budgetData, $scope.monthIndex[column]);
                    var count = 0;
                    _.each($scope.budgetData[row],function(value, key){
                        if(_.includes(_.values($scope.monthIndex),key) && parseInt(value)){
                            count += parseInt(value);
                        }
                    });
                    $scope.budgetData[row].total = count;
                    totalColumnData = _.map($scope.budgetData, 'total');
                    if(_.includes(occupancy[0], row)){
                       $scope.budgetData[occupancy[1]][$scope.monthIndex[column]] = Math.round((parseInt(monthwiseData[1]) / parseInt(monthwiseData[0])) * 100);
                       $scope.budgetData[occupancy[1]]['total'] = Math.round((parseInt(totalColumnData[1]) / parseInt(totalColumnData[0])) * 100) || '';
                    }
                    if(_.includes(doubleOccupancy[0], row)){
                        $scope.budgetData[doubleOccupancy[1]][$scope.monthIndex[column]] = Math.round(((parseInt(monthwiseData[11]) / parseInt(monthwiseData[3])) * 100) - 100);
                        $scope.budgetData[doubleOccupancy[1]]['total'] = Math.round(((parseInt(totalColumnData[11]) / parseInt(totalColumnData[3])) * 100) - 100) || '';
                    }
                    if(_.includes(averageDailyRate[0], row)){
                         $scope.budgetData[averageDailyRate[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[1]));
                         $scope.budgetData[averageDailyRate[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[1])) || '';
                    }
                    if(_.includes(averageDailyRateBreakfast[0], row)){
                        $scope.budgetData[averageDailyRateBreakfast[1]][$scope.monthIndex[column]]  = Math.round((parseInt(monthwiseData[8]) * parseInt(monthwiseData[9])) + parseInt(monthwiseData[12])) / parseInt(monthwiseData[1]).toFixed(2);
                        $scope.budgetData[averageDailyRateBreakfast[1]]['total'] = Math.round((parseInt(totalColumnData[8]) * parseInt(totalColumnData[9])) + parseInt(totalColumnData[12])) / parseInt(totalColumnData[1]).toFixed(2) || '';
                    }
                    if(_.includes(revenuePerAvailableRoom[0], row)){
                        $scope.budgetData[revenuePerAvailableRoom[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[0]));
                        $scope.budgetData[revenuePerAvailableRoom[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[0])) || '';
                    }
                    if(_.includes(totalRevenue[0], row)){
                        $scope.budgetData[totalRevenue[1]][$scope.monthIndex[column]] = (parseInt(monthwiseData[12]) + parseInt(monthwiseData[13]) +  parseInt(monthwiseData[14]));
                        $scope.budgetData[totalRevenue[1]]['total'] = (parseInt(totalColumnData[12]) + parseInt(totalColumnData[13]) +  parseInt(totalColumnData[14])) || '';
                    }

                    var monthsTemp = [];
                    _.each($scope.monthIndex, function(value, key){
                        monthsTemp.push(value);
                        var sumData = _.at($scope.budgetData[revenueRow], monthsTemp),
                            sumRow = _.sum(sumData);
                        $scope.budgetData[accumulativeRow][value] = sumRow;
                    });

                }, 30);
            }

            $scope.updateCalculation = function(daysCount){
                var revenueRow = 15,
                    accumulativeRow = 16;
                _.each( $scope.budgetData , function(val, key){
                    _.each( $scope.daysInMonthList , function(val1, key1){
                        var monthwiseData = _.map($scope.budgetData, parseInt(val1));
                        $scope.budgetData[4][val1] = Math.round((parseInt(monthwiseData[1]) / parseInt(monthwiseData[0])) * 100);
                        $scope.budgetData[5][val1] = Math.round(((parseInt(monthwiseData[11]) / parseInt(monthwiseData[3])) * 100) - 100);
                        $scope.budgetData[6][val1] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[1]));
                        $scope.budgetData[7][val1] = Math.round((parseInt(monthwiseData[8]) * parseInt(monthwiseData[9])) + parseInt(monthwiseData[12])) / parseInt(monthwiseData[1]).toFixed(2);
                        $scope.budgetData[10][val1] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[0]));
                        $scope.budgetData[15][val1] = Number((Number(monthwiseData[12]) + Number(monthwiseData[13]) + Number(monthwiseData[14])).toFixed(2));
                    });
                });

                var monthsTemp = [];
                _.each( $scope.daysInMonthList , function(val1, key1){
                    monthsTemp.push(val1);
                    var sumData = _.at($scope.budgetData[revenueRow], monthsTemp),
                        sumRow = _.sum(sumData);
                    $scope.budgetData[accumulativeRow][val1] = sumRow.toFixed(2);
                });
            }

            $scope.updateBudgetData = function(selectedProject, selectedPeriod, selectedMonth){
                $scope.daysInMonthList = [];
                var fieldDividerArr = [0,1,2,3,8,9,11,12,13,14],
                    accumulativeRow = 16,
                    selectedMonthName = $scope.monthIndex[parseInt(selectedMonth)+1],
                    daysCount = $scope.daysInMonth(parseInt(selectedMonth)+1, selectedPeriod);
                
                $scope.daysInMonthList = _.times(daysCount , function(val){
                    return val + 1;
                });
                
                $scope.budgetBoxShow = true;
                $http.post(server.baseApiUrl+apis.getHotelBudget, {projectId : selectedProject, projectYear:selectedPeriod }).then(function(response){
                    $scope.budgetData  = response.data.data.value;
                    $scope.cloneBudgetData = _.clone($scope.budgetData);
                    var monthwiseData = _.map($scope.budgetData, selectedMonthName),
                        budgetDivideData = "";
                    _.each( $scope.budgetData , function(val, key){
                        budgetDivideData = (_.includes(fieldDividerArr, key)) ? (monthwiseData[key] / daysCount).toFixed(2) : '' ;
                        val.total = (accumulativeRow !== key) ? monthwiseData[key] : "";
                        _.each( $scope.daysInMonthList , function(val1, key1){
                            val[val1] = budgetDivideData;
                        });
                    });
                    $scope.updateCalculation($scope.daysInMonthList);
                });
            }
		}

        hotelViewBudgetController.$inject = ['$scope','$rootScope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$timeout'];
        
        angular.module('employeeApp').controller('app.hotelViewBudgetController', hotelViewBudgetController);
    }(app.budget || (app.budget = {})));
})(app || (app = {}));