(function (app) {
    var createProject;
    (function (createProject) {
        'use strict'

        var hotelCreateServicesController = function ($scope, $uibModal, $log, $http, server, apis, growl, $localStorage,$timeout) {
            $scope.createProjectData = [];
            $scope.newProject = function (size) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'createProjectModal.html',
                    controller: 'app.createProjectModalCtrl',
                    size: size,
                    resolve: {
                        data: function () {
                            return {'action':'Create','project' : {id:0,logo:null} };
                        }
                    }
                });

                modalInstance.result.then(function () {
                    // $scope.selected = selectedItem;
                    //$timeout(function(){
                        $scope.getHotelProject();
                        angular.element("#ToolTables_crudtable_1").addClass("disabled");
                    //},100);
                    
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };


            $scope.projectgrid = {
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                paginationPageSizes: [15, 40, 70],
                paginationPageSize: 15,
                data: "createProjectData"
            };

            $scope.projectgrid.columnDefs = [{
                field: 'id',
                displayName: "Id",
                visible:false
            },{
                field: 'name',
                displayName: "Name"
            }, {
                field: 'address',
                displayName: 'Address'
            }, {
                field: 'logo',
                displayName: 'Logo',
                visible:false
            }, {
                field: 'currency',
                displayName: 'Currency',
                visible:false
            }, {
                field: 'operator',
                displayName: 'Operator',
                visible:false
            }, {
                field: 'controller',
                displayName: 'Controller',
                visible:false
            }, {
                field: 'dashboard',
                displayName: 'Dashboard',
                visible:false
            }, {
                field: 'currencyName',
                displayName: 'Currency Name'
            }, {
                field: 'operatorName',
                displayName: 'Operator Name'
            }, {
                field: 'controllerName',
                displayName: 'Controller Name'
            }, {
                field: 'dashboardName',
                displayName: 'Dashboard Name'
            }];
            $scope.projectgrid.multiSelect = false;
            $scope.projectgrid.modifierKeysToMultiSelect = false;
            $scope.projectgrid.noUnselect = true;
            $scope.projectgrid.onRegisterApi = function (gridApi) {
                //set gridApi on scope
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    var msg = 'row selected ' + row.isSelected;
                    angular.element("#ToolTables_crudtable_1").removeClass("disabled");
                    $scope.project = row.entity;
                    $log.log(msg);
                });
            }
            $scope.getHotelProject = function () {
                $http.get(server.baseApiUrl + apis.getHotelProject).then(function (res) {
                    if (!!res.data.error) {
                        growl.error("Error showing view hotel Project details");
                    } else {
                        $scope.createProjectData = res.data.data || [];
                    }

                });
            };

            $scope.editProject = function (size) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'createProjectModal.html',
                    controller: 'app.createProjectModalCtrl',
                    size: size,
                    resolve: {
                        data: function () {
                            return {'action':'Edit','project' : $scope.project };
                        }
                    }
                });

                modalInstance.result.then(function () {
                    // $scope.selected = selectedItem;
                    // $timeout(function(){
                        $scope.getHotelProject();
                        angular.element("#ToolTables_crudtable_1").addClass("disabled");
                   // },100);
                   
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
            $scope.getHotelProject();
            hotelCreateServicesController.$inject = ['$scope', '$uibModal', '$log', '$http', 'server', 'apis', 'growl', '$localStorage','$timeout'];


        };
        angular.module('employeeApp').controller('app.hotelCreateServicesController', hotelCreateServicesController);

    }(app.createProject || (app.createProject = {})));
})(app || (app = {}));