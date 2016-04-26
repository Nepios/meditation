angular.module('MeditationCtrls', ['MeditationServices'])
.controller('HomeCtrl', ['$scope', 'Meditation', function($scope, Meditation) {
  $scope.meditations = [];

  $scope.deleteMeditation = function(id, meditationIdx) {
    Meditation.delete({id: id}, function success(data) {
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

.controller('ShowCtrl', ['$scope', '$stateParams', 'MeditationSearch', function($scope, $stateParams, MeditationSearch) {
  $scope.meditation = {};
  MeditationSearch.get({mood: $stateParams.id},function success(data) {
    $scope.meditations = data;
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
     $location.path('/login');
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
      console.log("login controller res" +res);
    })
  }
}])

.controller('DisplayCtrl', ['$scope', 'Meditation', function($scope, Meditation) {
  $scope.meditations = [];
  Meditation.query(function success(data) {
    $scope.meditations = data;
  }, function error(data) {
    console.log(data);
  });
}])

.controller('TimerCtrl', ['$scope', '$interval', '$filter', function($scope, $interval, $filter) {
    $scope.mySound = new buzz.sound("/app/tibetan-bowl.mp3");
    $scope.Timer = 40;
    $scope.minutes = ('0' + Math.floor($scope.Timer / 60)).slice(-2);
    $scope.seconds = ('0' + ($scope.Timer % 60)).slice(-2);
    
    $scope.calculateTime = function () {
      $scope.minutes = ('0' + Math.floor($scope.Timer / 60)).slice(-2);
      $scope.seconds = ('0' + ($scope.Timer % 60)).slice(-2);
      $output = $scope.minutes + ":" + $scope.seconds;
    }
    
    $scope.startTimer = function() {
      // $scope.counter = true;
      $scope.mySound.load();
      $scope.mySound.play();
      $scope.intervalId = $interval(function() {
        if ($scope.Timer > 0 ){
          $scope.Timer--
          $scope.calculateTime($scope.Timer);
        } else if ($scope.Timer == 0){
          $scope.mySound.play();
          $interval.cancel($scope.intervalId);
        }
      }, 1000)
    }

    $scope.stopTimer = function () {
      $interval.cancel($scope.intervalId);
    }
    $scope.resetTimer = function () {
      $scope.Timer = 300;
      $scope.calculateTime($scope.Timer);
    }
    $scope.addTimer = function () {
      if ($scope.Timer < 3600){
        $scope.Timer += 300;
        $scope.calculateTime($scope.Timer);
      }
    }
}])

.controller('AlertsCtrl', ['$scope', 'Alerts', function ($scope, Alerts){
  $scope.alerts = Alerts.get();
  $scope.showAlerts = true;
  setTimeout(function() {
    $scope.alerts = Alerts.clear();
  }, 4000)
}])
