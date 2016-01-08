
angular.module('junk1App').directive('graphChart', ['$window','chartService',

  function ($window, chartService) {

    var link = function ($scope, $el, $attrs) {
      var links = [
        {source: "activity", target: "webapi"},
        {source: "activity", target: "proxy"},
        {source: "identity", target: "restore"},
        {source: "tenant", target: "restore"},
        {source: "proxy", target: "restore"},
        {source: "restore", target: "proxy"},
        {source: "restore", target: "tenant"},
        {source: "activity", target: "tenant"},
        {source: "tenant", target: "activity"},
        {source: "webapi", target: "activity"},
        {source: "restore", target: "identity"},
        {source: "webapi", target: "identity"}
      ];

      console.log('inside the directive, processes are ', $scope.processes);

      function line_colors(n) {
        var line_colors= ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
        return line_colors[n % line_colors.length];
      };

      function get_color(n) {
        var colorMap = {
          "activity": 0,
          "webapi": 1,
          "proxy": 2,
          "identity": 3,
          "restore": 4,
          "tenant": 5
        };
        console.log('get the color yo!');
        if (n && n.name){
          return colorMap[n.name];
        } else {
          return colorMap[n];
        }
      };

      var nodes = {};

// Compute the distinct nodes from the links.
      links.forEach(function(link, i) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
      });

      var width = 560,
        height = 500;

      var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(150)
        .charge(-300)
        .on("tick", tick)
        .start();



      var svg = d3.select($el[0]).append("svg")
        .attr("width", width)
        .attr("height", height);



      // build the arrow.
      svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 1)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

      var link = svg.selectAll(".link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", function (d) {
        console.log('stroke is d is', d);
        var color = get_color(d.source);
          return line_colors(color);
        })
        .attr("marker-end", "url(#end)");

      var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .style("fill", function (d) {
          console.log('d is', d);
          var color = get_color(d.name);
          return line_colors(color);
        })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function(d){
          chartService.serviceData(d.name)
            .then(function(){
              console.log('click d is', d);
              $scope.boom = d;
            });
        })
        .call(force.drag);

      node.append("circle")
        .attr("r", 12)
        .attr("title", function(v) { return 'boom bomo pow' });

      node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) {
          var port ='';
          $scope.processes.forEach(function(val){
            if(val.name === d.name) {
              port = val.info;
            }
          })
          return d.name +':' + port;
        });

      function tick() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      }

       //tooltips and stuff
      // Define the div for the tooltip
      var div = d3.select($el[0]).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      function mouseover(d) {
        var port = '';
        var name = '';
        var status = '';
        var pid = '';
        $scope.processes.forEach(function(val){
          if(val.name === d.name) {
            port = val.info;
            name = val.name;
            status = val.status || 'inactive';
            pid = val._id;
          }
        })
        d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", 16);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div	.html("name: " + name + "</br>" + "port: " + port + "<br/>" + "status: " + status + "</br>" + "_id: " + pid)
          .style("left", (d3.event.pageX  - 80) + "px")
          .style("top", (d3.event.pageY - 100) + "px");

      }

      function mouseout() {
        d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", 12);

        div.transition()
          .duration(500)
          .style("opacity", 0);
      }
    };
    return {
      template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
      replace: true,
      link: link,
      scope: {processes: '=', boom: '='},
      restrict: 'E'
    };
  }]);

angular.module('junk1App').directive('serviceChart', ['$window',

  function ($window) {

    var link = function ($scope, $el, $attrs) {

      function line_colors(n) {
        var line_colors= ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
        return line_colors[n % line_colors.length];
      };

      function get_color(n) {
        var colorMap = {
          "activity": 0,
          "webapi": 1,
          "proxy": 2,
          "identity": 3,
          "restore": 4,
          "tenant": 5
        };
        console.log('get the color yo!');
        if (n && n.name){
          return colorMap[n.name];
        } else {
          return colorMap[n];
        }
      };


      var draw = function(dataset) {

        var bogus = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

        //Create SVG element

        var bar = svg.selectAll(".bar").data(bogus, function(d){
          return d;
        });
        bar.exit()
          .transition()
          .duration(300)
          .attr("y", y(0))
          .attr("height", height - y(0))
          .style('fill-opacity', 1e-6)
          .remove();
        console.log('stuff has been removed..kinda');

        svg.selectAll(".bar")
          .data(dataset, function(d, i) {
            return d;
          })
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d, i) {
            return i * (width / dataset.length);
          })
          .attr("y", function(d) {
            return height - (d * 4);
          })
          .attr("width", width / dataset.length - barPadding)
          .attr("height", function(d) {
            console.log('height is ', d);
            return d * 4;
          })
          .attr("fill", function(d) {
            var color = get_color($scope.boom.name);
            return line_colors(color);
          });

        svg.selectAll("text").data(bogus, function(d) { return d })
          .exit()
          .remove();

        svg.selectAll("text")
          .data(dataset)
          .enter()
          .append("text")
          .text(function(d) {
            return d;
          })
          .attr("text-anchor", "middle")
          .attr("x", function(d, i) {
            return i * (width / dataset.length) + (width / dataset.length - barPadding) / 2;
          })
          .attr("y", function(d) {
            return height - (d * 4) + 14;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "white");

        svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text(function(){
            var title = '';
            $scope.processes.forEach(function(val){
              if (val.name === $scope.boom.name) {
                title = val.name + ":" + val.info;
              }
            })
            return title;
          });
      };

      var update = function() {

        var baseset = [ 18, 14, 10, 9, 11, 25, 12 , 19, 12, 13,
          15, 10, 17, 20, 21, 16, 36, 8, 23, 28];
        var data = [];

          baseset.forEach(function(val, i) {
            console.log('index is ', $scope.boom.index);
            data[i] =  val + $scope.boom.index;
            //data[i] = val;
          });
        console.log('dataset is now', data);
        draw(baseset);
      };

      var dataset = [ 5, 14, 10, 9, 1, 25, 2, 18, 15, 13,
        15, 10, 5, 20, 18, 13, 36, 8, 3, 28];

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 560 - margin.left - margin.right,
        barPadding = 1,
        height = 500 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

      var svg = d3.select($el[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      draw(dataset);


      function resize() {
        svg.attr("width", $el[0].clientWidth);
        svg.attr("height", $el[0].clientWidth); //It's a square
      }

      $scope.$on('windowResize',resize);
      $scope.$watch('boom', update);
    };
    return {
      template: '<div></div>',
      replace: true,
      restrict: 'E',
      link: link,
      scope: {boom: '=', processes: '='}

    };
  }]);

