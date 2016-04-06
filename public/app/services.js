angular.module('MeditationServices', ['ngResource'])
.factory('MeditationSearch', ['$resource', function($resource) {
  return $resource('/api/meditations/mood/:mood', {}, {
    'get': {
      method: 'GET',
      isArray: true
    }
  });
}])

.factory('Meditation', ['$resource', function($resource) {
  return $resource('/api/meditations/:id', {}, {});

}])

.factory('Auth', ['$window', function($window){
  return {
    saveToken: function(token){
      $window.localStorage['secretmeditations-token'] = token;
    },
    getToken: function(){
      return $window.localStorage['secretmeditations-token'];
    }, 
    removeToken: function(){
      $window.localStorage.removeItem('secretmeditations-token');
    },
    isLoggedIn: function(){
      var token = this.getToken();
      return token ? true: false;
    }
  }
}])

.factory('AuthInterceptor', ['Auth', function(Auth){
  return {
    request: function(config) {
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}])

.factory('Alerts', [function() {
  var alerts = [];

  return {
    clear: function() {
      alerts = [];
    },
    add: function(type, msg) {
      alerts.push({type: type, msg: msg});
    },
    get: function() {
      return alerts;
    },
    remove: function(idx) {
      alerts.splice(idx, 1);
    }
  }
}])