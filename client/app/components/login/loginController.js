(function (app) {
    var login;
    (function (login) {
        var loginController = function ($scope, $location, $http, server, apis, $state, $localStorage, growl,$rootScope) {
            $scope.user = {};
            $scope.submitLogin = function () {
                $http.post(server.baseApiUrl + apis.login, $scope.user).then(function (res) {
                    if (!!res.data.error) {
                        growl.error("Please enter correct username and password");
                    } else {
                        $localStorage.loggedIn = true;
                        $localStorage.userInfo = res.data.data[0];
                        $localStorage.isNormalUser = (res.data.data[0].isManager === 0 && !res.data.data[0].deptName) ? true : false;
                        $localStorage.isManager = (res.data.data[0].isManager === 1) ? true : false;
                        $localStorage.isDeptUser = (!!res.data.data[0].deptName) ? true : false;
                        if (!!$localStorage.userInfo) {
                            //$scope.username = $localStorage.userInfo.userName;
                            $rootScope.hotelRoles = {
                                isAdmin: false,
                                isOperator: false,
                                isController: false,
                                isDashboard: false
                            };
                            var hotelUser = _.filter($localStorage.userInfo, ["pluginName", "Hotel"]);
                            $scope.hotelRoles.isAdmin = _.some(hotelUser, {
                                'roleName': 'admin'
                            });
                            $scope.hotelRoles.isOperator = _.some(hotelUser, {
                                'roleName': 'operator'
                            });
                            $scope.hotelRoles.isController = _.some(hotelUser, {
                                'roleName': 'controller'
                            });
                            $scope.hotelRoles.isDashboard = _.some(hotelUser, {
                                'roleName': 'dashboard'
                            });

                            $rootScope.pluginRoles = {};

                            $rootScope.pluginRoles.hotelPlugin = _.some($localStorage.userInfo,{'pluginName':'Hotel'});
                            $rootScope.pluginRoles.procPlugin = _.some($localStorage.userInfo,{'pluginName':'Procurement'});
                            $rootScope.pluginRoles.hrPlugin = _.some($localStorage.userInfo,{'pluginName':'H.R. Services'});
                            $rootScope.pluginRoles.reportPlugin = _.some($localStorage.userInfo,{'pluginName':'Report'});
                            //$rootScope.pluginRoles.adminPlugin = _.some($localStorage.userInfo,{'pluginName':'admin'});
                            $rootScope.pluginRoles.itPlugin = _.some($localStorage.userInfo,{'pluginName':'I.T. Services'}); 
                            console.log($rootScope.pluginRoles);

                            $localStorage.pluginRoles = $rootScope.pluginRoles;
                            $localStorage.hotelRoles = $rootScope.hotelRoles;

                        }
                        if($rootScope.pluginRoles.hotelPlugin){
                            if($rootScope.hotelRoles.isAdmin){
                                $state.go('hotelDashBoard');
                            }else if($rootScope.hotelRoles.isOperator){
                                $state.go('hotelActual');
                            }else if($rootScope.hotelRoles.isController){
                                $state.go('hotelDashBoard');
                            }else if($rootScope.hotelRoles.isDashboard){
                                $state.go('hotelDashBoard');
                            }
                        }else{
                            $state.go('home');
                        }
                        
                    }
                });
            };
            $scope.ResetPwd = function () {
                $scope.inputemail = "";
                angular.element("#ResetPwd-modal").modal('show');
            };
            $scope.ResetPwdButton = function () {
                $http.post(server.baseApiUrl + apis.passwordReset, {
                    'emailAdderess': $scope.user.resetEmail
                }).then(function (res) {
                    if (!!res.data.error) {
                        console.log(res.data);
                        growl.error("Please enter correct Email Address! ");
                    } else {
                        console.log(res.data);
                        $localStorage.loggedIn = true;
                        growl.error("Password send successful on your Email Address! ");
                    }
                })
            }
        }
        loginController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage', 'growl','$rootScope'];
        angular.module('employeeApp').controller('app.loginController', loginController);
    }(app.login || (app.login = {})));
})(app || (app = {}));