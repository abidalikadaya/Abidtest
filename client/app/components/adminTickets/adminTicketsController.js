(function (app){
    var procure;
    (function (procure) {
        'use strict'

        var procurementController = function($scope,$uibModal,$log,$http, server, apis, growl, $localStorage){
            
        };
        procurementController.$inject = ['$scope','$uibModal','$log', '$http', 'server', 'apis', 'growl', '$localStorage'];
        
        angular.module('employeeApp').controller('app.procurementController', procurementController);
    }(app.procure || (app.procure = {})));
})(app || (app = {}));;