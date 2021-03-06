(function() {
    'use strict';

    /* Filters */

    var app = angular.module('webcorpus.filters', []);

    app.filter('translate2', [
        function() {
            return function(input, $scope, facet) {
                $.each($scope.corpus.categories, function(index, item) {
                    if(facet == item['mappedField']) {
                        facet = item['id'];
                    }
                });
                var txt, i;
                if (input === undefined) {
                    return '';
                } else {
                    txt = '';
                    if(Object.keys($scope.corpus.categories).includes(facet)) {
                        $.each(input.split(' ; '), function(index, item) {
                            i = 0;
                            while (i < $scope.corpus.categories[facet].values.length && $scope.corpus.categories[facet].values[i].id != item) {
                                i++;
                            }
                            if(i == $scope.corpus.categories[facet].values.length) {
                                console.log('in if');
                                txt = input
                            } else {
                                txt += (txt == '' ? '' : ', ');
                                txt += $scope.corpus.categories[facet].values[i].label;
                            }
                        });
                        return txt;
                    } else {
                        return input;
                    }
                }
            };
        }
    ]);

    app.filter('displayedCategories', [
        function() {
            return function(input, search) {
                var result = {};
                angular.forEach(search, function(value, key) {
                    if(value.isDiplayed) {
                        result[key] = value;
                    }
                });
                return result;
            }
        }
    ]);

    app.filter('limitTo', [
        function() {
            return function(input, limit) {
                if (input === undefined) return []
                if (isNaN(limit)) { limit = Infinity; }
                return input.filter(function(d, i) {return i<limit})
            }
        }
    ]);

    app.filter('filterBy', [
        function() {
            return function(input, attr) {
                if (input === undefined) return []
                if (input.filter) {
                    return input.filter(function(d, i) {return d[attr]})
                } else {
                    var result = {}
                    var i
                    for (i in input) {
                        if (input[i][attr]) {
                            result[i] = input[i]
                        }
                    }
                    return result
                }
            }
        }
    ]);

    app.filter('renderHtml', ['$sce', 
        function($sce) {
            return function (input) {
                return $sce.trustAsHtml(input);
            }
        }
    ]);

    app.filter('formatDate', [ 
        function() {
            return function (input) {
                var tmp = input.split('-')
                return [tmp[2], tmp[1], tmp[0]].join('/');
            }
        }
    ]);

})();