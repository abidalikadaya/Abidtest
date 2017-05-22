(function (app){
    var userProfile;
    (function (userProfile) {
        'use strict'

        var userProfileController = function($scope,$uibModal,$log,$http, server, apis, growl, $localStorage){
    		$scope.dependantDetails = [];

           /* var getUiGridOptions = function(gridId) {
                return {
                    enableSorting: false,
                    columnDefs: [
                        { field: 'name', displayName:'Name' },
                        { field: 'nationality' , displayName:'Nationality' },
                        { field: 'relation' , displayName:'Relation'},
                        { field: 'gender', displayName:'Gender'},
                        { field:'saudiOrExpat', displayName:'Saudi/Expat'},
                        { field:'iqamaID', displayName:'Iqama ID'},
                        { field:'saudiID', displayName:'Saudi ID'},
                        { field:'MobileNumber', displayName:'Mobile Number'},
                        { field:'BithDate', displayName:'Birth Date'},
                        { field:'lastUpdatedDate', displayName:'Last Update Date'},
                        { field:'UpdatedBy', displayName:'Updated By'}
                    ],
                    onRegisterApi: function( gridApi ) {
                        $scope.grid1Api = gridApi;
                    },
                    data:gridId
                };
            };

            $scope.gridDependantDetails = getUiGridOptions('dependantDetails');

            $scope.getDependantDetailsData = function(){
                $http.get(server.baseApiUrl+apis.getProcurement).then(function(res){
                    if(!!res.data.error){
                        growl.error("Error showing dependant details");
                    }else{
                        $scope.dependantDetails = res.data.data.dependantDetails;
                    }
                });
            };

            $scope.getDependantDetailsData();*/

            $scope.addDependant = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/components/userProfile/addEditDependant.html',
                    controller: 'app.addEditDepentantController',
                    size: 'lg',
                    resolve: {
                        
                    }
                });
                modalInstance.result.then(function () {
                   
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
             };
        };
        userProfileController.$inject = ['$scope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage'];

        var addEditDepentantController = function($scope,$uibModalInstance, $http ,server ,apis, $localStorage, growl){
               $scope.depentantDetails = {
                    name:"",
                    nationality:"",
                    relation:"",
                    gender:"",
                    saudiOrExpat:"",
                    iqamaID:"",
                    saudiID:"",
                    mobileNumber:"",
                    birthDate:"",
                    isActive:1
               } 
                  $http.get('app/components/staticJson/nationalities.json')
                                             .success(function(res){
                                                    $scope.nationalities = res.data;
                                                    
                                                });
             $scope.saveDepedent = function(data){

                $http.post(server.baseApiUrl+apis.addDepedent, data).then(function(res){
                         console.log(res);
                         if(!!res.data.error){
                             growl.error("Error while performiing action saveDepedent details.");
                         }else{
                             growl.success("Request registered!");
                             $uibModalInstance.close();
                         }   
                     });
                console.log($scope.depentantDetails);
             };
        };
        addEditDepentantController.$inject = ['$scope','$uibModalInstance','$http' ,'server','apis', '$localStorage', 'growl'];
        
        angular.module('employeeApp').controller('app.userProfileController', userProfileController);
        angular.module('employeeApp').controller('app.addEditDepentantController', addEditDepentantController);
    }(app.userProfile || (app.userProfile = {})));
})(app || (app = {}));;