(function() {
    'use strict';

    var app = angular.module('webcorpus.webentity', []);

    app.controller('WebEntityCtrl', ['$scope', '$routeParams', 'loadCorpus', 'loadCorpusData', '$sce',
        function($scope, $routeParams, loadCorpus, loadCorpusData, $sce) {
            // Init variables
            var filter,
                itemFacets,
                neighbors;

            // Init scope variables
            $scope.isCollapsed = true;
            // Quantity of neighbors nodes to display by default
            $scope.neighborsQuantity = 5;
            $scope.corpusId = $routeParams.corpusId;
            $scope.webEntityId = $routeParams.webEntityId;
            $scope.lang = $routeParams.lang;

            // Load all the corpus descriptions
            loadCorpus.getCorpus($scope.corpusId).then(function(data) {
                $scope.corpus = data;

                // Load corpus
                loadCorpusData.getData($scope.corpusId).then(function(data) {
                    itemFacets = Object.keys(data.data[0]);
                    $.each(data.data, function(index, item) {
                        if(item['ID'] == $scope.webEntityId) {
                            $scope.webEntity = item;
                        }
                    });
                });
            });

            // Collapse or uncollapse neighbors
            $scope.collapse = function() {
                if ($scope.isCollapsed) {
                    $scope.neighborsQuantity = 500;
                } else {
                    $scope.neighborsQuantity = 5;
                }
                $scope.isCollapsed = !$scope.isCollapsed;
            }

            // Return true if this field should be shown for this item, otherwise return false
            // A facet is showable for an item if it is not empty and not equal to 'not_applicable'
            $scope.isShowable = function(item) {
                return ($scope.webEntity && $scope.webEntity[item] && ($scope.webEntity[item] != '') && ($scope.webEntity[item] != 'not_applicable'));
            }

            // Add a method to the graph model that returns an object with every neighbors of a node inside
            if (!sigma.classes.graph.hasMethod('neighbors')) {
                sigma.classes.graph.addMethod('neighbors', function(nodeId) {
                    var k,
                        neighbors = [],
                        index = this.allNeighborsIndex[nodeId] || {};
                    for (k in index) {
                        neighbors.push(this.nodesIndex[k])
                    }
                    return neighbors;
                });
            };

            /*
            // Load the graph
            sigma.parsers.gexf(
                'data/' + $scope.corpusId + '.gexf', {
                    container: 'graph',
                    settings: {
                        defaultEdgeColor: '#d3d3d3',
                        edgeColor: 'default',
                        labelThreshold: 100
                    }
                },
                function(s) {
                    // Initialize the Sigma Filter API
                    filter = new sigma.plugins.filter(s);
                    $scope.graph = s;
                    var node = $.grep($scope.graph.graph.nodes(), function(item, index) {
                        return item.id == $scope.webEntityId;
                    })[0];
                    var color = $.grep($scope.corpus.categories.actorsType2.values, function(item, index) {
                        return item.id == node.attributes.ACTORS_TYPE_2;
                    })[0].color;
                    var ids = [];
                    ids.push($scope.webEntityId);
                    neighbors = $scope.graph.graph.neighbors($scope.webEntityId);
                    $.each(neighbors, function(index, item) {
                        ids.push(item.id);
                    });
                    // Color the connected nodes, ie the selected node and its neighbors
                    $scope.graph.graph.nodes().forEach(function(node) {
                        if ((ids.indexOf(node.id) != -1) && (node.attributes[$scope.corpus.categories[$scope.corpus.nodesColor].mappedField] !== undefined)) {
                            node.color = $scope.corpus.categories[$scope.corpus.nodesColor].values.filter(function(item) {
                                return item.id == node.attributes[$scope.corpus.categories[$scope.corpus.nodesColor].mappedField];
                            })[0].color;
                        }
                    });
                    // Color the connected edges
                    $scope.graph.graph.edges().forEach(function(e, i) {
                        if (e.source == $scope.webEntityId || e.target == $scope.webEntityId) {
                            e.color = color;
                            // Remove edge from edges array
                            $scope.graph.graph.dropEdge(e.id);
                            // Add edge as last element of edges array (to render it at the top of other edges)
                            $scope.graph.graph.addEdge(e);
                        }
                    });

                    $scope.graph.refresh();
                }
            );
            */
        }
    ]);

})()