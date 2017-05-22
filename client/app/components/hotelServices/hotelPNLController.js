(function (app) {
    var PNL;
    (function (createProject) {
        'use strict'

        var hotelPNLController = function ($scope, $rootScope, $log, $http , $localStorage, $timeout, server, apis, growl) {
            $scope.PNLViewText = true;
            $scope.PNLViewInput = false;
            $scope.clonePNLData = [];
            $scope.PNLBoxShow = false;
            $scope.showConfirmChangeMessage = false;
            $scope.showConfirmSubmitMessage = true;            
            $scope.rejectCommentText = "";
            $scope.lock = {};
            $scope.subHeaders = [];

            $scope.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            
            angular.forEach( $scope.months , function(val, key){
                var modifiedkey = key +1,
                    subHeadersValues = ["Month "+modifiedkey,"Month "+modifiedkey+"%","Month "+modifiedkey+" Budget","Month "+modifiedkey+" Budget%"];
                $scope.subHeaders = $scope.subHeaders.concat(subHeadersValues);
            });

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
            $scope.columnName = {
                1  :'jan_actual',
                2  :'jan_actualPer',
                3  :'jan_budget',
                4  :'jan_budgetPer',
                5  :'feb_actual',
                6  :'feb_actualPer',
                7  :'fen_budget',
                8  :'feb_budgetPer',
                9  :'mar_actual',
                10 :'mar_actualPer',
                11 :'mar_budget',
                12 :'mar_budgetPer',
                13 :'apr_actual',
                14 :'apr_actualPer',
                15 :'apr_budget',
                16 :'apr_budgetPer',
                17 :'may_actual',
                18 :'may_actualPer',
                19 :'may_budget',
                20 :'may_budgetPer',
                21 :'jun_actual',
                22 :'jun_actualPer',
                23 :'jun_budget',
                24 :'jun_budgetPer',
                25 :'jul_actual',
                26 :'jul_actualPer',
                27 :'jul_budget',
                28 :'jul_budgetPer',
                29 :'aug_actual',
                30 :'aug_actualPer',
                31 :'aug_budget',
                32 :'aug_budgetPer',
                33 :'sep_actual',
                34 :'sep_actualPer',
                35 :'sep_budget',
                36 :'sep_budgetPer',
                37 :'oct_actual',
                38 :'oct_actualPer',
                39 :'oct_budget',
                40 :'oct_budgetPer',
                41 :'nov_actual',
                42 :'nov_actualPer',
                43 :'nov_budget',
                44 :'nov_budgetPer',
                45 :'dec_actual',
                46 :'dec_actualPer',
                47 :'dec_budget',
                48 :'dec_budgetPer'
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
            $scope.updatePeriod = function(projectId){
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }

            $scope.editView = function(){
                $scope.PNLViewText = false;
                $scope.PNLViewInput = true;
            }

            $scope.saveView = function(){
                $scope.finalSaveSubmit();
            }

            $scope.submitPNL = function(){
                swal({
                        title: "Are you sure?",
                        text: "Please submit changes.You will not be able to edit once you Submit the PNL",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, Submit it!",
                        cancelButtonText: "No, cancel please!",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.finalSaveSubmit();
                        }
                    });
            };         
           
            $scope.updateTotals = function(row, column){
                var totalOpeningRevenue = [[0,1,2,3],4],
                    totalDepartmentExpenses = [[5,6,7],8],
                    totalUndistribOpeningExp = [[10,11,12,13,14],15],
                    ebitda = [[16,17,18],19],
                    ebit =[[19,20],21],
                    grossProfitRow = 9,
                    grossOperationalProfitRow = 16,
                    columnWiseData = {},
                    columnId = $scope.columnName[column],
                    columnPerc = $scope.columnName[column+1];


                $timeout(function () {
                    columnWiseData = _.map($scope.PNLData, columnId);
                    if(column % 2 != 0) {
                        if(_.includes(totalOpeningRevenue[0], row)) {
                            $scope.PNLData[totalOpeningRevenue[1]][columnId] = (parseInt(columnWiseData[0]) + parseInt(columnWiseData[1]) + parseInt(columnWiseData[2]) + parseInt(columnWiseData[3]));
                            $scope.PNLData[0][columnPerc] =  ($scope.PNLData[totalOpeningRevenue[0][0]][columnId]/ $scope.PNLData[totalOpeningRevenue[1]][columnId]) * 100;
                            $scope.PNLData[1][columnPerc] =  ($scope.PNLData[totalOpeningRevenue[0][1]][columnId]/ $scope.PNLData[totalOpeningRevenue[1]][columnId]) * 100;
                            $scope.PNLData[2][columnPerc] =  ($scope.PNLData[totalOpeningRevenue[0][2]][columnId]/ $scope.PNLData[totalOpeningRevenue[1]][columnId]) * 100;
                            $scope.PNLData[3][columnPerc] =  ($scope.PNLData[totalOpeningRevenue[0][3]][columnId]/ $scope.PNLData[totalOpeningRevenue[1]][columnId]) * 100;
                            $scope.PNLData[4][columnPerc] = $scope.PNLData[0][columnPerc] + $scope.PNLData[1][columnPerc] + $scope.PNLData[2][columnPerc] + $scope.PNLData[3][columnPerc];
                        }
                        if(_.includes(totalDepartmentExpenses[0], row)) {
                            $scope.PNLData[totalDepartmentExpenses[1]][columnId] = (parseInt(columnWiseData[5]) + parseInt(columnWiseData[6]) + parseInt(columnWiseData[7]));
                            $scope.PNLData[5][columnPerc] =  ($scope.PNLData[totalDepartmentExpenses[0][0]][columnId]/ $scope.PNLData[totalDepartmentExpenses[1]][columnId]) * 100;
                            $scope.PNLData[6][columnPerc] =  ($scope.PNLData[totalDepartmentExpenses[0][1]][columnId]/ $scope.PNLData[totalDepartmentExpenses[1]][columnId]) * 100;
                            $scope.PNLData[7][columnPerc] =  ($scope.PNLData[totalDepartmentExpenses[0][2]][columnId]/ $scope.PNLData[totalDepartmentExpenses[1]][columnId]) * 100;
                            $scope.PNLData[8][columnPerc] = $scope.PNLData[totalDepartmentExpenses[1]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                        }
                        $scope.PNLData[grossProfitRow][columnId] = (parseInt(columnWiseData[4]) - parseInt(columnWiseData[8]));
                        $scope.PNLData[grossProfitRow][columnPerc] = $scope.PNLData[grossProfitRow][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                        if(_.includes(totalUndistribOpeningExp[0], row)) {
                            $scope.PNLData[totalUndistribOpeningExp[1]][columnId] = (parseInt(columnWiseData[10]) + parseInt(columnWiseData[11]) + 
                                                                                     parseInt(columnWiseData[12]) + parseInt(columnWiseData[13]) + 
                                                                                     parseInt(columnWiseData[14]));
                            $scope.PNLData[10][columnPerc] = $scope.PNLData[totalUndistribOpeningExp[0][0]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                            $scope.PNLData[11][columnPerc] = $scope.PNLData[totalUndistribOpeningExp[0][1]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                            $scope.PNLData[12][columnPerc] = $scope.PNLData[totalUndistribOpeningExp[0][2]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                            $scope.PNLData[13][columnPerc] = $scope.PNLData[totalUndistribOpeningExp[0][3]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                            $scope.PNLData[14][columnPerc] = $scope.PNLData[totalUndistribOpeningExp[0][4]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                            $scope.PNLData[15][columnPerc] = $scope.PNLData[10][columnPerc] + $scope.PNLData[11][columnPerc] + $scope.PNLData[12][columnPerc] + $scope.PNLData[13][columnPerc] + $scope.PNLData[14][columnPerc];
                        }
                        $scope.PNLData[[grossOperationalProfitRow]][columnId] =  (parseInt(columnWiseData[9]) - parseInt(columnWiseData[15]));
                        $scope.PNLData[[grossOperationalProfitRow]][columnPerc] = $scope.PNLData[[grossOperationalProfitRow]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                        if(_.includes(ebitda[0], row)) {
                            $scope.PNLData[ebitda[1]][columnId] = (parseInt(columnWiseData[16]) - parseInt(columnWiseData[17]) - parseInt(columnWiseData[18])); 
                            $scope.PNLData[17][columnPerc] = $scope.PNLData[ebitda[0][0]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;
                            $scope.PNLData[18][columnPerc] = $scope.PNLData[ebitda[0][0]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100; 
                            $scope.PNLData[ebitda[1]][columnPerc] =  $scope.PNLData[ebitda[1]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;                        
                        }
                        if(_.includes(ebit[0], row)) {
                            $scope.PNLData[ebit[1]][columnId] = (parseInt(columnWiseData[19]) - parseInt(columnWiseData[20]));  
                            $scope.PNLData[ebit[0][0]][columnPerc] =  $scope.PNLData[ebit[0][0]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100; 
                            $scope.PNLData[ebit[1]][columnPerc] =  $scope.PNLData[ebit[1]][columnId] / $scope.PNLData[totalOpeningRevenue[1]][columnId] * 100;                          
                        }
                    }
                }, 50);
                // var occupancy = [[0,1], 4], // (1/0)*100
                //     doubleOccupancy = [[3,11], 5], // ( (11/3)*100 ) - 100
                //     averageDailyRate = [[1,12], 6], // round off (12/1)
                //     averageDailyRateBreakfast = [[1,8,9,12], 7], // round off ( ((8*9)+12)/1 )
                //     revenuePerAvailableRoom = [[0,12], 10], // round off (12/0)
                //     totalRevenue = [[12,13,14], 15], // round off (12/0)
                //     monthwiseData = {},
                //     totalColumnData = {},
                //     revenueRow = 15,
                //     accumulativeRow = 16,
                //     accumulativeCount = 0;

                // $timeout(function () {
                //     monthwiseData = _.map($scope.PNLData, $scope.monthIndex[column]);
                //     var count = 0;
                //     _.each($scope.PNLData[row],function(value, key){
                //         if(_.includes(_.values($scope.monthIndex),key) && parseInt(value)){
                //             count += parseInt(value);
                //         }
                //     });
                //     $scope.PNLData[row].total = count;
                //     totalColumnData = _.map($scope.PNLData, 'total');
                //     if(_.includes(occupancy[0], row)){
                //        $scope.PNLData[occupancy[1]][$scope.monthIndex[column]] = Math.round((parseInt(monthwiseData[1]) / parseInt(monthwiseData[0])) * 100);
                //        $scope.PNLData[occupancy[1]]['total'] = Math.round((parseInt(totalColumnData[1]) / parseInt(totalColumnData[0])) * 100) || '';
                //     }
                //     if(_.includes(doubleOccupancy[0], row)){
                //         $scope.PNLData[doubleOccupancy[1]][$scope.monthIndex[column]] = Math.round(((parseInt(monthwiseData[11]) / parseInt(monthwiseData[3])) * 100) - 100);
                //         $scope.PNLData[doubleOccupancy[1]]['total'] = Math.round(((parseInt(totalColumnData[11]) / parseInt(totalColumnData[3])) * 100) - 100) || '';
                //     }
                //     if(_.includes(averageDailyRate[0], row)){
                //          $scope.PNLData[averageDailyRate[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[1]));
                //          $scope.PNLData[averageDailyRate[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[1])) || '';
                //     }
                //     if(_.includes(averageDailyRateBreakfast[0], row)){
                //         $scope.PNLData[averageDailyRateBreakfast[1]][$scope.monthIndex[column]]  = Math.round((parseInt(monthwiseData[8]) * parseInt(monthwiseData[9])) + parseInt(monthwiseData[12])) / parseInt(monthwiseData[1]).toFixed(2);
                //         $scope.PNLData[averageDailyRateBreakfast[1]]['total'] = Math.round((parseInt(totalColumnData[8]) * parseInt(totalColumnData[9])) + parseInt(totalColumnData[12])) / parseInt(totalColumnData[1]).toFixed(2) || '';
                //     }
                //     if(_.includes(revenuePerAvailableRoom[0], row)){
                //         $scope.PNLData[revenuePerAvailableRoom[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[0]));
                //         $scope.PNLData[revenuePerAvailableRoom[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[0])) || '';
                //     }
                //     if(_.includes(totalRevenue[0], row)){
                //         $scope.PNLData[totalRevenue[1]][$scope.monthIndex[column]] = (parseInt(monthwiseData[12]) + parseInt(monthwiseData[13]) +  parseInt(monthwiseData[14]));
                //         $scope.PNLData[totalRevenue[1]]['total'] = (parseInt(totalColumnData[12]) + parseInt(totalColumnData[13]) +  parseInt(totalColumnData[14])) || '';
                //     }

                //     var monthsTemp = [];
                //     _.each($scope.monthIndex, function(value, key){
                //         monthsTemp.push(value);
                //         var sumData = _.at($scope.PNLData[revenueRow], monthsTemp),
                //             sumRow = _.sum(sumData);
                //         $scope.PNLData[accumulativeRow][value] = sumRow;
                //     });

                // }, 30);
            }

            $scope.getPNLDataCall = function(selectedProject, selectedPeriod){
                $scope.PNLBoxShow = true;                
                $http.post(server.baseApiUrl+apis.getHotelPNL, {projectId : selectedProject, projectYear:selectedPeriod }).then(function(response){
                    $scope.PNLData  = response.data.data.value;                
                });
            }

            $scope.updatePNLData = function(selectedProject, selectedPeriod){
                if($scope.showConfirmChangeMessage){
                    swal({
                        title: "Are you sure?",
                        text: "Please save chnages. You will not be able to recover once you chnage the project",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, change it!",
                        cancelButtonText: "No, cancel please!",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            $scope.getPNLDataCall(selectedProject, selectedPeriod);
                        }
                    });
                }else{
                    $scope.showConfirmChangeMessage = true;
                    $scope.getPNLDataCall(selectedProject, selectedPeriod);
                }
            }

            $scope.finalSaveSubmit = function(){
                $scope.PNLViewText = true;
                $scope.PNLViewInput = false;    
                var payload = {
                    PNLData : $scope.PNLData
                };                     
                $http.post(server.baseApiUrl+apis.saveHotelPNL, payload).then(function(response){
                     if (response.data.success) {                        
                        growl.success("PNL data save successfully");
                    } else {
                        growl.error("Error in saving PNL field data");
                    }
                });
            }
		}

        hotelPNLController.$inject = ['$scope','$rootScope','$log', '$http', '$localStorage', '$timeout', 'server', 'apis', 'growl'];
        
        angular.module('employeeApp').controller('app.hotelPNLController', hotelPNLController);
    }(app.PNL || (app.PNL = {})));
})(app || (app = {}));