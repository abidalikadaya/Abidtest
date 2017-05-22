(function (app){
    var procure;
    (function (procure) {
        'use strict'

        var procurementController = function($scope,$uibModal,$log,$http, server, apis, growl, $localStorage,$timeout){
            $scope.isNormalUser = $localStorage.isNormalUser;
            $scope.isManager = $localStorage.isManager;
            $scope.isDeptUser = $localStorage.isDeptUser;
            $scope.pendingApproval = [];
            $scope.requestedByMe = [];
            $scope.closedRequest = [];

            $scope.tabClick = function(){
                $timeout(function() {
                    angular.element('.grid').trigger('resize');
                }, 50);
            };

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
            var cartGrid = getUiGridOptions('addToCart');
            cartGrid.columnDefs = [
                { field: 'code', displayName:'Item Code' },
                { field: 'description' , displayName:'Item Description' },
                { field: 'price' , displayName:'Amount'},
                { field: 'quantity', displayName:'Quantity'},
                { field: 'CreatedDate', displayName:'Date'}
            ];
            $scope.gridProcureAddToCart = cartGrid;

            $scope.getProcureData = function(){
                $http.get(server.baseApiUrl+apis.getProcurement).then(function(res){
                    if(!!res.data.error){
                        growl.error("Error showing procurement details");
                    }else{
                        $scope.pendingApproval = res.data.data.pendingApproval || [];
                        $scope.requestedByMe = res.data.data.requestedByMe || [];
                        $scope.closedRequest = res.data.data.closedRequest || [];
                        $scope.addToCart = res.data.data.addToCart || [];
                    }
                    $scope.tabClick();
                });
            };

            $scope.getProcureData();

            $scope.addItem = function(){
                $scope.$broadcast('angucomplete-alt:clearInput', "searchCode");
                $scope.itemDescription = "";
                $scope.itemAmount = "";
                $scope.itemQuantity = "";
                $scope.itemTotalAmount = "";
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
                    $scope.itemQuantity = 1;
                    $scope.updateTotalCount();
                }
            }, true);

            $scope.addToCartRequest = function(){
                var selectedProductId = $scope.selectedItems.originalObject.id;
                $http.post(server.baseApiUrl+apis.addToCart, {productId:selectedProductId, quantity: $scope.itemQuantity}).then(function (res) {
                    if(!!res.data.error){
                        growl.error("Error adding add to cart");
                    }else{
                        angular.element("#add-proc-modal").modal('hide');
                        growl.success("Add to cart successfully !!");
                        $scope.getProcureData();
                    }
                });
            }

            $scope.raiseRequest = function(){
                //var selectedProductId = $scope.selectedItems.originalObject.id;
                $http.post(server.baseApiUrl+apis.addProcurement, {}).then(function (res) {
                    if(!!res.data.error){
                        growl.error("Error on submitting request");
                    }else{
                        angular.element("#add-proc-modal").modal('hide');
                        growl.success("Request submitted successfully !!");
                        $scope.getProcureData();
                    }
                });
            }

            $scope.updateTotalCount = function(){
                $scope.itemTotalAmount = $scope.itemAmount * $scope.itemQuantity;
            }
        };
        procurementController.$inject = ['$scope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$timeout'];

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

                var getLabel = function(status){
                    var labelName = '';
                    if(status.indexOf('pending') !== -1){
                        labelName = 'label-warning';
                    }else if(status.indexOf('Approved') !== -1){
                        labelName = 'label-success';
                    }else if(status.indexOf('Rejected') !== -1){
                        labelName = 'label-danger';
                    }
                    return labelName;
                }

                $http.get(server.baseApiUrl+apis.getProcureAudit+'/'+row.entity.id).then(function(res){
                    if(!!res.data.error){
                        growl.error("Error adding procurement view details");
                    }else{
                        $scope.auditData = res.data.auditData;
                        angular.forEach($scope.auditData, function(value, key){
                            value.label = getLabel(value.statusName);
                        });
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