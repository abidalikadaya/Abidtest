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
            $scope.updatePeriod = function(projectId){
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }

            $scope.editView = function(){
                $scope.PNLViewText = false;
                $scope.PNLViewInput = true;
            }

            $scope.saveView = function(){
                $scope.finalSaveSubmit("save");
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
                            $scope.finalSaveSubmit("Submitted");
                        }
                    });
            };

            $scope.approvePNL = function(){
                swal({
                    title: "Are you sure?",
                    text: "Do you want to approve PNL?",
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

            $scope.rejectPNL = function(){
                angular.element("#comment-modal").modal('show');
            }

            $scope.rejectPNLSubmit = function(){
                $scope.finalSaveSubmit("Rejected");
            }

            $scope.finalSaveSubmit = function(operation){
                $scope.PNLViewText = true;
                $scope.PNLViewInput = false;
                 var statusData = { projectId: $scope.selectedProject,
                    projectYear: $scope.selectedPeriod,
                    operator:0,
                    controller:0,
                    comment:$scope.rejectCommentText};

                  if(!!$rootScope.hotelRoles.isController){
                    statusData.controller = 1;
                  } 
                  else if(!!$rootScope.hotelRoles.isOperator){
                    statusData.operator = 1;
                  }
                var payload = {
                    PNLData : $scope.PNLData,
                    operation : operation,
                    statusData:statusData
                };
                $http.post(server.baseApiUrl+apis.saveHotelPNL, payload).then(function(response){
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
                        growl.success("PNL data save successfully");
                    } else {
                        growl.error("Error in saving actual field data");
                    }
                });
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
                    monthwiseData = _.map($scope.PNLData, $scope.monthIndex[column]);
                    var count = 0;
                    _.each($scope.PNLData[row],function(value, key){
                        if(_.includes(_.values($scope.monthIndex),key) && parseInt(value)){
                            count += parseInt(value);
                        }
                    });
                    $scope.PNLData[row].total = count;
                    totalColumnData = _.map($scope.PNLData, 'total');
                    if(_.includes(occupancy[0], row)){
                       $scope.PNLData[occupancy[1]][$scope.monthIndex[column]] = Math.round((parseInt(monthwiseData[1]) / parseInt(monthwiseData[0])) * 100);
                       $scope.PNLData[occupancy[1]]['total'] = Math.round((parseInt(totalColumnData[1]) / parseInt(totalColumnData[0])) * 100) || '';
                    }
                    if(_.includes(doubleOccupancy[0], row)){
                        $scope.PNLData[doubleOccupancy[1]][$scope.monthIndex[column]] = Math.round(((parseInt(monthwiseData[11]) / parseInt(monthwiseData[3])) * 100) - 100);
                        $scope.PNLData[doubleOccupancy[1]]['total'] = Math.round(((parseInt(totalColumnData[11]) / parseInt(totalColumnData[3])) * 100) - 100) || '';
                    }
                    if(_.includes(averageDailyRate[0], row)){
                         $scope.PNLData[averageDailyRate[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[1]));
                         $scope.PNLData[averageDailyRate[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[1])) || '';
                    }
                    if(_.includes(averageDailyRateBreakfast[0], row)){
                        $scope.PNLData[averageDailyRateBreakfast[1]][$scope.monthIndex[column]]  = Math.round((parseInt(monthwiseData[8]) * parseInt(monthwiseData[9])) + parseInt(monthwiseData[12])) / parseInt(monthwiseData[1]).toFixed(2);
                        $scope.PNLData[averageDailyRateBreakfast[1]]['total'] = Math.round((parseInt(totalColumnData[8]) * parseInt(totalColumnData[9])) + parseInt(totalColumnData[12])) / parseInt(totalColumnData[1]).toFixed(2) || '';
                    }
                    if(_.includes(revenuePerAvailableRoom[0], row)){
                        $scope.PNLData[revenuePerAvailableRoom[1]][$scope.monthIndex[column]] = Math.round(parseInt(monthwiseData[12]) / parseInt(monthwiseData[0]));
                        $scope.PNLData[revenuePerAvailableRoom[1]]['total'] = Math.round(parseInt(totalColumnData[12]) / parseInt(totalColumnData[0])) || '';
                    }
                    if(_.includes(totalRevenue[0], row)){
                        $scope.PNLData[totalRevenue[1]][$scope.monthIndex[column]] = (parseInt(monthwiseData[12]) + parseInt(monthwiseData[13]) +  parseInt(monthwiseData[14]));
                        $scope.PNLData[totalRevenue[1]]['total'] = (parseInt(totalColumnData[12]) + parseInt(totalColumnData[13]) +  parseInt(totalColumnData[14])) || '';
                    }

                    var monthsTemp = [];
                    _.each($scope.monthIndex, function(value, key){
                        monthsTemp.push(value);
                        var sumData = _.at($scope.PNLData[revenueRow], monthsTemp),
                            sumRow = _.sum(sumData);
                        $scope.PNLData[accumulativeRow][value] = sumRow;
                    });

                }, 30);
            }

            $scope.getPNLDataCall = function(selectedProject, selectedPeriod){
                $scope.PNLBoxShow = true;
                $http.post(server.baseApiUrl+apis.getHotelPNL, {projectId : selectedProject, projectYear:selectedPeriod }).then(function(response){
                    $scope.PNLData  = response.data.data.value;
                    $scope.lock.lockActions = response.data.data.actionLockStatus;
                    $scope.lock.action = response.data.data.actionStatus;
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
                        confirmButtonText: "Yes, chnage it!",
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
		}

        hotelPNLController.$inject = ['$scope','$rootScope','$log', '$http', '$localStorage', '$timeout', 'server', 'apis', 'growl'];
        
        angular.module('employeeApp').controller('app.hotelPNLController', hotelPNLController);
    }(app.PNL || (app.PNL = {})));
})(app || (app = {}));