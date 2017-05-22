(function (app) {
    var actual;
    (function (viewActual) {
        'use strict'

        var hotelViewActualController = function ($scope, $rootScope, $uibModal, $log, $http, server, apis, growl, $localStorage, $timeout) {

            $scope.actualBoxShow = false;

            $scope.daysInMonthList = [];

            $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



            $http.get(server.baseApiUrl + apis.getHotelProjectWithPeriod).then(function (projectListWithYear) {
                if (projectListWithYear.data.success) {
                    $scope.projectListWithYear = projectListWithYear.data.data;
                    $scope.projectWithYearMap = _.groupBy($scope.projectListWithYear, 'projectId');
                } else {
                    growl.error("Error getting projects and periods Data");
                }
            });

            $scope.daysInMonth = function (month, year) {
                return new Date(year, month, 0).getDate();
            }

            /**
             * @param {int} The month number, 0 based
             * @param {int} The year, not zero based, required to account for leap years
             * @return {Date[]} List with date objects for each day of the month
             */
            $scope.getDaysInMonthFull = function(month, year) {
                // Since no month has fewer than 28 days
                var date = new Date(year, month, 1);
                var days = [],
                    tempDate = '', tempDateFormat = '';
                while (date.getMonth() === month) {
                    tempDate = new Date(date);
                    var formattedDate = (tempDate.getDate() < 10) ? "0"+tempDate.getDate() : tempDate.getDate(),
                        formattedMonth = ((tempDate.getMonth() + 1) < 10) ? "0"+(tempDate.getMonth() + 1) : (tempDate.getMonth() + 1); 
                    tempDateFormat =  formattedDate + "/" + formattedMonth + "/" + tempDate.getFullYear()
                    days.push(tempDateFormat);
                    date.setDate(date.getDate() + 1);
                }
                return days;
            }

            $scope.updatePeriod = function (projectId) {
                $scope.projectPeriod = $scope.projectWithYearMap[projectId][0].periodYear;
            }
            $scope.monthIndex = {
                1: 'jan',
                2: 'feb',
                3: 'mar',
                4: 'apr',
                5: 'may',
                6: 'jun',
                7: 'jul',
                8: 'aug',
                9: 'sep',
                10: 'oct',
                11: 'nov',
                12: 'dec'
            }

            $scope.updateActualData = function (selectedProject, selectedPeriod, selectedMonth) {
                $scope.daysInMonthList = [];
                var fieldDividerArr = [0, 1, 2, 3, 8, 9, 11, 12, 13, 14],
                    accumulativeRow = 16,
                    selectedMonthName = $scope.monthIndex[parseInt(selectedMonth) + 1],
                    daysCount = $scope.daysInMonth(parseInt(selectedMonth) + 1, selectedPeriod);

                $scope.daysInMonthList = _.times(daysCount, function (val) {
                    return val + 1;
                });

                $scope.actualBoxShow = true;
                $http.post(server.baseApiUrl + apis.getHotelActualView, {
                    projectId: selectedProject,
                    projectYear: selectedPeriod,
                    projectMonth: parseInt(selectedMonth) + 1
                }).then(function (response) {
                    $scope.actualData = response.data.data;
                    $scope.cloneActualData = _.clone($scope.actualData);
                    $scope.fullDaysField = $scope.getDaysInMonthFull(parseInt(selectedMonth), selectedPeriod);
                });
            }
        }
        hotelViewActualController.$inject = ['$scope', '$rootScope', '$uibModal', '$log', '$http', 'server', 'apis', 'growl', '$localStorage', '$timeout'];

        angular.module('employeeApp').controller('app.hotelViewActualController', hotelViewActualController);
    }(app.actual || (app.actual = {})));
})(app || (app = {}));