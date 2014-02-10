$(document).ready(function(){  
  $('select').on("change", function(e){
    e.preventDefault();
    var attr = $('select').val();

    $.get( '/attributes/'+attr, {attribute: attr})
    .done(function(data) {
        $('.chart').children().remove()
        chart(data);
    });
  })
})


function chart(data){
  var data = data.distillery
  var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 4]);
  

  
  for (key in data){
    d3.select(".chart")
    // .append("p").text(key)
    .append("div")
      .style("width", function(d) { return (data[key]*7)+5.6 + "em"; })
      .text(function(d) { return key + ':   '+ data[key]; });
  }
}

function dataCircles(data){
  var svg = d3.select("svg")
  var data = data.distillery

  for(var i=0;i<data.length;i++){
    svg.append("circle")
      .style("fill", "steelblue")
      .attr("r", data[i].score*10)
      .attr("cy", 100)
      .attr("cx", (i * 85)+30)
      .append("text").attr("text", data[i].name)
  }
}



