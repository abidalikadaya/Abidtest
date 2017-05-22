(function (app) {
    var ModalProject;
    (function (ModalProject) {
        'use strict'

        var createProjectModalCtrl = function ($scope, $log, $http, server, apis, growl, $localStorage, $uibModalInstance, data, Upload) {
            console.log(data);
            $scope.project = angular.copy(data.project);
            $scope.action = angular.copy(data.action);
            $scope.projectMaster = {};
            $scope.uploadFlag = false;
            if($scope.action === "Edit"){
                $scope.required = false;
            }else{
                $scope.required = true;
            }
            
            $http.get(server.baseApiUrl + apis.getProjectMaster).then(function (res) {
                if (!!res.data.success) {
                    $scope.projectMaster = res.data.data;
                    console.log($scope.projectMaster);
                } else {
                    growl.error("Error getting plugins data");
                }
            });

            $scope.ok = function () {

                if ($scope.uploadFlag && $scope.action === "Edit") {
                    if ($scope.createProject_form.file.$valid && $scope.uploadLogo) { //check if from is valid
                        $scope.uploadWithData($scope.uploadLogo, $scope.project, server.baseApiUrl + apis.hotelLogoUploadWithData, $uibModalInstance); //call upload function
                        angular.element("input[ID='logo']").val(null);
                        //$uibModalInstance.close();
                    }
                }else if(!$scope.uploadFlag && $scope.action === "Edit"){
                    $http.post(server.baseApiUrl + apis.hotelLogoUploadWithData,{project:$scope.project}).then(function (res) {
                        if (!!res.data.error) {
                            growl.error("Error creating period");
                        } else {
                            growl.success("project created successfully !!");
                            $uibModalInstance.close();
                        }
                    });
                }else if(!$scope.uploadFlag && $scope.action === "Create"){
                    if ($scope.createProject_form.file.$valid && $scope.uploadLogo) { //check if from is valid
                        $scope.uploadWithData($scope.uploadLogo, $scope.project, server.baseApiUrl + apis.hotelLogoUploadWithData, $uibModalInstance); //call upload function
                        angular.element("input[ID='logo']").val(null);
                        //$uibModalInstance.close();
                    }
                }


            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.uploadWithData = function (file, project, apiUrl, uibIntance) {
                Upload.upload({
                    url: apiUrl, //webAPI exposed to upload the file
                    data: {
                        file: file,
                        "project": project
                    } //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    if (resp.data.success) { //validate success
                        growl.success('project created successfully');
                        uibIntance.close();
                    } else {
                        growl.error('an error occured');
                    }
                }, function (resp) { //catch error
                    growl.error('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            };

            $scope.uploadToggle = function () {
                if ($scope.uploadFlag) {
                    $scope.uploadFlag = false;
                    $scope.required = false;
                } else {
                    $scope.uploadFlag = true;
                     $scope.required = true;
                }
            }
            createProjectModalCtrl.$inject = ['$scope', '$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$uibModalInstance', 'data', 'Upload'];


        };
        angular.module('employeeApp').controller('app.createProjectModalCtrl', createProjectModalCtrl);

    }(app.ModalProject || (app.ModalProject = {})));
})(app || (app = {}));