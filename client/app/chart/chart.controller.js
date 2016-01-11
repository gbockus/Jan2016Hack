'use strict';

(function() {

class ChartController {

  constructor($http, $scope, socket, $window, chartService, processes, records) {
    this.$http = $http;
    this.awesomeThings = [];

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });

   $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });

    $scope.tagsize = 'reach';
    $scope.toptags = [];
    $scope.currtag = '';
    $scope.artists = [];
    $scope.boom = [];
  $scope.processes = processes.data;
  console.log('processes is ', processes.data);

    $window.addEventListener('resize', function () {
      $scope.$broadcast('windowResize');
    });

    //chartService.topTags()
    //  .success(function (res) {
    //    if (res.error) {
    //      throw new Error(res.message);
    //    } else {
    //      $scope.toptags = res.tags.tag.map(function (t) {
    //        t.reach    = +t.reach;
    //        t.taggings = +t.taggings;
    //        return t;
    //      });
    //    }
    //  });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('junk1App')
  .controller('ChartController', ChartController);

})();
