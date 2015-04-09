'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', ['$rootScope', '$state', function($rootScope, $state) {
    if(_.isEmpty($rootScope.course)) {
        // No course loaded, fuck off back to the browse page
        $state.go('app.browse');
        return;
    }
}])

.controller('BrowseCtrl', ['$scope', '$state', '$rootScope', '$ionicLoading', '$ionicModal', 'DataStore', function($scope, $state, $rootScope,$ionicLoading, $ionicModal, DataStore) {

    $rootScope.course = {};
    $rootScope.round = [];

    var selectedCourseBeforePotentialAbandon = '';

    $scope.modal = $ionicModal.fromTemplateUrl('templates/newgame.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.abandonGame = function() {
        $rootScope.round.length = 0;
        $scope.startGame(selectedCourseBeforePotentialAbandon);
        selectedCourseBeforePotentialAbandon = '';
        $scope.modal.hide();
    };

    $scope.continueGame = function() {
        $scope.modal.hide();
        $state.go('app.holes');
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.startGame = function(course) {
        console.log('Starting a new game at ' + course);
        if (gameInProgress()) {
            selectedCourseBeforePotentialAbandon = course;
            $scope.modal.show();
            return;
        }
        $ionicLoading.show({template: 'Loading'});
        DataStore.get(course)
            .success(function(data) {
                $rootScope.course = data;
                $rootScope.round.length = 0;
                $ionicLoading.hide();
                $state.go('app.holes');
            });
    };

    var gameInProgress = function() {
        return $rootScope.round && $rootScope.round.length > 0;
    };

}])

.controller('HolesCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
    if(_.isEmpty($rootScope.course)) {
        // No course loaded, fuck off back to the browse page
        $state.go('app.browse');
        return;
    }

    $scope.score = function(holeId) {
        var thisHole = _.find($rootScope.round, function(hole) { return hole.id === holeId; });
        if (thisHole) {
            return ' / Score ' + thisHole.score;
        }
    };
}])

.controller('HoleCtrl', ['$scope', '$rootScope', '$stateParams', '$state', function($scope, $rootScope, $stateParams, $state) {

    if(_.isEmpty($rootScope.course)) {
        // No course loaded, fuck off back to the browse page
        $state.go('app.browse');
        return;
    }

    $scope.hole = _.findWhere($rootScope.course.holes, {'id': parseInt($stateParams.holeId)});

    $scope.setScore = function(score) {
        var thisHole = _.find($rootScope.round, function(hole) { return hole.id === $scope.hole.id; });

        $scope.hole.score = score;

        if (thisHole) {
            // Hole already recorded, update
            console.log('Updating hole score');
            _.each($rootScope.round, function(hole) {
                if (hole.id === $scope.hole.id) hole.score = score;
            });
        } else {
            // Add
            console.log('Pushing new hole score');
            $rootScope.round.push({'id': $scope.hole.id, 'score': score, 'par': $scope.hole.par});
        }
    };

    $scope.back = function() {
        var prevHole = _.findWhere($rootScope.course.holes, {'id': (parseInt($stateParams.holeId) - 1)});
        if (prevHole) {
            $state.go('app.single', {'holeId': prevHole.id});
        } else {
            $state.go('app.holes');
        }
    };
    $scope.next = function() {
        var nextHole = _.findWhere($rootScope.course.holes, {'id': (parseInt($stateParams.holeId) + 1)});
        if (nextHole) {
            $state.go('app.single', {'holeId': nextHole.id});
        } else {
            $state.go('app.holes');
        }
    };
}]);
