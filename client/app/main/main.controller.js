'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket) {
    this.$http = $http;
    this.awesomeThings = [];

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
      socket.syncUpdates('process', this.processes);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
      socket.unsyncUpdates('process');
    });
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

  deleteProcess(process) {
    this.$http.delete('/api/process/' + process._id);
  }
}

angular.module('junk1App')
  .controller('MainController', MainController);

})();
