'use strict';

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // $ionicConfigProvider.views.transition('none');

    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html'
            }
        }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
            'menuContent': {
                templateUrl: 'templates/browse.html',
                controller: 'BrowseCtrl'
            }
        }
    })
    .state('app.holes', {
        url: '/holes',
        views: {
            'menuContent': {
                templateUrl: 'templates/holes.html',
                controller: 'HolesCtrl'
            }
        }
    })

    .state('app.single', {
        url: '/hole/:holeId',
        views: {
            'menuContent': {
                templateUrl: 'templates/hole.html',
                controller: 'HoleCtrl'
            }
        }
    })

    .state('app.scorecard', {
        url: '/scorecard',
        views: {
            'menuContent': {
                templateUrl: 'templates/scorecard.html',
                controller: 'ScorecardCtrl'
            }
        }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/browse');
});
