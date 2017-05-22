(function (app){
    var procure;
    (function (procure) {
        'use strict'

        var procurementController = function($scope,$uibModal,$log,$http, server, apis, growl, $localStorage){
            $scope.isNormalUser = $localStorage.isNormalUser;
            $scope.isManager = $localStorage.isManager;
            $scope.isDeptUser = $localStorage.isDeptUser;
            $scope.pendingApproval = [];
            $scope.requestedByMe = [];
            $scope.closedRequest = [];

            var getUiGridOptions = function(gridId) {
                return {
                    enableSorting: false,
                    columnDefs: [
                        { field: 'id', name: '', displayName:"View", cellTemplate: 'app/components/procurement/viewButton.html', width: 60 },
                        { field: 'code', displayName:'Item Code' },
                        { field: 'description' , displayName:'Item Description' },
                        { field: 'price' , displayName:'Amount'},
                        { field: 'statusName', displayName:'Status'},
                        { field:'CreatedDate', displayName:'Date'}
                    ],
                    onRegisterApi: function( gridApi ) {
                        $scope.grid1Api = gridApi;
                    },
                    data:gridId
                };
            };

            $scope.gridProcurePending = getUiGridOptions('pendingApproval');
            $scope.gridProcureRequest = getUiGridOptions('requestedByMe');
            $scope.gridProcureClosed = getUiGridOptions('closedRequest');

            $scope.getProcureData = function(){
                $http.get(server.baseApiUrl+apis.getProcurement).then(function(res){
                    if(!!res.data.error){
                        growl.error("Error showing procurement details");
                    }else{
                        $scope.pendingApproval = res.data.data.pendingApproval || [];
                        $scope.requestedByMe = res.data.data.requestedByMe || [];
                        $scope.closedRequest = res.data.data.closedRequest || [];
                    }
                });
            };

            $scope.getProcureData();

            $scope.addItem = function(){
                $scope.$broadcast('angucomplete-alt:clearInput', "searchCode");
                $scope.itemDescription = "";
                $scope.itemAmount = "";
                angular.element("#add-proc-modal").modal('show');
            };

            $scope.viewItem = function(grid,row){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/components/procurement/viewItem.html',
                    controller: 'app.procurementViewController',
                    size: 'lg',
                    resolve: {
                        grid: function () { return grid; },
                        row: function () { return row; }
                    }
                });
                modalInstance.result.then(function () {
                    $scope.getProcureData();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
             };

            $scope.$watch('selectedItems.originalObject', function() {
                if(!!$scope.selectedItems){
                    $scope.itemDescription = $scope.selectedItems.originalObject.description;
                    $scope.itemAmount = $scope.selectedItems.originalObject.price;
                }
            }, true);

            $scope.raiseRequest = function(){
                var selectedProductId = $scope.selectedItems.originalObject.id;
                $http.post(server.baseApiUrl+apis.addProcurement, {productId:selectedProductId}).then(function (res) {
                    if(!!res.data.error){
                        growl.error("Error adding procurement details");
                    }else{
                        angular.element("#add-proc-modal").modal('hide');
                        growl.success("Request raised successfully !!");
                        $scope.getProcureData();
                    }
                });
            }
        };
        procurementController.$inject = ['$scope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage'];

        var procurementViewController = function($scope,$uibModalInstance,grid, row , $http ,server ,apis, $localStorage, growl){
                var activeSelectedTab = angular.element('#procurement-tabs li.active a[data-toggle="tab"]').attr('aria-controls'),
                    isNormalUser = $localStorage.isNormalUser,
                    isManager = $localStorage.isManager,
                    isDeptUser = $localStorage.isDeptUser,
                    deptName = $localStorage.userInfo.deptName,                 
                    status = 0;
                $scope.auditData = [];
                $scope.formData = {};
                $scope.activeTabRequestByMe = (activeSelectedTab === 'tab_3-3') ? true: false;
                $scope.isNormalUser = $localStorage.isNormalUser;
                $scope.isManager = $localStorage.isManager;
                $scope.isDeptUser = $localStorage.isDeptUser;

                $http.get(server.baseApiUrl+apis.getProcureAudit+'/'+row.entity.id).then(function(res){
                    if(!!res.data.error){
                        growl.error("Error adding procurement view details");
                    }else{
                        $scope.auditData = res.data.auditData;
                    }   
                });
                
                $scope.updateProcurement = function(data){
                    $http.post(server.baseApiUrl+apis.updateProcurement, data).then(function(res){
                         console.log(res);
                         if(!!res.data.error){
                             growl.error("Error while performiing action.");
                         }else{
                             growl.success("Request registered!");
                             $uibModalInstance.close();
                         }   
                     });
                };

                $scope.approvedRequest = function(data) {   
                    if(isManager === true)  status = 2;
                    if(deptName === 'costControl')  status = 4;
                    else if(deptName === 'wareHouse') status = 6;                        
                    else if(deptName === 'procurement') status = 8;
                    var finalObj = {
                        procurementId: row.entity.id,
                        status: status,
                        approverComment: $scope.formData.reason
                    }
                    $scope.updateProcurement(finalObj)
                };
                
                $scope.rejectRequest = function(data) {
                    if(isManager === true)  status = 3;
                    if(deptName === 'costControl')  status = 5;
                    else if(deptName === 'wareHouse') status = 7;                        
                    else if(deptName === 'procurement') status = 9;                        
                    var finalObj = {
                        procurementId: row.entity.id,
                        status: status,
                        approverComment:  $scope.formData.reason
                    }
                    $scope.updateProcurement(finalObj)
                }
        };
        procurementViewController.$inject = ['$scope','$uibModalInstance','grid', 'row' , '$http' ,'server','apis', '$localStorage', 'growl'];

        angular.module('employeeApp').controller('app.procurementController', procurementController);
        angular.module('employeeApp').controller('app.procurementViewController', procurementViewController);
    }(app.procure || (app.procure = {})));
})(app || (app = {}));;