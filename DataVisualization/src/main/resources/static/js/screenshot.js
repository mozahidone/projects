$(document).ready(function () {

    $("#search-form").submit(function (event) {

        //stop submit the form, we will post it manually.
        event.preventDefault();

        fire_ajax_submit();

    });

    $("#btnSave").click(function() {
        /*html2canvas($("#widget"), {
            onrendered: function(canvas) {
                theCanvas = canvas;
                document.body.appendChild(canvas);

                // Convert and download as image
                Canvas2Image.saveAsPNG(canvas);
                $("#img-out").append(canvas);
                // Clean up
                //document.body.removeChild(canvas);
            }
        });*/
        html2canvas($('#ca-chart').get(0)).then( function (canvas) {
            //console.log(canvas);
            //document.body.appendChild(canvas);
            var extra_canvas = document.createElement('canvas');
            extra_canvas.setAttribute('width', 224);
            extra_canvas.setAttribute('height', 115);
            extra_canvas.setAttribute('border', 1);
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, 224, 115);
            //e.appendChild(canvas);
            //e.appendChild(extra_canvas);
            document.body.appendChild(extra_canvas);
            var imageData = extra_canvas.toDataURL("image/png");
            console.log(imageData);
        });
    });

});

function fire_ajax_submit() {

    var search = {}
    search["username"] = $("#username").val();

    $("#btn-search").prop("disabled", true);

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/search",
        data: JSON.stringify(search),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {

            var json = "<h4>Ajax Response</h4><pre>"
                + JSON.stringify(data, null, 4) + "</pre>";
            $('#feedback').html(json);

            console.log("SUCCESS : ", data);
            $("#btn-search").prop("disabled", false);

        },
        error: function (e) {

            var json = "<h4>Ajax Response</h4><pre>"
                + e.responseText + "</pre>";
            $('#feedback').html(json);

            console.log("ERROR : ", e);
            $("#btn-search").prop("disabled", false);

        }
    });
}

function callRestApi () {
    d3.json("/test/PP2", function(data) {
        console.log(data);

        d3.select("body")
            .selectAll("p")
            .data(data)
            .enter()
            .append("p")
            .text(function(d) {
                return d.id + ", " + d.price;
            });

    });
}

function createBarChart() {
    var margin = {top: 20, right: 20, bottom: 70, left: 40},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;


// set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

// define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


// add the SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


// load the data /test/PP2
    //d3.json("/data/barChartData.json", function(error, data) {
    d3.json("/test/PP2", function(error, data) {

        data.forEach(function(d) {
            d.Letter = d.id;
            d.Freq = +d.price;
        });

        // scale the range of the data
        x.domain(data.map(function(d) { return d.Letter; }));
        y.domain([0, d3.max(data, function(d) { return d.Freq; })]);

        // add axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");


        // Add bar chart
        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Letter); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.Freq); })
            .attr("height", function(d) { return height - y(d.Freq); });

    });
}

