function makePie(){
    // From: http://bl.ocks.org/mbostock/3887235
    // Set the dimensions
    var width  = 960,
      height = 500,
      radius = Math.min(width, height) / 2;
    
    var totals = {};
    var color  = d3.scale.category20b();  
      
    // This is the circle that the pie will fill in
    var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    // D3 provides a helper function for creating the pie and slices
    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return totals[d]; });
      
        // Add an SVG element to the page and append a G element for the pie
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Get the data and draw the slices
  $.getJSON('/residential/data', function(data) {
    totals = data.totals;
    // enter is how we tell D3 to generate the SVG elements for the data
    var g = svg.selectAll(".arc")
        .data(pie(d3.keys(totals)))
      .enter().append("g")
        .attr("class", "arc")
        .on("mouseover",function(d){
          d3.select(this).select("text").style("font-weight", "bold")
          d3.select(this).select("text").style("font-size", "1.25em")
        })
        .on("mouseout",function(d){
          d3.select(this).select("text").style("font-weight", "normal")
          d3.select(this).select("text").style("font-size", "1em")
        });;
        
     // color the pie slices using the color pallet
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data); });

    // add the jurisdiction name
   // put the labels outside the pie (in a new arc/circle)
    var pos = d3.svg.arc().innerRadius(radius + 20).outerRadius(radius + 20);
    g.append("text")
    .attr("transform", function(d) {
      return "translate(" + pos.centroid(d) + ")";
    })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data; });  
  });
}


function makeBar(){
    var margin = {top: 20, right: 20, bottom: 50, left: 50},
      width  = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      // data -> value
  var xValue = function(d) { return d.zipcode; },
      // value -> display
      xScale = d3.scale.ordinal().rangeRoundBands([0, width],
         .1),
      // data -> display
      xMap   = function(d) { return xScale(xValue(d)); },
      xAxis  = d3.svg.axis().scale(xScale).orient("bottom");

    // data -> value
  var yValue = function(d) { return d.median_value; },
      // value -> display
      yScale = d3.scale.linear().range([height, 0]),
      // data -> display
      yMap   = function(d) { return yScale(yValue(d)); },
      yAxis  = d3.svg.axis().scale(yScale).orient("left");

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  $.getJSON('/residential/bar_data', function(data) {
    data = data.bar_data;
    xScale.domain(data.map(xValue));
    yScale.domain([0, d3.max(data, yValue)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .attr("x", 8)
        .attr("y", -5)
        .style("text-anchor", "start")
        .attr("transform", "rotate(90)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Median Value");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
       .style("fill", "blue")
        .attr("x", xMap)
        .attr("width", xScale.rangeBand)
        .attr("y", yMap)
        .attr("height", function(d) { return height - yMap(d); });
  }); 
}
