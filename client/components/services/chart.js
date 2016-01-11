angular.module('junk1App')
  .factory('chartService', ['$http', '$q', function ($http, $q) {

  // GET YOUR API KEY. IT'S FREE AT http://www.last.fm/api
  var apiKey = '9e421941650f3e6d9058baf8d69d4df9';

  return {
    topTags: function () {
      var url = 'http://ws.audioscrobbler.com/2.0/';
      return $http.get(url, {
        params: {
          method: 'chart.gettoptags',
          api_key: apiKey,
          format:'json'
        }
      });
    },
    topArtists: function (tag) {
      var url = 'http://ws.audioscrobbler.com/2.0/';
      return $http.get(url, {
        params: {
          method: 'tag.gettopartists',
          api_key: apiKey,
          tag: tag,
          format:'json'
        }
      });
    },
    getProcesses: function () {
      var url = 'api/process';
      return $http.get(url);
    },
    getRecords: function() {
      return $http.get('api/record');
    },
    serviceData: function(){
      return $q.when();
    }
  };
}]);
