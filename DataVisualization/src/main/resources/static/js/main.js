$(document).ready(function () {

    $("#search-form").submit(function (event) {

        //stop submit the form, we will post it manually.
        event.preventDefault();

        fire_ajax_submit();

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


// load the data
    d3.json("/data/barChartData.json", function(error, data) {

        data.forEach(function(d) {
            d.Letter = d.Letter;
            d.Freq = +d.Freq;
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