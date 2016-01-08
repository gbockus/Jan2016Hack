'use strict';

angular.module('junk1App')
  .config(function($stateProvider) {
    $stateProvider
      .state('chart', {
        url: '/',
        templateUrl: 'app/chart/chart.html',
        controller: 'ChartController',
        controllerAs: 'chart',
        resolve: {
          processes : function(chartService) {
            return chartService.getProcesses();
          }
        }
      });
  });
