$(document).ready(function(){  
  distilleryGroup = new DistilleryGroup;
  attributeChart = new AttributeChart;
  initialize();
})

function initialize(){
  selectStyling();
  eventListener();
}


function eventListener(){
  $('form').on("submit", function(e){
    e.preventDefault();
    $('#loading').show()
    getFormOptions();
  })
}

function getFormOptions(){
  for(var i=0;i<$('.search-choice').length; i++){
    var name = $('.search-choice')[i].firstChild.innerHTML;
    var newDistillery = new Distillery(name)
    newDistillery.fetchData(name);
  };
}

function selectStyling(){
  $(".chosen-select").chosen({
    max_selected_options: 3,
    width: "15em",
  });
}

function DistilleryGroup(){
  this.keys = [];
}

function AttributeChart(){
}

AttributeChart.prototype.drawChart = function(){
  data = []
  legendOptions = []
  distilleries = distilleryGroup.keys
  for (var i=0; i<distilleries.length ;i++){
    legendOptions.push(distilleries[i])
    data.push(distilleryGroup[distilleries[i]].data);
  }
  RadarChart.draw(".chart", data);
}


function Distillery(name) {
  this.name = name;
}


Distillery.prototype.fetchData = function(name){
  var thisDistillery = this;

  $.get( '/attributes', {distillery: name})
  .done(function(data) {
    $('#loading').hide();
    thisDistillery.formatData(data.distillery);
    distilleryGroup[name] = thisDistillery;
    distilleryGroup.keys.push(name);
    attributeChart.drawChart();
  })
  .fail(function(response){
    alert(response);
  }); 

  
}

Distillery.prototype.formatData = function(data){
  var formattedData = []
  for (key in data){
    formattedData.push({axis: key, value: data[key]});
  }
  this.data = formattedData
}




// function chart(data){
//   var data = data.distillery
//   var x = d3.scale.linear()
//     .domain([0, d3.max(data)])
//     .range([0, 4]);
  

  
//   for (key in data){
//     d3.select(".chart")
//     .append("div")
//       .style("width", function(d) { return (data[key]*7)+5.6 + "em"; })
//       .text(function(d) { return key + ':   '+ data[key]; });
//   }
// }

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