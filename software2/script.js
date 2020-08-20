 $(document).ready(function(){

 	$('#submitFile').on("click",function(e){
 		$("#searchBox").css({"display":"block"});
		e.preventDefault();
		$('#files').parse({
			config: {
				dynamicTyping: true,
				skipEmptyLines: true,
				delimeter:"[, %]",
				trimEmptyTrailingLines:true,
				complete: displayHTMLTable,
			}
		});//parse function end
  });// submit file click end

function showToolTip(ele,d,x,y) {
    var toolTip = document.querySelector('.toolTip');
    toolTip.textContent = d["value"];
    toolTip.style.display = 'block';
    toolTip.style.left = x + 10 + 'px';
    toolTip.style.top = y + 10 + 'px';
    ele.style.fill = 'orange';
  }

  function hideToolTip(ele) {
      var toolTip = document.querySelector('.toolTip');
      toolTip.style.display = 'none';
      ele.style.fill = '';
  }

  function yAxisFormat(k=1,yAxis,y) // IDEA: Zoom code added here
  {
    var tickCount = parseInt(1/k*10); //Getting the factor against which the number of ticks will be chosen
    tickCount = tickCount<=1?1:tickCount;
    tickCount = tickCount >= 10? 10: tickCount;
    var ticksList = y.domain().filter((d, i) => i % tickCount === 0); //Choosing a certain number of tick values to display depending on zoom value
    if (ticksList.length >= 1000 && k <= 2) //Refining the total number of ticks values to be chosen
    {
      tickCount = tickCount*3;
      ticksList = y.domain().filter((d, i) => i % tickCount === 0);
    }
    else if(ticksList.length >= 500 && k <= 2){
      tickCount = tickCount*2;
      ticksList = y.domain().filter((d, i) => i % tickCount === 0);
    }
    var tickSize = (100*(y.bandwidth()+y.paddingInner())/ticksList.length);
    if (tickSize >= 15) //Deciding the tick size
    {
      tickSize = 15;
    }
    else if (tickSize >= 11) {
      tickSize = parseInt(tickSize) + 5;
    }
    else if(tickSize >= 3){
      tickSize = parseInt(tickSize);
    }
    else if(tickSize >= 1){
      tickSize = parseInt(tickSize) + 3;
    }
    else if(tickSize*10 >= 5){
      tickSize = 4;
    }
    else if(tickSize*10 >= 3.5){
      tickSize = 2;
    }
    else if (tickSize*10 >= 2) {
      tickSize = 1.5;
    }
    else if (tickSize*10 >= 1.5)  {
      tickSize = tickSize*10 - 0.9;
    }
    else if (tickSize*10 >= 1)  {
      tickSize = tickSize*10 - 0.3;
    }
    else {
      tickSize = 0.4;
    }
    // console.log('Scale: ',k,'|tickCount: ',tickCount,'| value:', ((y.bandwidth()+y.paddingInner())/ticksList.length),'| font-size:',tickSize);
    var yAxisCall = d3.axisLeft(y)
                   .tickValues(ticksList); //Passing the array of tick values
    yAxis.call(yAxisCall); //Adding the axis
    document.querySelectorAll(".yAxis>.tick") //Passing the font-size
         .forEach(function(d, i){
           d.style.fontSize = tickSize +'px';
         });
    return tickSize;
  }

 	function displayHTMLTable(results){
 		let jdata = results.data;
 		let jsondata=[];

 		for(let i=0;i<jdata.length;i++){
 			if(jdata[i][2]!= null){
 				jsondata.push(jdata[i]);
 			}
 		}

		let dataprocess=[];
		let dataHeader =[];
		dataHeader = jsondata.splice(0,1).toString().split(",");
		jsondata.pop();

		let re=/^[0-9,.%]*$/;
		for(let i=0;i<jsondata.length;i++){
			for(let j=0;j<jsondata[0].length;j++){
				if(jsondata[i][j]){
					if(typeof(jsondata[i][j] == "string") && re.test(jsondata[i][j])){
						jsondata[i][j] = parseFloat(jsondata[i][j].toString().replace(/[,%]/g, ''));
					}
				}
			}
		}


		//column names from csv file
		let column = []
		let csvColumn=[]
		for (i=0;i<dataHeader.length;i++){
			column.push({ title: dataHeader[i]});
			csvColumn.push(dataHeader[i]+"("+typeof(dataHeader[i])+")");
		}

		//Datatable creation using dataprocess array
		$('#table1').dataTable( {
			"columnDefs": [{"defaultContent": "-","targets": "_all"}],
			"scrollX": true,
        	data: jsondata,
        	"order": [[ 1, "asc" ]],
        	columns: column
    	} );

		//search box
    	$("#myInput").on("keyup", function() {
    		let value = $(this).val().toLowerCase();
   	 		$("#myList li").filter(function() {
      			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    		});
  		});

		// populate column names as list
		let temp = $('<ul class="list-group list-group-flush" id="items1"></ul>');
    	for (let i = 0; i < dataHeader.length; i++) {
        	temp.append('<div class="item"><li class="list-group-item" id="'+dataHeader[i]+'">'+dataHeader[i]+'</li></div>');
    	}
    	$('#items').html(temp);

		//draggable list
    	$('.item').draggable({
	        cancel: "a.ui-icon",
	        revert: true,
	        helper: "clone",
	        cursor: "move",
			revertDuration: 0 ,
			containment: $('#board')
	    });

    	//doppable list columns
    	$('.container').droppable({
	        accept: "#items1 .item",
	        activeClass: "ui-state-highlight",
	        drop: function( event, ui ) {
	            // clone item to retain in original "list"
	            var $item = ui.draggable.clone();
	            $(this).addClass('has-drop').html($item);
	        }
    	});
    	count=2;
    	$('#adddiv').on("click",function(e){
    		e.preventDefault();
    		let temp=$('<div id="c'+count+'" class="container" style="width:200px;border-width:1px;border-style:dotted;height:44px;padding-left:0px;padding-right:0px;" contentEditable=true data-ph="Drag and Drop Item" readonly="readonly"></div>');
    		$("#containers").append(temp);
    		count+=1;

    		$('.container').droppable({
		        accept: "#items1 .item",
		        activeClass: "ui-state-highlight",
		        drop: function( event, ui ) {
		            // clone item to retain in original "list"
		            var $item = ui.draggable.clone();
		            $(this).addClass('has-drop').html($item);

		        }
	    	});
    	});

    	//total data to json format
    	let jsonFinalData ={};
		let divideData={};
		for (let i=0;i<dataHeader.length;i++){
			let temp=[]
			for (let j=0;j<jsondata.length;j++){
				temp.push(jsondata[j][i]);
			}
			if (typeof(temp[0])=="number"){
				divideData[dataHeader[i]] = "number";
			}else{
				divideData[dataHeader[i]] = "string";
			}
			jsonFinalData[dataHeader[i]] = temp;
		}
		let selectedValue=[];

    	//charts on click
    	function graph(){

    		let chartData = {};
    		// restrict modal box to right grid
    		function restrictGraph(id) {

			    $( "#"+id ).dialog({width:700,height:500}).parent().draggable({
				    containment: '#board'
				}).resizable({
				    containment: '#board'
				});
				var ui = $("#dialog3").closest(".ui-dialog");
				ui.draggable("option", "containment", '#board');
				ui.resizable({
				    handles: "n, e, s, w, se",
				    minHeight: 250,
				    minWidth: 250,
				    resize: function(e, ui) {
				      var contPos = $("#board").position();
				      contPos.bottom = contPos.top + $("#board").height();
				      contPos.right = contPos.left + $("#board").width();
				      contPos.height = $("#board").height();
				      contPos.width = $("#board").width();
				      if (ui.position.top <= contPos.top) {
				        ui.position.top = contPos.top + 1;
				      }
				      if (ui.position.left <= contPos.left) {
				        ui.position.left = contPos.left + 1;
				      }
				      if (ui.size.height >= contPos.height) {
				        ui.size.height = contPos.height - 7;
				      }
				      if (ui.size.width >= contPos.width) {
				        ui.size.width = contPos.width - 7;
				      }
				    }
				  });
			}
    		//draggable modal window

			if (selectedValue.length<3 && selectedValue.length>0){
				if (selectedValue.length==1 || (selectedValue[0] == selectedValue[1])){ //start of selectionValue==1 / end at 360

					//console.log(selectedValue);
					for(let i=0;i<jsonFinalData[selectedValue[0]].length;i++){
					    if (chartData[jsonFinalData[selectedValue[0]][i]]){
					    	chartData[jsonFinalData[selectedValue[0]][i]] += 1;
					    }
					    else{
					    	chartData[jsonFinalData[selectedValue[0]][i]] = 1;
					    }
					}

					let d3Data=[];

					for(let i=0;i<Object.keys(chartData).length;i++){
						let t ={};
						t["key"] = Object.keys(chartData)[i];
						t["value"] = Object.values(chartData)[i];
						d3Data.push(t);
					}

					let labelsData = Object.keys(chartData).map(function(key) {
							return key;
						});
					let frequencyData = Object.values(chartData).map(function(value) {
						return value;
					});


					if((selectedValue[0]).toLowerCase() == "country" || (selectedValue[0]).toLowerCase() == "state") // end at 307
          {
            let temp1 = $('<div id="dialog1" title="Country"><div id="myDiv"></div></div>');
						$('#chartdiv').html(temp1);

						var margin = {top: 10, right: 10, bottom: 10, left: 10};
                        var width = 960 - margin.left - margin.right;
                        var height = 500 - margin.top - margin.bottom;
                        var projection = d3.geoNaturalEarth1()
                            .center([0, 15])
                            .rotate([-9,0])
                            .scale([1300/(2*Math.PI)])
                            .translate([450,300]);

                        var color = d3.scaleThreshold()
                            .domain([0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200])
                            .range(d3.schemeBlues[7]);


                        var path = d3.geoPath()
                            .projection(projection);
                        var svg = d3.select("#myDiv")
							.append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .append("g");

                        const zoom = d3.zoom()
                            .scaleExtent([1, 8])
                            .on('zoom', zoomed);

                        function zoomed() {
                            svg
                                .selectAll('path')
                                .attr('transform', d3.event.transform);
                        }
                        svg.call(zoom);

                        d3.select("#myDiv")
                            .append("div")
							.attr("class",'tooltips')

                        var tooltip = d3.select("div.tooltips");
                        d3.queue()
                            .defer(d3.json, "https://raw.githubusercontent.com/akhilnamburi/VisualizationRA/master/task2/world-110m.json")
                            .defer(d3.csv, "https://raw.githubusercontent.com/akhilnamburi/VisualizationRA/master/task2/world-country-names.csv")
                            .await(ready);
                        function ready(error, world, names) {
                            if (error) throw error;
                            var countries1 = topojson.feature(world, world.objects.countries).features;
                            countries = countries1.filter(function(d) {
                                return names.some(function(n) {
                                    if (d.id == n.id){
                                        return d.name = n.name, d.val = chartData[d.name];
                                    }else{
                                        return d.name = n.name, d.val = 0;
                                    }
                                })});


                            svg.selectAll("path")
                                .data(countries)
                                .enter()
                                .append("path")
                                .attr("opacity",1)
                                .attr("stroke","white")
                                .attr("stroke-width",1)
                                .attr("fill", function (d) {

                                    return color(d.val);
                                })
                                .attr("d", path )
                                .on("mouseover",function(d,i){
                                    d3.select(this)
                                        .style("opacity", .8)
                                        .style("stroke","white")
                                        .style("stroke-width",1);
                                    return tooltip.style("hidden", false).html(d.name + d.val);
                                })
                                .on("mousemove",function(d){
                                    d3.select(this)
                                        .style("opacity", .8);

                                    tooltip.classed("hidden", false)
                                        .style("top", (d3.event.pageY - 130) + "px")
                                        .style("left", (d3.event.pageX - 600) + "px")
                                        .html(d.name +" : "+ d.val);
                                })
                                .on("mouseout",function(d,i){
                                    d3.select(this)
                                        .style("opacity", 1)
                                        .style("stroke","white")
                                        .style("stroke-width",0.3);


                                    tooltip.classed("hidden", true);
                                });
                        };

						restrictGraph("dialog1");


					} // starts at 203
          else{
            // Numerical Data
						let temp1 = $('<div id="dialog2" title="'+selectedValue[0]+'"></div>'); // TODO: Insert Semantic Zoom
						$('#chartdiv').html(temp1);
						var margin = {top: 20, right: 20, bottom: 30, left: 40},
					    width = 960 - margin.left - margin.right,
					    height = 500 - margin.top - margin.bottom;


						d3Data.forEach(function(d) {
						    d.value = +d.value;
						  });
            var SVG = d3.select("#dialog2")
                        .append("svg")
                        .attr("viewBox", `0 0 300 600`)
                        .append("g")
                        .attr("transform",
                              "translate(" + margin.left + "," + margin.top + ")");

            var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

            var x = d3.scaleLinear()
            .range([0, width]);


            x.domain([0, d3.max(d3Data, function(d){ return d.value; })])
            y.domain(d3Data.map(function(d) { return d.key; }));


            var clip = SVG.append("defs").append("SVG:clipPath")
                  .attr("id", "clip")
                  .append("SVG:rect")
                  .attr("width", width )
                  .attr("height", height )
                  .attr("x", 0)
                  .attr("y", 0);

          var bars = SVG.append('g')
                .attr("clip-path", "url(#clip)")

          var barsLeft =  SVG.append("rect")
                 .attr("width", width)
                 .attr('id','barsLeft')
                 .attr("height", height*2)
                 .attr("transform", "translate("+ -width +",0)")
                 .style("fill", "white")
                 .style("pointer-events", "all");

         var yAxis = SVG.append("g")
            .attr('class','yAxis')
            .call(d3.axisLeft(y));

          var barBottom =  SVG.append("rect")
                .attr("width", width*2)
                .attr('id','barBottom')
                .attr("height", height)
                .attr("transform", "translate("+ -width +"," + height + ")")
                .style("fill", "white")
                .style("pointer-events", "all");

          bars.selectAll(".bar")
				      .data(d3Data)
				      .enter().append("rect")
				      .attr("class", "bar")
				      .attr("width", function(d) {return x(d.value); } )
				      .attr("y", function(d) { console.log('helloooo');return y(d.key); })
				      .attr("height", y.bandwidth())
              .on("mousemove",function(d) {
                showToolTip(this,d,d3.event.clientX,d3.event.clientY);
              })
              .on("mouseout",function(d) {
                hideToolTip(this);
              });

          var zoom = d3.zoom()
               .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
               .extent([[0, 0], [width, height]])
               .on("zoom", updateChart);

        var xAxis = SVG.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x));

       SVG.call(zoom);

        yAxisFormat(1,yAxis,y);

         function updateChart(){
           x.range([0, width*d3.event.transform.k]);
           xAxis.call(d3.axisBottom(x));

           y.range([height*d3.event.transform.k, 0])
           yAxis.call(d3.axisLeft(y));

           var transform = {...d3.event.transform};
           var hightDifference = d3.event.transform.k<1?(height-(height*d3.event.transform.k)):0;
           if(d3.event.transform.x <= 0 && d3.event.transform.x >= - width*d3.event.transform.k){
             xAxis.attr("transform","translate("+d3.event.transform.x+"," + height + ")");
           }
           else if(d3.event.transform.x > 0){
             xAxis.attr("transform","translate(0," + height + ")");
             transform["x"] = 0;
           }
           else {
             xAxis.attr("transform","translate("+ - width*d3.event.transform.k +"," + height + ")");
             transform["x"] = - width*d3.event.transform.k;
           }

           if(d3.event.transform.y >= 0 && d3.event.transform.y <= height*d3.event.transform.k){
             yAxis.attr("transform","translate(0,"+ (d3.event.transform.y + hightDifference) +")");
           }
           else if(d3.event.transform.y < 0){
             yAxis.attr("transform","translate(0,"+ hightDifference +")");
             transform["y"] = 0;
           }
           else {
             yAxis.attr("transform","translate(0,"+ (height*d3.event.transform.k + hightDifference) +")");
             transform["y"] = height*d3.event.transform.k;
           }

           bars.attr("transform","translate("+ transform["x"] +","+ (transform["y"] + hightDifference) +") scale("+d3.event.transform.k+")");
           yAxisFormat(d3.event.transform.k,yAxis,y);
         }

				    restrictGraph("dialog2");
					}
					d3.select("#c1").selectAll("*").remove();
					d3.select("#c2").remove();
					count=2;

				}//end of if for selectedValue==1
				else{
          //combination of numerical data
	        let finalData=[];
        	if (divideData[selectedValue[0]] == "number" && divideData[selectedValue[1]] == "number" ) //end at 469
          {
            let finalData=[];
        		for (let j=0;j<selectedValue.length;j++){
          		for(let i=0;i<jsonFinalData[selectedValue[j]].length;i++){
						    if (chartData[jsonFinalData[selectedValue[j]][i]]){
						    	chartData[jsonFinalData[selectedValue[j]][i]] += 1;
						    }
						    else{
						    	chartData[jsonFinalData[selectedValue[j]][i]] = 1;
                }
              }
            }
		        let temp1 = $('<div id="dialog3" title="'+selectedValue[0]+' & '+selectedValue[1]+'"></div>');
						$('#chartdiv').html(temp1);

				    let d3Data=[];
				    for(let i=0;i<jsonFinalData[selectedValue[0]].length;i++){
				    	let t={};
				    	t['x']=jsonFinalData[selectedValue[0]][i];
				    	t['y']=jsonFinalData[selectedValue[1]][i];
				    	d3Data.push(t);
				    }

				    var margin = {top: 10, right: 30, bottom: 30, left: 60},
				    width = 460 - margin.left - margin.right,
				    height = 400 - margin.top - margin.bottom;

				    var SVG = d3.select("#dialog3")
							  	.append("svg")
							    .attr("viewBox", `0 0 300 600`)
							  	.append("g")
							    .attr("transform",
							          "translate(" + margin.left + "," + margin.top + ")");

						var x = d3.scaleLinear()
						    .domain([0, d3.max(d3Data, function(d){ return d.x; })])
						    .range([ 0, width ]);
						var xAxis = SVG.append("g")
						    .attr("transform", "translate(0," + height + ")")
						    .call(d3.axisBottom(x));

						  // Add Y axis
						var y = d3.scaleLinear() // and here
						    .domain([0, d3.max(d3Data, function(d){ return d.y; })])
						    .range([ height, 0]);
						var yAxis = SVG.append("g")
						    .call(d3.axisLeft(y));

						var clip = SVG.append("defs").append("SVG:clipPath")
						      .attr("id", "clip")
						      .append("SVG:rect")
						      .attr("width", width )
						      .attr("height", height )
						      .attr("x", 0)
						      .attr("y", 0);

						  // Create the scatter variable: where both the circles and the brush take place
						var scatter = SVG.append('g')
						    .attr("clip-path", "url(#clip)")

						scatter
						    .selectAll("circle")
						    .data(d3Data)
						    .enter()
						    .append("circle")
						      .attr("cx", function (d) { return x(d.x); } )
						      .attr("cy", function (d) { return y(d.y); } )
						      .attr("r", 8)
						      .style("fill", "#61a3a9")
						      .style("opacity", 0.5)

						  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
						 var zoom = d3.zoom()
						      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
						      .extent([[0, 0], [width, height]])
						      .on("zoom", updateChart);

						SVG.append("rect")
						      .attr("width", width)
						      .attr("height", height)
						      .style("fill", "none")
						      .style("pointer-events", "all")
						      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
						      .call(zoom);

						function updateChart() {
						    // recover the new scale
						    var newX = d3.event.transform.rescaleX(x);
						    var newY = d3.event.transform.rescaleY(y);

						    // update axes with these new boundaries
						    xAxis.call(d3.axisBottom(newX))
						    yAxis.call(d3.axisLeft(newY))
						    // update circle position
						    scatter
						      .selectAll("circle")
						      .attr('cx', function(d) {return newX(d.x)})
						      .attr('cy', function(d) {return newY(d.y)});
						  }

							restrictGraph("dialog3");

					}// both are numerical data
          // start at 364
					else if(divideData[selectedValue[0]] != divideData[selectedValue[1]] ){
						// combination of numerical and categorical data


						for(let i=0;i<jsonFinalData[selectedValue[0]].length;i++){
							if(typeof(jsonFinalData[selectedValue[0]][0]) == "string"){
								if (chartData[jsonFinalData[selectedValue[0]][i]]){
									chartData[jsonFinalData[selectedValue[0]][i]] += jsonFinalData[selectedValue[1]][i];
								}
								else{
									chartData[jsonFinalData[selectedValue[0]][i]] = jsonFinalData[selectedValue[1]][i];
								}
							}
							else{
								if (chartData[jsonFinalData[selectedValue[1]][i]]){
									chartData[jsonFinalData[selectedValue[1]][i]] += jsonFinalData[selectedValue[0]][i];
								}
								else{
									chartData[jsonFinalData[selectedValue[1]][i]] = jsonFinalData[selectedValue[0]][i];
								}
							}

						}
						let d3Data=[];

						for(let i=0;i<Object.keys(chartData).length;i++){
							let t ={};
							t["key"] = Object.keys(chartData)[i];
							t["value"] = Object.values(chartData)[i];
							d3Data.push(t);
						}

						let temp1 = $('<div id="dialog4" title="'+selectedValue[0]+' & '+selectedValue[1]+'"></div>');
						$('#chartdiv').html(temp1);

						var margin = {top: 20, right: 20, bottom: 30, left: 40},
					    width = 960 - margin.left - margin.right,
					    height = 500 - margin.top - margin.bottom;

					    var SVG = d3.select("#dialog4")
                        .append("svg")
                        .attr("viewBox", `0 0 300 600`)
                        .append("g")
                        .attr("transform",
                              "translate(" + margin.left + "," + margin.top + ")");

            var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

            var x = d3.scaleLinear()
            .range([0, width]);


            x.domain([0, d3.max(d3Data, function(d){ return d.value; })])
            y.domain(d3Data.map(function(d) { return d.key; }));


            var clip = SVG.append("defs").append("SVG:clipPath")
                  .attr("id", "clip")
                  .append("SVG:rect")
                  .attr("width", width )
                  .attr("height", height )
                  .attr("x", 0)
                  .attr("y", 0);

          var bars = SVG.append('g')
                .attr("clip-path", "url(#clip)")

          var barsLeft =  SVG.append("rect")
                 .attr("width", width)
                 .attr('id','barsLeft')
                 .attr("height", height*2)
                 .attr("transform", "translate("+ -width +",0)")
                 .style("fill", "white")
                 .style("pointer-events", "all");

         var yAxis = SVG.append("g")
            .attr('class','yAxis')
            .call(d3.axisLeft(y));

          var barBottom =  SVG.append("rect")
                .attr("width", width*2)
                .attr('id','barBottom')
                .attr("height", height)
                .attr("transform", "translate("+ -width +"," + height + ")")
                .style("fill", "white")
                .style("pointer-events", "all");

          bars.selectAll(".bar")
              .data(d3Data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("width", function(d) {return x(d.value); } )
              .attr("y", function(d) { return y(d.key); })
              .attr("height", y.bandwidth())
              .on("mousemove",function(d) {
                showToolTip(this,d,d3.event.clientX,d3.event.clientY);
              })
              .on("mouseout",function(d) {
                hideToolTip(this);
              });

          var zoom = d3.zoom()
               .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
               .extent([[0, 0], [width, height]])
               .on("zoom", updateChart);

        var xAxis = SVG.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x));

       SVG.call(zoom);

        yAxisFormat(1,yAxis,y);

         function updateChart(){
           x.range([0, width*d3.event.transform.k]);
           xAxis.call(d3.axisBottom(x));

           y.range([height*d3.event.transform.k, 0])
           yAxis.call(d3.axisLeft(y));

           var transform = {...d3.event.transform};
           var hightDifference = d3.event.transform.k<1?(height-(height*d3.event.transform.k)):0;
           if(d3.event.transform.x <= 0 && d3.event.transform.x >= - width*d3.event.transform.k){
             xAxis.attr("transform","translate("+d3.event.transform.x+"," + height + ")");
           }
           else if(d3.event.transform.x > 0){
             xAxis.attr("transform","translate(0," + height + ")");
             transform["x"] = 0;
           }
           else {
             xAxis.attr("transform","translate("+ - width*d3.event.transform.k +"," + height + ")");
             transform["x"] = - width*d3.event.transform.k;
           }

           if(d3.event.transform.y >= 0 && d3.event.transform.y <= height*d3.event.transform.k){
             yAxis.attr("transform","translate(0,"+ (d3.event.transform.y + hightDifference) +")");
           }
           else if(d3.event.transform.y < 0){
             yAxis.attr("transform","translate(0,"+ hightDifference +")");
             transform["y"] = 0;
           }
           else {
             yAxis.attr("transform","translate(0,"+ (height*d3.event.transform.k + hightDifference) +")");
             transform["y"] = height*d3.event.transform.k;
           }

           bars.attr("transform","translate("+ transform["x"] +","+ (transform["y"] + hightDifference) +") scale("+d3.event.transform.k+")");
           yAxisFormat(d3.event.transform.k,yAxis,y);
         }

            restrictGraph("dialog4");



					}// one is numerical and the other is categorical
					else{
						let t = $('<div id="tree" title="'+selectedValue[0]+' & '+selectedValue[1]+'" style="display: block; border: 2px;"></div>');
						$('#chartdiv').html(t);
						d3.select('svg').remove();
						//both are categorical
						nodes = [];
						links = [];
						categoricalJsonData=[];
						for (let i=0;i<(jsonFinalData[selectedValue[0]].length);i++){
							temp={};
							temp.lvl = 0;
							temp.name = jsonFinalData[selectedValue[0]][i];
							nodes.push(temp);
							temp2={};
							temp2.lvl = 1;
							temp2.name = jsonFinalData[selectedValue[1]][i];
							nodes.push(temp2);
							temp1={};
							temp1.source = jsonFinalData[selectedValue[0]][i];
							temp1.target = jsonFinalData[selectedValue[1]][i];
							links.push(temp1);
						}
						n = [];
						nodes.forEach(n1 => {
							let p = 0;
							n.forEach(n2=>{
								if(n1.name==n2.name){
									p = 1;
								}
							})
							if(p==0){
								n.push(n1);
							}
						});

						data = {};
						data.Nodes = n;
						data.links = links;
						generateGraph(data);
						$( function() {
							$( "#tree" ).dialog();
						} );

					}//end of else for both columsn are categorical data
					d3.select("#c1").selectAll("*").remove();
					d3.select("#c2").remove();
					count = 2;
	      }//end of else for selectedValue==2


			}//end of if condition for selected value <3 & >0

			//right click context menu
			var CLIPBOARD;

			$(document).contextmenu({
			    delegate: ".ui-widget-header",
			    autoFocus: true,
			    preventContextMenuForPopup: true,
			    preventSelect: true,
			    taphold: true,
			    menu: [{
			        title: "COPY",
			        cmd: "COPY",
			        uiIcon: "ui-icon-copy"
			    },  {
			        title: "----"
			    }
			    ],
			    // Handle menu selection to implement a fake-clipboard
			    select: function (event, ui) {
			        var $target = ui.target;
			        switch (ui.cmd) {
			            case "copy":
			                CLIPBOARD = $target.text();
			                break
			            case "paste":
			                CLIPBOARD = "";
			                break
			        }

			        selectedValue = $target.text().split('&').map(item=>item.trim());
			        graph();

			        // Optionally return false, to prevent closing the menu now
			    }
			});//right click context menu
		}
		$('#getgraph').on("click",function(e){
    		e.preventDefault();
    		selectedValue=[];
    		let elements = document.getElementById('containers').children;
    		for(let i=0;i<elements.length;i++){
    			selectedValue.push((($(elements[i]).text()).trim().toString()));
    		}
    		graph();
    	});// getgraph click function end


 	}// displayHTMLTable end


 });// ready function end
