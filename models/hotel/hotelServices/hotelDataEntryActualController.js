(function (app) {
    var hotelDataEntry;
    (function (hotelDataEntry) {
        'use strict'

        var hotelDataEntryActualController = function ($scope, $uibModal, $log, $http, server, apis, growl, $localStorage, $timeout,$rootScope) {
            $scope.actualViewText = true;
            $scope.lock = {"dollarRate":0};
            $scope.actualViewInput = false;
            $scope.cloneActualData = [];
            $scope.actualBoxShow = false;
            $scope.editable = false;
            $scope.showConfirmChangeMessage = false;
            $scope.showConfirmSubmitMessage = true;
            $scope.dayDisabled = true;
            $scope.rejectCommentText = "";
           // $scope.dollarRate = 0;
            $('#ActualDatepicker').datepicker({
                todayHighlight: true,
                //startDate: startDate,
                //endDate: endDate,
                autoclose: true,
                format: 'dd/mm/yyyy'
            });
            //Get hotel project with it's period
            $http.get(server.baseApiUrl + apis.getHotelProjectWithPeriod).then(function (projectListWithYear) {
                if (projectListWithYear.data.success) {
                    $scope.projectListWithYear = projectListWithYear.data.data;
                    $scope.projectWithYearMap = _.groupBy($scope.projectListWithYear, 'projectId');
                } else {
                    growl.error("Error getting projects and periods Data");
                }
            });

            $scope.updatePeriod = function (projectId) {
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }
            $scope.updateDays = function (period) {
                console.log(period);
                if (!!period) {
                    $scope.dayDisabled = false;
                    var checkDate = new Date();
                    var startDate = new Date(period - 1, 11, 32);
                    var endDate = new Date(period, 11, 31);
                    $('#ActualDatepicker').datepicker('setStartDate', startDate);
                    $('#ActualDatepicker').datepicker('setEndDate', endDate);

                    if (checkDate.getFullYear() === period) {
                        $('#ActualDatepicker').datepicker('setDate', checkDate);
                    } else {
                        $('#ActualDatepicker').datepicker('setDate', startDate);
                    }


                } else {
                    $scope.dayDisabled = true;
                    $scope.selectedDay = "";
                }

            }

            $scope.editView = function () {
                $scope.actualViewText = false;
                $scope.actualViewInput = true;
                $scope.editable = true;
            }

            $scope.saveView = function () {
                $scope.finalSaveSubmit("save");
            }

            $scope.submitActual = function () {
                swal({
                            title: "Are you sure?",
                            text: "Please submit changes.You will not be able to edit once you Submit the actual",
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
                                $scope.finalSaveSubmit("Submitted");
                            }
                        });
                
                
            };

            $scope.approveActual = function () {
                 swal({
                            title: "Are you sure?",
                            text: "Do you want to approve actual?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, Approve it!",
                            cancelButtonText: "No, cancel please!",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                $scope.finalSaveSubmit("Approved");
                            }
                        });
                
            }

            $scope.rejectActual = function () {
                angular.element("#comment-modal").modal('show');
            }

            $scope.rejectActualSubmit = function () {
                //console.log($scope.rejectCommentText);
                $scope.finalSaveSubmit("Rejected");
                
            }

            $scope.finalSaveSubmit = function (operation) {
                $scope.actualViewText = true;
                $scope.actualViewInput = false;
                $scope.editable = false;
                var statusData = { projectId: $scope.selectedProject,
                    projectYear: $scope.selectedPeriod,
                    date: $scope.selectedDay,
                    operator:0,
                    controller:0,
                    comment:$scope.rejectCommentText,
                    dollarRate:$scope.lock.dollarRate};
                  if(!!$rootScope.hotelRoles.isController){
                    statusData.controller = 1;
                  } 
                  else if(!!$rootScope.hotelRoles.isOperator){
                    statusData.operator = 1;
                  }


                var payload = {
                    actualData: $scope.actualData,
                    operation: operation,
                    statusData:statusData

                };
                $http.post(server.baseApiUrl + apis.saveHotelActual, payload).then(function (response) {
                    if (response.data.success) {
                        if(operation === 'Submitted') {
                            $scope.lock.lockActions = 1;
                            $scope.lock.action = 'Submitted';
                        }
                        else if(operation === 'Approved') {
                            $scope.lock.action = 'Approved';
                        }
                        else if(operation === 'Rejected') {
                            $scope.lock.action = 'Rejected';
                            angular.element("#comment-modal").modal('hide');
                        }
                        growl.success("actual data save successfully");
                    } else {
                        growl.error("Error in saving actual field data");
                    }
                });
            }

            $scope.updateTotals = function (row, column) {
                var occupancy = [
                        [0, 1], 4
                    ], // (1/0)*100
                    doubleOccupancy = [
                        [3, 11], 5
                    ], // ( (11/3)*100 ) - 100
                    averageDailyRate = [
                        [1, 12], 6
                    ], // round off (12/1)
                    averageDailyRateBreakfast = [
                        [1, 8, 9, 12], 7
                    ], // round off ( ((8*9)+12)/1 )
                    revenuePerAvailableRoom = [
                        [0, 12], 10
                    ], // round off (12/0)
                    totalRevenue = [
                        [12, 13, 14], 15
                    ], // round off (12/0)
                    monthwiseData = {},
                    //totalColumnData = {},
                    revenueRow = 15;
                //accumulativeRow = 16,
                //accumulativeCount = 0;

                $timeout(function () {
                    monthwiseData = _.map($scope.actualData, 'dayActual');
                    // var count = 0;
                    // _.each($scope.actualData[row],function(value, key){
                    //     if(_.includes(_.values($scope.monthIndex),key) && parseInt(value)){
                    //         count += parseInt(value);
                    //     }
                    // });
                    // $scope.actualData[row].total = count;
                    // totalColumnData = _.map($scope.actualData, 'total');
                    if (_.includes(occupancy[0], row)) {
                        $scope.actualData[occupancy[1]]['dayActual'] = Math.round((parseInt(monthwiseData[1]) / parseInt(monthwiseData[0])) * 100);
                        // $scope.actualData[occupancy[1]]['total'] = Math.round((parseInt(totalColumnData[1]) / parseInt(totalColumnData[0])) * 100) || '';
                    }
                    if (_.includes(doubleOccupancy[0], row)) {
                        $scope.actualData[doubleOccupancy[1]]['dayActual'] = Math.round(((parseInt(monthwiseData[11]) / parseInt(monthwiseData[3])) * 100) - 100);
                        // $scope.actualData[doubleOccupancy[1]]['total'] = Math.round(((parseInt(totalColumnData[11]) / parseInt(totalColumnData[3])) * 100) - 100) || '';
                    }
                    if (_.includes(averageDailyRate[0], row)) {
                        $scope.actualData[averageDailyRate[1]]['dayActual'] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[1]));
                        // $scope.actualData[averageDailyRate[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[1])) || '';
                    }
                    if (_.includes(averageDailyRateBreakfast[0], row)) {
                        $scope.actualData[averageDailyRateBreakfast[1]]['dayActual'] = Math.round((parseInt(monthwiseData[8]) * parseInt(monthwiseData[9])) + parseInt(monthwiseData[12])) / parseInt(monthwiseData[1]).toFixed(2);
                        //  $scope.actualData[averageDailyRateBreakfast[1]]['total'] = Math.round((parseInt(totalColumnData[8]) * parseInt(totalColumnData[9])) + parseInt(totalColumnData[12])) / parseInt(totalColumnData[1]).toFixed(2) || '';
                    }
                    if (_.includes(revenuePerAvailableRoom[0], row)) {
                        $scope.actualData[revenuePerAvailableRoom[1]]['dayActual'] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[0]));
                        // $scope.actualData[revenuePerAvailableRoom[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[0])) || '';
                    }
                    if (_.includes(totalRevenue[0], row)) {
                        $scope.actualData[totalRevenue[1]]['dayActual'] = (parseInt(monthwiseData[12]) + parseInt(monthwiseData[13]) + parseInt(monthwiseData[14]));
                        // $scope.actualData[totalRevenue[1]]['total'] = (parseInt(totalColumnData[12]) + parseInt(totalColumnData[13]) +  parseInt(totalColumnData[14])) || '';
                    }

                    // var monthsTemp = [];
                    // _.each($scope.monthIndex, function(value, key){
                    //     monthsTemp.push(value);
                    //     var sumData = _.at($scope.actualData[revenueRow], monthsTemp),
                    //         sumRow = _.sum(sumData);
                    //     $scope.actualData[accumulativeRow][value] = sumRow;
                    // });

                }, 30);
            }
            $scope.getActualDataCall = function (selectedProject, selectedPeriod, selectedDay) {
                $scope.actualBoxShow = true;
                $http.post(server.baseApiUrl + apis.getHotelActual, {
                    projectId: selectedProject,
                    projectYear: selectedPeriod,
                    date: selectedDay
                }).then(function (response) {
                    console.log(response);
                    $scope.actualData = response.data.data.value;
                    $scope.lock.lockActions = response.data.data.actionLockStatus;
                    $scope.lock.action = response.data.data.actionStatus;
                    $scope.lock.dollarRate = response.data.data.dollarRate;
                });
            }
            $scope.updateActualData = function (selectedProject, selectedPeriod, selectedDay) {
                if ($scope.showConfirmChangeMessage) {
                    swal({
                            title: "Are you sure?",
                            text: "Please save changes. You will not be able to recover once you change the project",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, change it!",
                            cancelButtonText: "No, cancel please!",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                $scope.getActualDataCall(selectedProject, selectedPeriod, selectedDay);
                            }
                        });
                } else {
                    $scope.showConfirmChangeMessage = true;
                    $scope.getActualDataCall(selectedProject, selectedPeriod, selectedDay);
                }
            }

        }
        hotelDataEntryActualController.$inject = ['$scope', '$uibModal', '$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$timeout', '$rootScope'];
        angular.module('employeeApp').controller('app.hotelDataEntryActualController', hotelDataEntryActualController);

    }(app.hotelDataEntry || (app.hotelDataEntry = {})));
})(app || (app = {}));