(function (app) {
    var cashFlow;
    (function (cashFlow) {
        'use strict'

        var hotelCashFlowController = function ($scope, $uibModal, $log, $http, server, apis, growl, $localStorage, $timeout) {
            $scope.cashflowViewText = true;
            $scope.cashflowViewInput = false;
            $scope.selectedProject = 0;
            $scope.cloneCashfowData = [];
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
                $scope.cashflowViewText = false;
                $scope.cashflowViewInput = true;
            }
            $scope.saveView = function(){
                console.log($scope.cashflowData);
                $scope.cashflowViewText = true;
                $scope.cashflowViewInput = false;
                var payload = {
                    cashflowData : $scope.cashflowData
                };
                $http.post(server.baseApiUrl+apis.saveHotelCashflow, payload).then(function(response){
                    if(response.data.success){
                        growl.success("cashflow data save successfully");
                    }else{
                        growl.error("Error in saving cashflow field data");
                    }
                });
            }
            $scope.updatePeriod = function(projectId){
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }
             $scope.getCashflowDataCall = function(selectedProject, selectedPeriod){
                 $scope.cashflowBoxShow = true;
                $http.post(server.baseApiUrl+apis.getHotelCashflow, {projectId : selectedProject, projectYear:selectedPeriod }).then(function(response){
                    $scope.cashflowData  = response.data.data;
                });
            }
            $scope.updateTotals = function(row, column){
                var monthlyCashMovement = [[0,1,2,3],4],
                    monthwiseData = {},
                    totalColumnData = {},
                    openingBalance = [4,1],
                    monthlyCashMovementRow = 4,
                    accumulativeRow = 5,
                    openingBalanceRow = 0;
                    $scope.cashflowData[0]["jan"] = 0; 
                $timeout(function () {
                    monthwiseData = _.map($scope.cashflowData, $scope.monthIndex[column]);
                    var count = 0;
                    _.each($scope.cashflowData[row],function(value, key){
                        if(_.includes(_.values($scope.monthIndex),key) && parseInt(value)){
                            count += parseInt(value);
                        }
                    });
                    $scope.cashflowData[row].total = count;
                    totalColumnData = _.map($scope.budgetData, 'total');
                    if(_.includes(monthlyCashMovement[0], row)){
                       $scope.cashflowData[monthlyCashMovement[1]][$scope.monthIndex[column]] = (parseInt(monthwiseData[0]) + parseInt(monthwiseData[1]) + parseInt(monthwiseData[2]) + parseInt(monthwiseData[3]));
                       $scope.cashflowData[monthlyCashMovement[1]]['total'] = (parseInt(totalColumnData[0]) + parseInt(totalColumnData[1]) + parseInt(totalColumnData[2]) + parseInt(totalColumnData[3])) || '';
                    }

                    console.log($scope.cashflowData[monthlyCashMovementRow][$scope.monthIndex[column]]);
                    $scope.cashflowData[openingBalanceRow][$scope.monthIndex[column+1]] = $scope.cashflowData[monthlyCashMovementRow][$scope.monthIndex[column]];


                    var monthsTemp = [];
                    _.each($scope.monthIndex, function(value, key){
                        monthsTemp.push(value);
                        var sumData = _.at($scope.cashflowData[monthlyCashMovementRow], monthsTemp),
                            sumRow = _.sum(sumData);
                        $scope.cashflowData[accumulativeRow][value] = sumRow;
                    });

                },50);


            }
            $scope.updateCashflowData = function(selectedProject, selectedPeriod){
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
                            $scope.getCashflowDataCall(selectedProject, selectedPeriod);
                        }
                    });
                }else{
                    $scope.showConfirmChangeMessage = true;
                    $scope.getCashflowDataCall(selectedProject, selectedPeriod);
                }
            }
           
		}

        hotelCashFlowController.$inject = ['$scope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$timeout'];
        
        angular.module('employeeApp').controller('app.hotelCashFlowController', hotelCashFlowController);
    }(app.cashFlow || (app.cashFlow = {})));
})(app || (app = {}));