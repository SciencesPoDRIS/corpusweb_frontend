(function() {
    'use strict';

    var app = angular.module('webcorpus.webentity', []);

    app.controller('WebEntityCtrl', ['$scope', '$routeParams', '$http', 'loadCorpus', 'categories', 'nodesColor', 
        function($scope, $routeParams, $http, loadCorpus, categories, nodesColor) {
            // Init variables
            var filter;

            // Load corpus
            loadCorpus.getCorpus().then(function(data) {
                $.each(data.split('\n').slice(1), function(index, item) {
                    item = item.split('\t');
                    if (item[0] == $routeParams.webEntityId) {
                        $scope.webEntity = {};
                        $scope.webEntity.ID = item[0];
                        $scope.webEntity.NAME = item[1];
                        $scope.webEntity.PREFIXES = item[2];
                        $scope.webEntity.URL = item[3];
                        $scope.webEntity.STATUS = item[4];
                        $scope.webEntity.INDEGREE = item[5];
                        $scope.webEntity.FULL_NAME = item[6];
                        $scope.webEntity.ACTORS_TYPE = item[7];
                        $scope.webEntity.COUNTRY = item[8];
                        $scope.webEntity.AREA = item[9];
                        $scope.webEntity.ANTHROPOGENIC_CLIMATE_CHANGE = item[10];
                        $scope.webEntity.MITIGATION_ADAPTATION = item[11];
                        $scope.webEntity.INDUSTRIAL_DELEGATION = item[12];
                        $scope.webEntity.THEMATIC_DELEGATION = item[13];
                        $scope.webEntity.LANGUAGE = item[14];
                        $scope.webEntity.COLLECTION = item[15];
                        $scope.webEntity.ABSTRACT_DRAFT = item[16];
                        $scope.webEntity.ABSTRACT = item[17];
                        $scope.webEntity.COMMENT = item[18];
                    }
                });
            });

            // Center the whole graph
            $scope.sigmaCenter = function() {
                var c = $scope.graph.cameras[0]
                c.goTo({
                    ratio: 1,
                    x: 0,
                    y: 0
                })
            }

            // Zoom on the graph
            $scope.sigmaZoom = function() {
                var c = $scope.graph.cameras[0]
                c.goTo({
                    ratio: c.ratio / c.settings('zoomingRatio')
                })
            }

            // Unzoom on the graph
            $scope.sigmaUnzoom = function() {
                var c = $scope.graph.cameras[0]
                c.goTo({
                    ratio: c.ratio * c.settings('zoomingRatio')
                })
            }

            // Add a method to the graph model that returns an
            // object with every neighbors of a node inside
            if (!sigma.classes.graph.hasMethod('neighbors')) {
                sigma.classes.graph.addMethod('neighbors', function(nodeId) {
                    var k,
                        neighbors = {},
                        index = this.allNeighborsIndex[nodeId] || {};
                    for (k in index)
                        neighbors[k] = this.nodesIndex[k];
                    return neighbors;
                });
            };

            // Load the graph
            sigma.parsers.gexf(
                '../data/COP21.gexf', {
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
                    // Color only selected nodes, according to the configuration file
                    var node = $.grep($scope.graph.graph.nodes(), function(item, index) {
                        return item.id == $routeParams.webEntityId;
                    })[0];
                    var color = $.grep(categories.actorsType.values, function(item, index) {
                        return item.id == node.attributes.ACTORS_TYPE;
                    })[0].color;
                    var ids = [];
                    ids.push($routeParams.webEntityId);
                    $.each($scope.graph.graph.neighbors($routeParams.webEntityId), function(item, index) {
                        ids.push(item);
                    });
                    $scope.graph.graph.nodes().forEach(function(node) {
                        if ((ids.indexOf(node.id) != -1) && (node.attributes[categories[nodesColor].mappedField] !== undefined)) {
                            node.color = categories[nodesColor].values.filter(function(item) {
                                return item.id == node.attributes[categories[nodesColor].mappedField];
                            })[0].color;
                        }
                    });
                    // Color the connected edges
                    $scope.graph.graph.edges().forEach(function(e, i) {
                        if (e.source == $routeParams.webEntityId || e.target == $routeParams.webEntityId) {
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
        }
    ]);

})();