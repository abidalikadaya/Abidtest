(function(app) {
    var extrabar;
    (function(extrabar){
        var extrabarController = function ($scope, $location, $http, server, apis, $state, $localStorage, extrabarFactory,$rootScope){
            $scope.appPluginSettings = {};
            extrabarFactory.getApplicationSettings().then(function(data){
                angular.forEach(data.data , function(val, key){
                    $scope.appPluginSettings[val.name] = (val.value == "true") ? true : false;
                });
            });
        }

        var extrabarFactory = function ($http, server, apis, $localStorage){
            return {
                getApplicationSettings : function(){
                    return $http.get(server.baseApiUrl+apis.getPluginSettings).then(function(data){
                        return data.data;
                    },
                    function(error){
                        growl.error("Error while getting appication settings.");
                    });
                }
            };
        }

        extrabarController.$inject = ['$scope', '$location', '$http', 'server', 'apis', '$state', '$localStorage', 'extrabarFactory','$rootScope'];
        angular.module('employeeApp').controller('app.extrabarController', extrabarController).factory('extrabarFactory', extrabarFactory);
    }(app.extrabar || (app.extrabar = {})));
})(app || (app = {}));