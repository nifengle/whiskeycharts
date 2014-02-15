$(document).ready(function(){  
  distilleryGroup = new DistilleryGroup()
  initialize();
  
})

function initialize(){
  selectStyling();
  eventListener();
}


function eventListener(){
  $('button').click(function(e){
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

function hoverHighlight(){
  var len = $('h2').length
  $('h2').each(function(index, h2){
    $(h2).on('mouseover',function(){ 
      $('.radar-chart-serie'+index).css('fill-opacity', '0.8');
      
      for (var i=0; i<len;i++){
        if (i != index){
          $('.radar-chart-serie'+i).css('fill-opacity', '0');
        }
      }
    });

    $(h2).on('mouseout', function(){
      $('polygon').css('fill-opacity', '.3');
    });
  })

  $('polygon').each(function(index, polygon){
    var colorScale = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
    
    $(polygon).on('mouseover', function(){
      $($('h2')[index]).css('color', colorScale[index]);
    });

    $(polygon).on('mouseout', function(){
      $($('h2')[index]).css('color', 'inherit');
    });
  })
  
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

function appendSearchResult(name){
  $('#search-results').append("<h2 id='"+name+"'>"+name+"</h2>")
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
  for(var i=0;i<legendOptions.length;i++){
    appendSearchResult(legendOptions[i]);
  }
  RadarChart.draw("#svg", data);
  hoverHighlight();
}

AttributeChart.prototype.loadingData = function(){
  $('#loading').hide();
}


AttributeChart.prototype.clearChart = function(){
  $('#svg').empty();
  $('#search-results').empty();
  $('#loading').show();
}

function Distillery(name) {
  this.attributes = []
}

Distillery.prototype.formatData = function(data){
  for (key in data){
    this.attributes.push( { axis: key, value: data[key] } );
  }
}

function selectStyling(){
  $(".chzn-select").chosen({
    max_selected_options: 6,
    width: "15em",
    height: "2em"
  });
}


//BAR CHART//
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