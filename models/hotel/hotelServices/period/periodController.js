(function (app) {
    var period;
    (function (createPeriod) {
        'use strict'
        var periodController = function ($scope, $http,$localStorage ,server, apis, growl) {

            $scope.periodYears = [];
            $scope.getProject = {};
            $scope.periodData = {};

            var yearCount = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                getCurrentYear = new Date().getFullYear();

            _.each(yearCount, function (val, key) {
                $scope.periodYears.push(getCurrentYear + val);
            })

            $http.get(server.baseApiUrl + apis.getHotelProject).then(function (res) {
                if (!!res.data.error) {
                    growl.error("Error showing view hotel Project details");
                } else {
                    if (res.data.data) {
                        $scope.getProject = _.filter(res.data.data, ["controller", $localStorage.userInfo[0].id]);
                    } else {
                        $scope.getProject = [];
                    }
                }
            });

            $scope.save = function () {
                $http.post(server.baseApiUrl + apis.savePeriod, $scope.periodData).then(function (res) {
                    if (!!res.data.error) {
                        growl.error("Error creating period");
                    } else {
                        growl.success("period created successfully !!");
                        $scope.clear();
                    }
                });
            };

            $scope.clear = function () {
                $scope.periodData = {};
            }
        }

        periodController.$inject = ['$scope','$http', '$localStorage','server', 'apis', 'growl'];

        angular.module('employeeApp').controller('app.periodController', periodController);
    }(app.period || (app.period = {})));
})(app || (app = {}));