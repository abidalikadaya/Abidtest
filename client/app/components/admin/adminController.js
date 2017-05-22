(function (app) {
	var admin;
	(function (admin) {
		'use strict'

		var adminController = function ($scope, $uibModal, $log, $http, server, apis, growl, $localStorage, Upload) {
			$scope.plugin = {
				procurement: false,
				itServices: false,
				hrServices: false,
				reports: false,
				hotelServices: false
			};

			$scope.emailSetting = {
				serverName: '',
				port: '',
				fromEmail: '',
				toEmail: '',
				timeOut: '',
				userName: '',
				password: '',
				sslEnabled: false,
				sslCertificate: '',
				sslCertificatePwd: ''
			};

			$scope.pluginsMaps = {};
			$scope.createUser = {};
			$scope.defaultPluginsData = {};
			$scope.managers = {};
			$scope.pluginRoles = {};

			//Get plugins
			$http.get(server.baseApiUrl + apis.plugins).then(function (res) {
				if (!!res.data.success) {
					$scope.defaultPluginsData = res.data.data;
					$scope.pluginsMaps = _.groupBy($scope.defaultPluginsData, 'id');
				} else {
					growl.error("Error getting plugins data");
				}
			});

			//Get managers
			$http.get(server.baseApiUrl + apis.getManagers).then(function (res) {
				if (!!res.data.success) {
					$scope.managers = res.data.data;
				} else {
					growl.error("Error getting managers data");
				}
			});

			// Get Roles
			$http.get(server.baseApiUrl + apis.getRoles).then(function (res) {
				if (!!res.data.success) {
					$scope.pluginRoles = res.data.data;
				} else {
					growl.error("Error getting roles for all");
				}
			});

			$scope.submitBannerImage = function () { //function to call on form submit
				if ($scope.upload_form.file.$valid && $scope.uploadBannerFile) { //check if from is valid
					$scope.upload($scope.uploadBannerFile, server.baseApiUrl + apis.loginBannerImageUpload); //call upload function
					angular.element("input[ID='LoginLogofile']").val(null);
				}
			};

			$scope.submitCompanyLogoImage = function () { //function to call on form submit
				if ($scope.upload_form1.file.$valid && $scope.uploadCompanyFile) { //check if from is valid
					$scope.upload($scope.uploadCompanyFile, server.baseApiUrl + apis.companyLogoUpload); //call upload function
					angular.element("input[ID='companyLogoFile']").val(null);
				}
			};
			$scope.submitCompanyLoginLogoImage = function () { //function to call on form submit
				if ($scope.upload_form2.file.$valid && $scope.uploadCompanyLoginFile) { //check if from is valid
					$scope.upload($scope.uploadCompanyLoginFile, server.baseApiUrl + apis.companyLoginLogoUpload); //call upload function
					angular.element("input[ID='companyLoginLogoFile']").val(null);
				}
			};

			$scope.upload = function (file, apiUrl) {
				Upload.upload({
					url: apiUrl, //webAPI exposed to upload the file
					data: {
						file: file,
						"name": "inaam"
					} //pass file as data, should be user ng-model
				}).then(function (resp) { //upload function returns a promise
					if (resp.data.success) { //validate success
						growl.success('Success ' + resp.config.data.file.name + ' uploaded.');
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

			$scope.submitAppPlugins = function () {
				var payloadPlugin = [];
				for (var key in $scope.plugin) {
					if ($scope.plugin.hasOwnProperty(key)) {
						var tempObj = {};
						tempObj.name = key;
						tempObj.value = $scope.plugin[key].toString();
						payloadPlugin.push(tempObj);
					}
				};
				$http.post(server.baseApiUrl + apis.saveSettings, {
					plugins: payloadPlugin
				}).then(function (res) {
					if (!!res.data.error) {
						growl.error("Error updating settings value");
					} else {
						growl.success("Plugin settings updated successfully");
					}
				});
			};

			$scope.submitEmailSetting = function () {
				$http.post(server.baseApiUrl + apis.createEmailSetting, $scope.emailSetting).then(function (res) {
					if (!!res.data.error) {
						growl.error("Error updating Email settings value");
					} else {
						growl.success("Email settings updated successfully");
					}
				});
			}

			$scope.submitCreateUser = function () {
				var roleIds = '';
				_.each($scope.createUser.selectedPluginRoles, function (val, key) {
					_.each(val, function (val1, key1) {
						if(val1){
							roleIds += key1+",";
						}
					});
				});
				var payload = {
					'username': $scope.createUser.username,
					'firstName': $scope.createUser.firstName,
					'middleName': $scope.createUser.middleName,
					'lastName': $scope.createUser.lastName,
					'managerId': Number($scope.createUser.manager),
					'isManager': ($scope.createUser.isManager == 'yes') ? 1 : 0,
					'password': 'password',
					'emailAddress': $scope.createUser.emailAddress,
					'mobileNumber': Number($scope.createUser.mobileNumber),
					'officeNumber': Number($scope.createUser.officeNumber),
					'officeExtn': Number($scope.createUser.extention),
					'roleIds': roleIds
				};
				$http.post(server.baseApiUrl+apis.createUser, payload).then(function (res) {
					if(!!res.data.error){
						growl.error("Error Creating user");
					}else{
						growl.success("user account created successfully");								
					}
				});
			}
		};

		adminController.$inject = ['$scope', '$uibModal', '$log', '$http', 'server', 'apis', 'growl', '$localStorage', 'Upload'];

		angular.module('employeeApp').controller('app.adminController', adminController);
	}(app.admin || (app.admin = {})));
})(app || (app = {}));