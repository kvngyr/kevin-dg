'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', ['$rootScope', 'DataStore', function($rootScope, DataStore) {
    if (!$rootScope.course) {
        DataStore.get()
            .success(function(data) {
                $rootScope.course = data;
            });
    }
}])

.controller('HolesCtrl', function() {
// Nothing here... yet!
})

.controller('HoleCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'DataStore', function($scope, $rootScope, $stateParams, $state, DataStore) {
    $scope.hole = {};
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
}]);
