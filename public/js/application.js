$(document).ready(function(){  
  distilleryGroup = new DistilleryGroup()
  initialize();
  
})

function initialize(){
  selectStyling();
  eventListener();
}


function eventListener(){
  $('form').on("submit", function(e){
    attributeChart = new AttributeChart;
    attributeChart.clearChart();
    e.preventDefault();
    getFormOptions();
  })
}

function getFormOptions(){
  distilleryGroup.chartGroup = []
  for(var i=0;i<$('.search-choice').length; i++){
    var name = $('.search-choice')[i].firstChild.innerHTML;
    if (!distilleryGroup.distilleries[name]){
      var newDistillery = new Distillery();
      distilleryGroup.distilleries[name] = newDistillery;
    }
    distilleryGroup.chartGroup[name] = distilleryGroup.distilleries[name]
  };
  distilleryGroup.fetchData();
}

function DistilleryGroup(){
  this.distilleries = []
}

DistilleryGroup.prototype.fetchData = function(){
  var distilleries = this.chartGroup
  var needDataOn = []
  
  for (name in distilleries){
    if (distilleries[name].attributes.length == 0){
      needDataOn.push(name);
    }
  };
  
  console.log(needDataOn)
  if (needDataOn.length > 0){
    $.get('/attributes', {distilleries: needDataOn}, function(data){
      attributeChart.loadingData();
      distilleryGroup.buildGroupData(data);
    });
  }
  else
  {
    attributeChart.loadingData();
    distilleryGroup.buildGroupData(data);
  }
}

DistilleryGroup.prototype.buildGroupData = function(data){
  for (name in this.chartGroup){
    this.chartGroup[name].formatData(data[name]);
  }
  attributeChart.drawChart();
}

function AttributeChart(){
}

AttributeChart.prototype.drawChart = function(){
  data = []
  legendOptions = []
  distilleries = distilleryGroup.chartGroup
  for (name in distilleries){
    legendOptions.push(name)
    data.push(distilleryGroup.chartGroup[name].attributes);
  }
  RadarChart.draw("#svg", data);
}

AttributeChart.prototype.loadingData = function(){
  $('#loading').hide();
}


AttributeChart.prototype.clearChart = function(){
  $('#svg').empty()
  $('#loading').show()
}

function Distillery(name) {
  this.attributes = []
}

Distillery.prototype.formatData = function(data){
  for (key in data){
    this.attributes.push( { axis: key, value: data[key] } );
  }
}


function chart(data){

  var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 4]);
  
  
  for (key in data){
    d3.select(".chart")
    .append("div")
      .style("width", function() { return (data[key]*7) + "em"; })
      .text(function() { return key + ':   '+ data[key]; });
  }
}

function selectStyling(){
  $(".chosen-select").chosen({
    max_selected_options: 6,
    width: "15em",
    height: "2em",
  });
}

// function dataCircles(data){
//   var svg = d3.select("svg")
//   var data = data.distillery

//   for(var i=0;i<data.length;i++){
//     svg.append("circle")
//       .style("fill", "steelblue")
//       .attr("r", data[i].score*10)
//       .attr("cy", 100)
//       .attr("cx", (i * 85)+30)
//       .append("text").attr("text", data[i].name)
//   }
// }