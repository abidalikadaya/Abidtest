(function (app) {
    var hotelGraph;
    (function (hotelGraph) {
        'use strict'

        var hotelGraphController = function ($scope, $uibModal, $log, $http, server, apis, growl, $localStorage, d3, d3tip) {

            /**
             * Group Bar chart core functionality
             * @function groupBarChart
             * @param data, elementId 
             */
            $scope.groupBarChart = function (data, elementId) {

                var margin = {
                        top: 20,
                        right: 20,
                        bottom: 30,
                        left: 40
                    },
                    width = 960 - margin.left - margin.right,
                    height = 350 - margin.top - margin.bottom;

                var x0 = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var x1 = d3.scale.ordinal();

                var y = d3.scale.linear()
                    .range([height, 0]);

                var color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                var xAxis = d3.svg.axis()
                    .scale(x0)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(d3.format(".2s"));

                var tip = d3tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d, i) {
                        return '<span class="tooltiptext">' + d.value + '</span>';
                    });

                var svg = d3.select(elementId).append("svg")
                    .attr("width", width + margin.left + margin.right + 50)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.call(tip);

                var ageNames = d3.keys(data[0]).filter(function (key) {
                    return key !== "hotelName";
                });

                data.forEach(function (d) {
                    d.ages = ageNames.map(function (name) {
                        return {
                            name: name,
                            value: +d[name]
                        };
                    });
                });

                x0.domain(data.map(function (d) {
                    return d.hotelName;
                }));
                x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
                y.domain([0, d3.max(data, function (d) {
                    return d3.max(d.ages, function (d) {
                        return d.value;
                    });
                })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Revenue");

                var hotelName = svg.selectAll(".hotelName")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "hotelName")
                    .attr("transform", function (d) {
                        return "translate(" + x0(d.hotelName) + ",0)";
                    });

                hotelName.selectAll("rect")
                    .data(function (d) {
                        return d.ages;
                    })
                    .enter().append("rect")
                    .attr("width", x1.rangeBand())
                    .attr("x", function (d) {
                        return x1(d.name);
                    })
                    .attr("y", function (d) {
                        return y(d.value);
                    })
                    .attr("height", function (d) {
                        return height - y(d.value);
                    })
                    .style("fill", function (d) {
                        return color(d.name);
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                var legend = svg.selectAll(".legend")
                    .data(ageNames.slice().reverse())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(50," + i * 20 + ")";
                    });

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                        return d;
                    });
            }

            /**
             * Group Bar chart with line core functionality
             * @function groupBarLineChart
             * @param Data, elementId 
             */
            $scope.groupBarLineChart = function (Data, elementId) {
                function getTextWidth(text, fontSize, fontName) {
                    var c = document.createElement("canvas");
                    var ctx = c.getContext("2d");
                    ctx.font = fontSize + ' ' + fontName;
                    return ctx.measureText(text).width;
                }

                function DataSegregator(array, on) {
                    var SegData, thisObject, OrdinalPositionHolder;
                    OrdinalPositionHolder = {
                        valueOf: function () {
                            var keys;
                            thisObject = this;
                            keys = Object.keys(thisObject);
                            keys.splice(keys.indexOf("valueOf"), 1);
                            keys.splice(keys.indexOf("keys"), 1);
                            return keys.length == 0 ? -1 : d3.max(keys, function (d) {
                                return thisObject[d]
                            })
                        },
                        keys: function () {
                            var keys;
                            keys = Object.keys(thisObject);
                            keys.splice(keys.indexOf("valueOf"), 1);
                            keys.splice(keys.indexOf("keys"), 1);
                            return keys;
                        }
                    }
                    array[0].map(function (d) {
                        return d[on]
                    }).forEach(function (b) {
                        var value = OrdinalPositionHolder.valueOf();
                        OrdinalPositionHolder[b] = OrdinalPositionHolder > -1 ? ++value : 0;
                    })

                    SegData = OrdinalPositionHolder.keys().map(function () {
                        return [];
                    });

                    array.forEach(function (d) {
                        d.forEach(function (b) {
                            SegData[OrdinalPositionHolder[b[on]]].push(b);
                        })
                    });

                    return SegData;
                }

                var margin = {
                        top: 20,
                        right: 30,
                        bottom: 60,
                        left: 40
                    },
                    width = 960 - margin.left - margin.right,
                    height = 350 - margin.top - margin.bottom;

                var textWidthHolder = 0;
                /// Adding Date in LineCategory
                Data.forEach(function (d) {
                    d.LineCategory.forEach(function (b) {
                        b.hotelName = d.hotelName;
                    })
                });

                var Categories = new Array();
                // Extension method declaration

                Categories.pro;

                var Data;
                var ageNames;
                var x0 = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);
                var XLine = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);
                var x1 = d3.scale.ordinal();

                var y = d3.scale.linear()
                    .range([height, 0]);

                var YLine = d3.scale.linear().range([height, 0])
                    .domain([0, d3.max(Data, function (d) {
                        return d3.max(d.LineCategory, function (b) {
                            return b.Value
                        })
                    })]);

                var color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                var line = d3.svg.line().x(function (d) {
                    return x0(d.hotelName) + x0.rangeBand() / 2;
                }).y(function (d) {
                    return YLine(d.Value)
                });

                var xAxis = d3.svg.axis()
                    .scale(x0)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(d3.format(".2s"));

                var YLeftAxis = d3.svg.axis().scale(YLine).orient("right").tickFormat(d3.format(".2s"));

                var tip = d3tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d, i) {
                        return '<span class="tooltiptext">' + d.Value + '</span>';
                    });

                var svg = d3.select(elementId).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.call(tip);
                // Bar Data categories
                Data.forEach(function (d) {
                    d.Categories.forEach(function (b) {
                        if (Categories.findIndex(function (c) {
                                return c.Name === b.Name
                            }) == -1) {
                            b.Type = "bar";
                            Categories.push(b)
                        }
                    })
                });


                // Line Data categories
                Data.forEach(function (d) {
                    d.LineCategory.forEach(function (b) {
                        if (Categories.findIndex(function (c) {
                                return c.Name === b.Name
                            }) == -1) {
                            b.Type = "line";
                            console.log(JSON.stringify(b))
                            Categories.push(b)
                        }
                    })
                });

                // Processing Line data
                var lineData = DataSegregator(Data.map(function (d) {
                    return d.LineCategory
                }), "Name");

                // Line Coloring
                var LineColor = d3.scale.ordinal();
                LineColor.domain(Categories.filter(function (d) {
                    return d.Type == "line"
                }).map(function (d) {
                    return d.Name
                }));
                LineColor.range(["#d40606", "#06bf00", "#98bdc5", "#671919", "#0b172b"])
                x0.domain(Data.map(function (d) {
                    return d.hotelName;
                }));
                XLine.domain(Data.map(function (d) {
                    return d.hotelName;
                }));
                x1.domain(Categories.filter(function (d) {
                    return d.Type == "bar"
                }).map(function (d) {
                    return d.Name
                })).rangeRoundBands([0, x0.rangeBand()]);
                y.domain([0, d3.max(Data, function (d) {
                    return d3.max(d.Categories, function (d) {
                        return d.Value;
                    });
                })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + (width) + ",0)")
                    .call(YLeftAxis)

                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -15)

                .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Percent");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Revenue");


                var state = svg.selectAll(".state")
                    .data(Data)
                    .enter().append("g")
                    .attr("class", "state")
                    .attr("transform", function (d) {
                        return "translate(" + x0(d.hotelName) + ",0)";
                    });

                state.selectAll("rect")
                    .data(function (d) {
                        return d.Categories;
                    })
                    .enter().append("rect")
                    .attr("width", x1.rangeBand())
                    .attr("x", function (d) {
                        return x1(d.Name);
                    })
                    .attr("y", function (d) {
                        return y(d.Value);
                    })
                    //.attr("height", function (d) { return height - y(d.Value); })
                    .style("fill", function (d) {
                        return color(d.Name);
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .transition().delay(500).attrTween("height", function (d) {
                        var i = d3.interpolate(0, height - y(d.Value));
                        return function (t) {
                            return i(t);
                        }
                    });

                // drawaing lines
                svg.selectAll(".lines").data(lineData).enter().append("g").attr("class", "line")
                    .each(function (d) {
                        var Name = d[0].Name
                        d3.select(this).append("path").attr("d", function (b) {
                            return line(b)
                        }).style({
                            "stroke-width": "2px",
                            "fill": "none"
                        }).style("stroke", LineColor(Name)).transition().duration(1500);
                    })


                // Legends

                var LegendHolder = svg.append("g").attr("class", "legendHolder");
                var legend = LegendHolder.selectAll(".legend")
                    .data(Categories.map(function (d) {
                        return {
                            "Name": d.Name,
                            "Type": d.Type
                        }
                    }))
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(0," + (height + margin.bottom / 2) + ")";
                    })
                    .each(function (d, i) {
                        //  Legend Symbols


                        d3.select(this).append("rect")
                            .attr("width", function () {
                                return 18
                            })
                            .attr("x", function (b) {

                                var left = (i + 1) * 15 + i * 18 + i * 5 + textWidthHolder;
                                return left;
                            })
                            .attr("y", function (b) {
                                return b.Type == 'bar' ? 0 : 7
                            })
                            .attr("height", function (b) {
                                return b.Type == 'bar' ? 18 : 5
                            })
                            .style("fill", function (b) {
                                return b.Type == 'bar' ? color(d.Name) : LineColor(d.Name)
                            });

                        //  Legend Text

                        d3.select(this).append("text")
                            .attr("x", function (b) {

                                var left = (i + 1) * 15 + (i + 1) * 18 + (i + 1) * 5 + textWidthHolder;

                                return left;
                            })
                            .attr("y", 9)
                            .attr("dy", ".35em")
                            .style("text-anchor", "start")
                            .text(d.Name);

                        textWidthHolder += getTextWidth(d.Name, "10px", "calibri");
                    });


                // Legend Placing

                d3.select(".legendHolder").attr("transform", function (d) {
                    var thisWidth = d3.select(this).node().getBBox().width;
                    return "translate(" + ((width) / 2 - thisWidth / 2) + ",0)";
                })

            }


            /**
             * Pie chart core functionality
             * @function wheelChart
             * @param data, elementId 
             */
            $scope.pieChart = function (data, elementId) {
                var width = 960,
                    height = 350,
                    outerRadius = 400,   //radius
                    radius = Math.min(width, height) / 2;

                var color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                var arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

                var labelArc = d3.svg.arc()
                    .outerRadius(radius - 40)
                    .innerRadius(radius - 40);

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) {
                        return d.revenue;
                    });

                var tip = d3tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d, i) {
                        return '<span class="tooltiptext"><b>Hotel Name : </b>' + d.data.hotelName + '<br><b>Revenue : </b>' + d.data.revenue + '</span>';
                    });

                var svg = d3.select(elementId).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                
                svg.call(tip);

                var g = svg.selectAll(".arc")
                    .data(pie(data))
                    .enter().append("g")
                    .attr("class", "arc");

                g.append("path")
                    .attr("d", arc)
                    .style("fill", function (d) {
                        return color(d.data.hotelName);
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                g.append("text")
                    .attr("transform", function(d) { //set the label's origin to the center of the arc
                        //we have to make sure to set these before calling arc.centroid
                        d.outerRadius = outerRadius + 50; // Set Outer Coordinate
                        d.innerRadius = outerRadius + 45; // Set Inner Coordinate
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .attr("text-anchor", "middle") //center the text on it's origin
                    // .attr("transform", function (d) {
                    //     return "translate(" + labelArc.centroid(d) + ")";
                    // })
                    //.attr("dy", ".35em")
                    .text(function (d) {
                        return d.data.hotelName;
                    });

                function type(d) {
                    d.revenue = +d.revenue;
                    return d;
                }
            }

            /**
             * Render revenue table functionality
             * @function renderRevenueTableData
             * @param data 
             */
            $scope.renderRevenueTableData = function (data) {
                $scope.revenueHotelNames = _.map(data, 'hotelName');
                $scope.revenueHotelData = data;
            }

            /**
             * Render ADR Occupancy table functionality
             * @function renderAdrOccupancyTableData
             * @param data 
             */
            $scope.renderAdrOccupancyTableData = function (data) {
                $scope.adrOccupancyHotelNames = _.map(data, 'hotelName');
                $scope.adrOccupancyHotelData = data;
            }

            /**
             * Render Source of revenue table functionality
             * @function renderSourceRevenueTableData
             * @param data 
             */
            $scope.renderSourceRevenueTableData = function (data) {
                $scope.sourceRevenueHotelNames = ["Room Revenue", "F&B Revenue", "Other Revenue", "Total Revenue", "% Of Total Revenue"];
                $scope.sourceRevenueHotelData = data;
            }

            var revenueElementId = '#revenue-hotel-chart',
                adrOccupancyElementId = '#adr-occupancy-hotel-chart',
                sourceRevenueElementId = '#source-revenue-hotel-pie-chart';
                
            //Get Revenue Data
            $http.post(server.baseApiUrl + apis.getDashboardRevenueData, { "projectId" : 1, "projectYear" : 2016}).then(function (res) {
                $scope.revenueData = res.data.data;
                _.each( $scope.revenueData , function(val, key){
                    delete val.id;
                    val.LYA = val.LYA || 0;
                    val.YTDA = val.YTDA || 0;
                    val.BYTD = val.BYTD || 0;
                })
                $scope.groupBarChart(angular.copy($scope.revenueData), revenueElementId);
                $scope.renderRevenueTableData(angular.copy($scope.revenueData));
            });

            //Get occupancy Data
            $http.post(server.baseApiUrl + apis.getDashboardOccupanyData, { "projectId" : 1, "projectYear" : 2016}).then(function (res) {
                $scope.occupancyData = res.data.data;
                $scope.groupBarLineChart(angular.copy($scope.occupancyData), adrOccupancyElementId);
                $scope.renderAdrOccupancyTableData(angular.copy($scope.occupancyData));
            });

            //Get Source revenue Data
            $http.post(server.baseApiUrl + apis.getDashboardScopeRevData, { "projectId" : 1, "projectYear" : 2016}).then(function (res) {
                $scope.sourceRevData = res.data.data;
                $scope.pieChart(angular.copy($scope.sourceRevData), sourceRevenueElementId);
                $scope.renderSourceRevenueTableData(angular.copy($scope.sourceRevData));
            });
        }
        hotelGraphController.$inject = ['$scope', '$uibModal', '$log', '$http', 'server', 'apis', 'growl', '$localStorage', 'd3', 'd3tip'];
        angular.module('employeeApp').controller('app.hotelGraphController', hotelGraphController);

    }(app.hotelGraph || (app.hotelGraph = {})));
})(app || (app = {}));