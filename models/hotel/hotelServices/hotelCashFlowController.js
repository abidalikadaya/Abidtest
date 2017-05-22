(function (app) {
    var cashFlow;
    (function (cashFlow) {
        'use strict'

        var hotelCashFlowController = function ($scope, $uibModal, $log, $http, server, apis, growl, $localStorage) {
            $scope.budgetViewText = true;
            $scope.budgetViewInput = false;
            $scope.selectedProject = 1;
            $scope.cloneBudgetData = [];
            
            $scope.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

            $http.get(server.baseApiUrl+apis.getUserProjectList).then(function(projectList){
                $scope.projectList  = projectList.data.data;
                $http.get(server.baseApiUrl+apis.getHotelCashFlow).then(function(response){
                    $scope.cloneCashFlowData = response.data.data;
                    console.log($scope.cloneCashFlowData);
                    $scope.cashFlowData  = _.filter(angular.copy($scope.cloneCashFlowData), ['projectId', $scope.selectedProject]);
                });
             });

            // $scope.editView = function(){
                // $scope.cashFlowViewText = false;
                // $scope.cashFlowViewInput = true;
            // }

            // $scope.saveView = function(){
                // $scope.cashFlowViewText = true;
                // $scope.cashFlowViewInput = false;
            //}

            // $scope.updateOccupacy = function(index){
            //     console.log(index);
            // }

            // $scope.updateBudgetData = function(projectId){
            //     swal({
            //         title: "Are you sure?",
            //         text: "Please save chnages. You will not be able to recover once you chnage the project",
            //         type: "warning",
            //         showCancelButton: true,
            //         confirmButtonColor: "#DD6B55",
            //         confirmButtonText: "Yes, chnage it!",
            //         cancelButtonText: "No, cancel please!",
            //         closeOnConfirm: true,
            //         closeOnCancel: true
            //     },
            //     function(isConfirm){
            //         if (isConfirm) {
            //             $scope.budgetData  = _.filter($scope.cloneBudgetData, ['projectId', projectId]);
            //             $scope.$apply();
            //         }
            //     });
            // }
		}

        hotelCashFlowController.$inject = ['$scope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage'];
        
        angular.module('employeeApp').controller('app.hotelCashFlowController', hotelCashFlowController);
    }(app.cashFlow || (app.cashFlow = {})));
})(app || (app = {}));