function createCrossFilter() {

    function drawBubble (selector, dispatch, dimension, group) {
        var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 480 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        var onClick;

        var color = d3.scale.category20();

        var bubble = d3.layout.pack()
            .sort(null)
            .size([width, height])
            .padding(1.5);

        var t = d3.transition()
            .duration(750);

        var svg = d3.select(selector),
            g = svg.select('g');

        if (!svg.empty()) {
            svg.select('svg').remove()
        }

        g = svg.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'bubble')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        var reset = g.append('text')
            .attr('class', 'reset')
            .style('display', 'none')
            .attr('y', 10)
            .attr('x', 20)
            .text('reset')
            .on('click', click)

        function click(d) {

            dimension.filter(d ? d.key : null);
            dispatch.redraw();

            svg.selectAll('circle').classed('active', false)
            if(!d) {
                return reset.style('display', 'none');
            }


            svg.select('.' + btoa(d.key).replace(/=/g, '')).classed('active', true)
            reset.style('display', 'block')
        }

        var node = g.selectAll('.node')
            .data(bubble.nodes({ children: group.all() }).filter(function(d) { return !d.children; }))

        node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });

        node.append('title')
            .text(function(d) { return d.key; });

        node.append('circle')
            .attr('class', function (d) { return btoa(d.key).replace(/=/g, '')})
            .attr('r', function(d) { return d.r; })
            .style('fill', function(d) { return color(d.key); })

        node.append('text')
            .attr('dy', '.3em')
            .attr('class', 'label')
            .style('text-anchor', 'middle')

        dispatch.on('redraw.' + selector, function () {
            var reset = g.selectAll('.reset')

            node = g.selectAll('.node')
                .data(bubble.nodes({ children: group.all() }).filter(function(d) { return !d.children; }))

            node
                .attr('class', 'node')
                .transition(t)
                .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });

            node.select('circle')
                .on('click', click)
                .transition(t)
                .attr('r', function(d) { return d.r; })
                .style('fill', function(d) { return color(d.key); })

            node.select('text')
                .attr('dy', '.3em')
                .style('text-anchor', 'middle')
                .text(function(d) { return d.key.substring(0, d.r / 3); })
                .on('click', click)

        })
    }

    function drawTornado (selector, dispatch, dimension, group, height) {
        var margin = {top: 20, right: 30, bottom: 40, left: 100},
            width = 475 - margin.left - margin.right,
            height = (height || 250) - margin.top - margin.bottom;
        var t = d3.transition()
            .duration(750);
        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], 0.1);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(7)

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(0)

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var reset = svg.append('text')
            .attr('class', 'reset')
            .style('display', 'none')
            .attr('y', 0)
            .attr('x', 20)
            .text('reset')
            .on('click', click)

        function click(d) {
            dimension.filter(d ? d.key : null);
            dispatch.redraw();
            svg.selectAll('rect').classed('active', false)
            if(!d) {
                return reset.style('display', 'none');
            }
            svg.selectAll('.' + btoa(d.key).replace(/=/g, '')).classed('active', true)
            reset.style('display', 'block')
        }

        dispatch.on('redraw.' + selector, function () {
            var data = group.all()
            var arr = []
            data.forEach(function(d) {
                arr.push(d.value.negative)
                arr.push(d.value.positive)
            })
            var domain = [d3.min(arr), d3.max(arr)]
            x.domain(domain).nice();
            y.domain(data.map(function(d) { return d.key; }));

            var minInteractions = Math.min.apply(Math, data.map(function(o){ if(o.value) return o.value.negative;}))
            yAxis.tickPadding(Math.abs(x(minInteractions) - x(0)) + 10);

            var bar = svg.selectAll(".bar")
                .data(data)

            var gEnter = bar.enter()

            var barPositive = svg.selectAll('.bar--positive')
            if (barPositive.empty()) {
                barPositive = gEnter.append("rect")
                    .attr("class", function (d) { return btoa(d.key).replace(/=/g, '') + ' bar bar--positive' })
            }
            barPositive
                .transition(t)
                .attr("x", function(d) { return x(Math.min(0, d.value.positive)); })
                .attr("y", function(d) { return y(d.key); })
                .attr("width", function(d) { return Math.abs(x(d.value.positive) - x(0)); })
                .attr("height", y.rangeBand())

            var barNegative = svg.selectAll('.bar--negative')
            if (barNegative.empty()) {
                barNegative = gEnter.append("rect")
                    .attr("class", function (d) { return btoa(d.key).replace(/=/g, '') + ' bar bar--negative' })
            }
            barNegative
                .transition(t)
                .attr("x", function(d) { return x(Math.min(0, d.value.negative)); })
                .attr("y", function(d) { return y(d.key); })
                .attr("width", function(d) { return Math.abs(x(d.value.negative) - x(0)); })
                .attr("height", y.rangeBand())

            svg.selectAll('.bar').on('click', click)

            var textPositive = svg.selectAll('text.positive')
            if (textPositive.empty()) {
                textPositive = gEnter.append('text')
                    .attr('class', 'positive')
                    .attr("text-anchor", "middle")
                    .attr("dy", ".35em")
            }
            textPositive
                .transition(t)
                .attr("x", function(d,i) {
                    return x(Math.min(0, d.value.positive)) + (Math.abs(x(d.value.positive) - x(0)) / 2);
                })
                .attr("y", function(d,i) {
                    return y(d.key) + (y.rangeBand() / 2);
                })
                .text(function (d) { return d.value.positive || ''; })

            var textNegative = svg.selectAll('text.negative')
            if (textNegative.empty()) {
                textNegative = gEnter.append('text')
                    .attr('class', 'negative')
                    .attr("text-anchor", "middle")
                    .attr("dy", ".35em")
            }
            textNegative
                .transition(t)
                .attr("x", function(d,i) {
                    return x(Math.min(0, d.value.negative)) + (Math.abs(x(d.value.negative) - x(0)) / 2);
                })
                .attr("y", function(d,i) {
                    return y(d.key) + (y.rangeBand() / 2);
                })
                .text(function (d) { return -d.value.negative || ''; })

            svg.selectAll('text').on('click', click)
            // var title = svg.selectAll('.title')
            //   .data([data.reduce(function(a,b) { return b.key })])
            //
            // title.enter().append('text')
            //     .attr('class', 'title')
            //     .attr('x', function (d, i) { return width/2; })
            //     .attr("text-anchor", "middle")
            //     .text(function (d) { return d; })

            var xAxisDom = svg.selectAll('.x.axis')
            if (xAxisDom.empty()) {
                xAxisDom = svg.append("g")
                    .attr("class", "x axis")
            }
            xAxisDom
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            xAxisDom
                .selectAll('.tick text')
                .text(function (d) { if (d < 0) return -d; else return d; })

            var yAxisDom = svg.selectAll('.y.axis')
            if (yAxisDom.empty()) {
                yAxisDom = svg.append("g")
                    .attr("class", "y axis")
            }
            yAxisDom
                .transition(t)
                .attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);
        });
    }

    function drawBar (selector, dispatch, dimension, group) {
        var margin = {top: 0, right: 0, bottom: 40, left: 50},
            width = 475 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(10);

        var t = d3.transition()
            .duration(750);

        var svg = d3.select(selector),
            g = svg.select('g');

        function click(d) {
            dimension.filter(d ? d.key : null);
            dispatch.redraw();
            svg.selectAll('rect').classed('active', false)
            if(!d) {
                return reset.style('display', 'none');
            }

            svg.select('.' + btoa(d.key).replace(/=/g, '')).classed('active', true)
            reset.style('display', 'block')
        }

        if (g.empty()) {
            g = svg.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            g.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            g.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Interactions');

            var reset = g.append('text')
                .attr('class', 'reset')
                .attr('y', 10)
                .attr('x', -40)
                .style('display', 'none')
                .text('reset')
                .on('click', click)
        }

        dispatch.on('redraw.' + selector, function () {
            x.domain(group.all().map(function(d) { return d.key; }));
            y.domain([0, d3.max(group.all(), function(d) { return d.value; })]);

            g.select('.y.axis')
                .transition(t)
                .call(yAxis)

            var xAxisDom = g.select('.x.axis')
                .transition(t)
                .call(xAxis)

            var rects = g.selectAll('rect')
                .data(group.all());

            rects.enter().append('rect')
                .on('click', click)
                .attr('class', function (d) { return btoa(d.key).replace(/=/g, '') })

            rects
                .classed('bar', true)
                .classed('bar--negative', function (d) { return d.key == 'female'})
                .classed('bar--positive', function (d) { return d.key == 'male'})
                .transition(t)
                // .attr('class', function(d) { return 'bar bar--' + (d.key == 'female' ? 'negative' : 'positive'); })
                .attr('x', function(d) { return x(d.key); })
                .attr('width', x.rangeBand())
                .attr('y', function(d) { return y(d.value); })
                .attr('height', function(d) { return height - y(d.value); })

            var texts = g.selectAll('.label')
                .data(group.all())

            texts.enter().append('text').attr('class', 'label').on('click', click)

            texts
                .transition(t)
                .attr('text-anchor', 'middle')
                .attr('x', function(d,i) {
                    return x(d.key) + (x.rangeBand() / 2);
                })
                .attr('y', function(d,i) {
                    return y(d.value) + ((height - y(d.value)) / 2);
                })
                .attr('dy', '.35em')
                .text(function (d) { return d.value })

        })
    }

    var xf = crossfilter(data)

    var gender = xf.dimension(function (d) { return d.gender; }),
        genders = gender.group().reduceSum(function (d) { return d.positiveInteractions; }),
        topic = xf.dimension(function (d) { return d.topic }),
        topics = topic.group().reduceSum(function (d) { return d.positiveInteractions; }),
        age = xf.dimension(function (d) { return d.age; }),
        ages = age.group().reduce(
            function (p, v) {
                if (v.gender == 'female')
                    p.negative += v.interactions;
                else if (v.gender == 'male')
                    p.positive += v.interactions;
                return p;
            },
            function (p, v) {
                if (v.gender == 'female')
                    p.negative -= v.interactions;
                else if (v.gender == 'male')
                    p.positive -= v.interactions;
                return p;
            },
            function () {
                return { positive: 0, negative: 0 }
            }
        ),
        newTopic = xf.dimension(function (d) { return d.topic }),
        topicGroup = newTopic.group().reduce(
            function (p, v) {
                if (v.gender == 'female')
                    p.negative += v.interactions;
                else if (v.gender == 'male')
                    p.positive += v.interactions;
                return p;
            },
            function (p, v) {
                if (v.gender == 'female')
                    p.negative -= v.interactions;
                else if (v.gender == 'male')
                    p.positive -= v.interactions;
                return p;
            },
            function () {
                return { positive: 0, negative: 0 }
            }
        );

    var dispatch = d3.dispatch('redraw');
    drawTornado('#tornado-chart', dispatch, newTopic, topicGroup);
    drawTornado('#tornado-chart2', dispatch, age, ages)
    drawBar('#bar-chart', dispatch, gender, genders);
    drawBubble('#bubble-chart', dispatch, topic, topics);
    dispatch.redraw();

    d3.select(self.frameElement).style("height", "738px");
}

