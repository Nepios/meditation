angular.module('MeditationCtrls', ['MeditationServices'])
.controller('HomeCtrl', ['$scope', 'Meditation', function($scope, Meditation) {
  $scope.meditations = [];

   Meditation.query(function success(data) {
    $scope.meditations = data;
  }, function error(data) {
    console.log(data);
  });

  $scope.deleteMeditation = function(id, meditationIdx) {
    Recipe.delete({id: id}, function success(data) {
      $scope.meditations.splice(meditationIdx, 1);
    }, function error(data) {
      console.log(data);
    });
  }
}])

.controller('NewCtrl', ['$scope', '$location', 'Meditation', function($scope, $location, Meditation) {

    $scope.meditation = {
      title: '',
      description: '',
      link: '',
      author: '',
      emotion: 0,
      duration: 0
    };

    $scope.createMeditation = function() {
      Meditation.save($scope.meditation, function success(data) {
        $location.path('/');
      }, function error(data) {
        console.log(data);
      });
    }
}])

.controller('ShowCtrl', ['$scope', '$stateParams', 'Meditation', function($scope, $stateParams, Meditation) {
  $scope.recipe = {};

  Meditation.get({id: $stateParams.id}, function success(data) {
    $scope.meditation = data;
  }, function error(data) {
    console.log(data);
  });
}])

.controller('NavCtrl', ['$scope', 'Auth', '$state', function($scope, Auth, $state) {
  $scope.Auth = Auth;
  $scope.logout = function() {
    Auth.removeToken();
    $state.reload();
  }
}])
.controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res){
     $location.path('/');
    }, function error(res){
      console.log(res);
    });
  }
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', 'Alerts', function($scope, $http, $location, Auth, Alerts) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res){
      Auth.saveToken(res.data.token);
      Alerts.add('success', 'You are logged in');
      $location.path('/');
    }, function error(res){
      console.log(res);
    })
  }
}])

.controller('AlertsCtrl', ['$scope', 'Alerts', function ($scope, Alerts){
  $scope.alerts = Alerts.get();
}])
