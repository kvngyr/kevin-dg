'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', ['$rootScope', 'DataStore', function($rootScope, DataStore) {
    if (!$rootScope.course) {
        DataStore.get()
            .success(function(data) {
                $rootScope.course = data;
            });
    }

    if (!$rootScope.round) {
        $rootScope.round = [];
    }
}])

.controller('HolesCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    if (!$rootScope.round) {
        $rootScope.round = [];
    }
    $scope.score = function(holeId) {
        var thisHole = _.find($rootScope.round, function(hole) { return hole.id === holeId; });
        if (thisHole) {
            return ' / Score ' + thisHole.score;
        }
    };
}])

.controller('HoleCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'DataStore', function($scope, $rootScope, $stateParams, $state, DataStore) {
    $scope.hole = {};

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

    if ($rootScope.course) {
        $scope.hole = _.findWhere($rootScope.course.holes, {'id': parseInt($stateParams.holeId)});
    } else {
        DataStore.get()
            .success(function(data){
                $rootScope.course = data;
                $scope.hole = _.findWhere($rootScope.course.holes, {'id': parseInt($stateParams.holeId)});
            });
    }

    if (!$rootScope.round) {
        $rootScope.round = [];
    }
}]);
