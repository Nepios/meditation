var app = angular.module('MeditationApp', ['ui.router', 'MeditationCtrls']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$sceDelegateProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider,$sceDelegateProvider) {
  
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://s3-us-west-2.amazonaws.com/meditationappstorage/meditationappstorage/meditations/**'
  ]);

  $urlRouterProvider.otherwise('/404');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'app/views/home.html',
    controller: 'HomeCtrl'
  })
  .state('meditations', {
    url: '/meditations',
    templateUrl: 'app/views/meditation.html',
    controller: 'DisplayCtrl'
  })
  .state('moodmeditations', {
    url: '/meditations/mood/:id',
    templateUrl: 'app/views/mood.html',
    controller: 'ShowCtrl'
  })
    .state('new', {
    url: '/new',
    templateUrl: 'app/views/new.html',
    controller: 'NewCtrl'
  })
   
  .state('signup', {
    url: '/signup',
    templateUrl: 'app/views/userSignup.html',
    controller: 'SignupCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/views/userLogin.html',
    controller: 'LoginCtrl'
  })
  .state('404', {
    url: '/404',
    templateUrl: 'app/views/404.html'
  });

  $locationProvider.html5Mode(true);
}])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}])