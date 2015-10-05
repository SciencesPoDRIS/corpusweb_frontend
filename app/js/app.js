(function() {
    'use strict';

    var app = angular.module('webcorpus', [
        'ui.bootstrap'
    ]);

    app.controller('CorpusSnippetCtrl', ['$scope', 
        function($scope) {
            $scope.isCollapsed = true;
            $scope.collapseFilters = function() {
                $scope.isCollapsed = !$scope.isCollapsed;
                if(!$scope.isCollapsed) {
                    $('.content .filters').height('100%');
                    $('.content .filters .facets').height('100%');
                } else {
                    $('.content .filters').height('150px');
                    $('.content .filters .facets').height('initial');
                }
            }
        }
    ]);

})();