function canadaCrime() {

    var numberFormat = d3.format(".2f");

    var caChart = dc.bubbleOverlay("#ca-chart")
        .svg(d3.select("#ca-chart svg"));

    var incidentChart = dc.barChart("#incident-chart");

    var homicideChart = dc.lineChart("#homicide-chart");

    function isTotalCrimeRateRecord(v) {
        return v.type == "Total, all violations" && v.sub_type == "Rate per 100,000 population";
    }

    function isTotalCrimeIncidentRecord(v) {
        return v.type == "Total, all violations" && v.sub_type == "Actual incidents";
    }

    function isViolentCrimeRateRecord(v) {
        return v.type == "Total violent Criminal Code violations" && v.sub_type == "Rate per 100,000 population";
    }

    function isViolentCrimeIncidentRecord(v) {
        return v.type == "Total violent Criminal Code violations" && v.sub_type == "Actual incidents";
    }

    function isHomicideRateRecord(v) {
        return v.type == "Homicide" && v.sub_type == "Rate per 100,000 population";
    }

    function isHomicideIncidentRecord(v) {
        return v.type == "Homicide" && v.sub_type == "Actual incidents";
    }

    d3.csv("/data/crime.csv", function(csv) {
        var data = crossfilter(csv);

        var cities = data.dimension(function(d) {
            return d.city;
        });
        var totalCrimeRateByCity = cities.group().reduce(
            function(p, v) {
                if (isTotalCrimeRateRecord(v)) {
                    p.totalCrimeRecords++;
                    p.totalCrimeRate += +v.number;
                    p.avgTotalCrimeRate = p.totalCrimeRate / p.totalCrimeRecords;
                }
                if (isViolentCrimeRateRecord(v)) {
                    p.violentCrimeRecords++;
                    p.violentCrimeRate += +v.number;
                    p.avgViolentCrimeRate = p.violentCrimeRate / p.violentCrimeRecords;
                }
                p.violentCrimeRatio = p.avgViolentCrimeRate / p.avgTotalCrimeRate * 100;
                return p;
            },
            function(p, v) {
                if (isTotalCrimeRateRecord(v)) {
                    p.totalCrimeRecords--;
                    p.totalCrimeRate -= +v.number;
                    p.avgTotalCrimeRate = p.totalCrimeRate / p.totalCrimeRecords;
                }
                if (isViolentCrimeRateRecord(v)) {
                    p.violentCrimeRecords--;
                    p.violentCrimeRate -= +v.number;
                    p.avgViolentCrimeRate = p.violentCrimeRate / p.violentCrimeRecords;
                }
                p.violentCrimeRatio = p.avgViolentCrimeRate / p.avgTotalCrimeRate * 100;
                return p;
            },
            function() {
                return {
                    totalCrimeRecords:0,totalCrimeRate:0,avgTotalCrimeRate:0,
                    violentCrimeRecords:0,violentCrimeRate:0,avgViolentCrimeRate:0,
                    violentCrimeRatio:0
                };
            }
        );

        var years = data.dimension(function(d) {
            return d.year;
        });
        var crimeIncidentByYear = years.group().reduce(
            function(p, v) {
                if (isTotalCrimeRateRecord(v)) {
                    p.totalCrimeRecords++;
                    p.totalCrime += +v.number;
                    p.totalCrimeAvg = p.totalCrime / p.totalCrimeRecords;
                }
                if (isViolentCrimeRateRecord(v)) {
                    p.violentCrimeRecords++;
                    p.violentCrime += +v.number;
                    p.violentCrimeAvg = p.violentCrime / p.violentCrimeRecords;
                }
                if(isHomicideIncidentRecord(v)){
                    p.homicide += +v.number;
                }
                p.nonViolentCrimeAvg = p.totalCrimeAvg - p.violentCrimeAvg;
                return p;
            },
            function(p, v) {
                if (isTotalCrimeRateRecord(v)) {
                    p.totalCrimeRecords--;
                    p.totalCrime -= +v.number;
                    p.totalCrimeAvg = p.totalCrime / p.totalCrimeRecords;
                }
                if (isViolentCrimeRateRecord(v)) {
                    p.violentCrimeRecords--;
                    p.violentCrime -= +v.number;
                    p.violentCrimeAvg = p.violentCrime / p.violentCrimeRecords;
                }
                if(isHomicideIncidentRecord(v)){
                    p.homicide -= +v.number;
                }
                p.nonViolentCrimeAvg = p.totalCrimeAvg - p.violentCrimeAvg;
                return p;
            },
            function() {
                return {
                    totalCrimeRecords:0,
                    totalCrime:0,
                    totalCrimeAvg:0,
                    violentCrimeRecords:0,
                    violentCrime:0,
                    violentCrimeAvg:0,
                    homicide:0,
                    nonViolentCrimeAvg:0
                };
            }
        );

        caChart.width(600)
            .height(450)
            .dimension(cities)
            .group(totalCrimeRateByCity)
            .radiusValueAccessor(function(p) {
                return p.value.avgTotalCrimeRate;
            })
            .r(d3.scale.linear().domain([0, 200000]))
            .colors(["#ff7373","#ff4040","#ff0000","#bf3030","#a60000"])
            //.colors(["#ff9aa3","#ff5f6d","#ff3849","#ae000f","#5f0008"])
            .colorDomain([13, 30])
            .colorAccessor(function(p) {
                return p.value.violentCrimeRatio;
            })
            .title(function(d) {
                return "City: " + d.key
                    + "\nTotal crime per 100k population: " + numberFormat(d.value.avgTotalCrimeRate)
                    + "\nViolent crime per 100k population: " + numberFormat(d.value.avgViolentCrimeRate)
                    + "\nViolent/Total crime ratio: " + numberFormat(d.value.violentCrimeRatio) + "%";
            })
            .point("Toronto", 364, 400)
            .point("Ottawa", 395.5, 383)
            .point("Vancouver", 40.5, 316)
            .point("Montreal", 417, 370)
            .point("Edmonton", 120, 299)
            .point("Saskatoon", 163, 322)
            .point("Winnipeg", 229, 345)
            .point("Calgary", 119, 329)
            .point("Quebec", 431, 351)
            .point("Halifax", 496, 367)
            .point("St. John's", 553, 323)
            .point("Yukon", 44, 176)
            .point("Northwest Territories", 125, 195)
            .point("Nunavut", 273, 188)
            .debug(false);

        incidentChart
            .width(360)
            .height(180)
            .margins({top: 40, right: 50, bottom: 30, left: 60})
            .dimension(years)
            .group(crimeIncidentByYear, "Non-Violent Crime")
            .valueAccessor(function(d) {
                return d.value.nonViolentCrimeAvg;
            })
            .stack(crimeIncidentByYear, "Violent Crime", function(d){return d.value.violentCrimeAvg;})
            .x(d3.scale.linear().domain([1997, 2012]))
            .renderHorizontalGridLines(true)
            .centerBar(true)
            .elasticY(true)
            .brushOn(false)
            .legend(dc.legend().x(250).y(10))
            .title(function(d){
                return d.key
                    + "\nViolent crime per 100k population: " + Math.round(d.value.violentCrimeAvg)
                    + "\nNon-Violent crime per 100k population: " + Math.round(d.value.nonViolentCrimeAvg);
            })
            .xAxis().ticks(10).tickFormat(d3.format("d"));

        homicideChart
            .width(360)
            .height(150)
            .margins({top: 10, right: 50, bottom: 30, left: 60})
            .dimension(years)
            .group(crimeIncidentByYear)
            .valueAccessor(function(d) {
                return d.value.homicide;
            })
            .x(d3.scale.linear().domain([1997, 2012]))
            .renderHorizontalGridLines(true)
            .elasticY(true)
            .brushOn(true)
            .title(function(d){
                return d.key
                    + "\nHomicide incidents: " + Math.round(d.value.homicide);
            })
            .xAxis().ticks(10).tickFormat(d3.format("d"));

        dc.renderAll();
    });
}

(function (exports) {
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype
            || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

    function screenshotPage() {
        urlsToAbsolute(document.images);
        urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        var screenshot = document.documentElement.cloneNode(true);
        var b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        var head = screenshot.querySelector('head');
        head.insertBefore(b, head.firstChild);
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'hidden';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';
        screenshot.dataset.scrollX = window.scrollX;
        screenshot.dataset.scrollY = window.scrollY;
        var script = document.createElement('script');
        script.textContent = '(' + addOnPageLoad_.toString() + ')();';
        screenshot.querySelector('body').appendChild(script);
        var blob = new Blob([screenshot.outerHTML], {
            type: 'text/html'
        });
        return blob;
    }

    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    function generate() {
        window.URL = window.URL || window.webkitURL;
        window.open(window.URL.createObjectURL(screenshotPage()));
    }
    exports.screenshotPage = screenshotPage;
    exports.generate = generate;
})(window);