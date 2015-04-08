'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', ['$rootScope', 'DataStore', function($rootScope, DataStore) {

  if (!$rootScope.course) {
    DataStore.get()
      .success(function(data){
        $rootScope.course = data;
    });
  }

}])

.controller('PlaylistCtrl', ['$scope', '$rootScope', '$stateParams', 'DataStore', function($scope, $rootScope, $stateParams, DataStore) {
  $scope.hole = {};

  if ($rootScope.course) {
    $scope.hole = $rootScope.course.holes[$stateParams.playlistId];
  } else {
    DataStore.get()
      .success(function(data){
        $rootScope.course = data;
        $scope.hole = $rootScope.course.holes[$stateParams.playlistId];
    });
  }

}]);
