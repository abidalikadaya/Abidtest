(function (app) {
    var unlock;
    (function (createProject) {
        'use strict'

        var hotelUnlockController = function ($scope, $rootScope, $log, $http , $localStorage, $timeout, server, apis, growl) {
            
            
            //Get hotel project with it's period
            $scope.getUnclokBudget = function(){
                
            $http.get(server.baseApiUrl+apis.getUnlockBudget).then(function(projectListWithYear){
                if(projectListWithYear.data.success){
                    $scope.projectListWithYear  = projectListWithYear.data.data;
                    console.log($scope.projectListWithYear);
                    $scope.projectWithYearMap = _.groupBy($scope.projectListWithYear, 'projectId');
                    console.log($scope.projectWithYearMap);
                }else{
                    growl.error("Error getting projects and periods Data");
                  }
             });
            }

            $scope.getUnclokBudget();

             $scope.updatePeriod = function(projectId){
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }
            $scope.getUnlockActual = function(){

            $http.get(server.baseApiUrl+apis.getUnlockActual).then(function(ActualListWithYear){
                if(ActualListWithYear.data.success){
                    $scope.ActualListWithYear  = ActualListWithYear.data.data;
                    console.log($scope.ActualListWithYear);
                   
                   // console.log($scope.ActualWithYearMap);
                }else{
                    growl.error("Error getting projects and periods Data");
                  }
             });
            } 

            $scope.getUnlockActual();

             $scope.updateActualPeriod = function(projectId){
                $scope.projectActualPeriod =  _.chain($scope.ActualListWithYear).find({'projectId' : projectId}).get('yearsDates').keys().value();
                console.log($scope.projectActualPeriod);
            }

            $scope.updateActualDays = function(projectId,projectYear){
                var selectedData =  _.chain($scope.ActualListWithYear).find({'projectId' : projectId}).value();
                $scope.projectActualDays = selectedData.yearsDates[projectYear];
                console.log($scope.projectActualDays);
            }

            $scope.saveUnlockBudget = function(){
                var unlockBudget = { projectId:$scope.selectedProject,projectYear:$scope.selectedPeriod};
                $http.post(server.baseApiUrl+apis.saveUnlockBudget, unlockBudget).then(function(response){
                    if(response.data.success){
                        growl.success("Unlock Budget data updated successfully");
                        $scope.getUnclokBudget();
                        $scope.projectListWithYear = "";
                        $scope.projectPeriod = "";
                    }else{
                        growl.error("Error in Unlock Budget data");
                    }
                });
                console.log(unlockBudget);
            }

            $scope.saveUnlockActual = function(){
                var unlockActual = { projectId:$scope.selectedActualProject,projectYear:$scope.actualPeriodYear,projectDay:$scope.actualDay};
                 $http.post(server.baseApiUrl+apis.saveUnlockActual, unlockActual).then(function(response){
                    if(response.data.success){
                        growl.success("Unlock Actual data updated successfully");
                        $scope.getUnlockActual();
                        $scope.ActualListWithYear = "";
                        $scope.projectActualPeriod = "";
                        $scope.projectActualDays = "";
                    }else{
                        growl.error("Error in Unlock Actual data");
                    }
                });
                console.log(unlockActual);
            }

            $scope.clearUnclock = function (clearFlag){
                if(!!clearFlag){
                    $scope.selectedProject = "";
                    $scope.selectedPeriod = "";
                }else{
                    $scope.selectedActualProject = "";
                    $scope.actualPeriodYear = "";
                    $scope.actualDay = "";
                }

            }
        }

     hotelUnlockController.$inject = ['$scope','$rootScope','$log', '$http', '$localStorage', '$timeout', 'server', 'apis', 'growl'];
        
        angular.module('employeeApp').controller('app.hotelUnlockController', hotelUnlockController);
    }(app.unlock || (app.unlock = {})));
})(app || (app = {}));