 $(document).ready(function(){

 	$('#submitFile').on("click",function(e){
 		$("#searchBox").css({"display":"block"});
		e.preventDefault();
		$('#files').parse({
			config: {
				dynamicTyping: true,
				skipEmptyLines: true,
				trimEmptyTrailingLines:true,
				complete: displayHTMLTable,
			}
		});//parse function end
    });// submit file click end

 	function displayHTMLTable(results){
 		let data = results.data;
		let dataprocess=[];
		let dataHeader =[];
		dataHeader = data.splice(0,1).toString().split(",");
		data.pop();
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
        	data: data,
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
	        revertDuration: 0 
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
			for (let j=0;j<data.length;j++){
				temp.push(data[j][i]);
			}
			if (typeof(temp[0])=="number"){
				divideData[dataHeader[i]] = "number";
			}else{
				divideData[dataHeader[i]] = "string";
			}
			jsonFinalData[dataHeader[i]] = temp;
		}

    	//charts on click
    	$('#getgraph').on("click",function(e){
    		e.preventDefault();
    		let selectedValue=[];
    		let elements = document.getElementById('containers').children;
    		for(let i=0;i<elements.length;i++){
    			selectedValue.push((($(elements[i]).text()).trim().toString()));
    		}

    		let chartData = {};
    		//draggable modal window
    		
			if (selectedValue.length<3 && selectedValue.length>0){
				if (selectedValue.length==1){

					for(let i=0;i<jsonFinalData[selectedValue[0]].length;i++){
					    if (chartData[jsonFinalData[selectedValue[0]][i]]){
					    	chartData[jsonFinalData[selectedValue[0]][i]] += 1;
					    } 
					    else{
					    	chartData[jsonFinalData[selectedValue[0]][i]] = 1;
					    }
					}
					

					let labelsData = Object.keys(chartData).map(function(key) {
							return key;
						});
					let frequencyData = Object.values(chartData).map(function(value) {
						return value;
					});  
					/*let temp=$('<div id="dialog" title="Chart"><p></p></div>');
		    		$("#dragph").append(temp);
		    		
		    		$( function() {
					    $( "#dialog" ).dialog();
					  } );*/

					if((selectedValue[0]).toLowerCase() == "country" || (selectedValue[0]).toLowerCase() == "state"){
						let temp1 = $('<div id="dialog1" title="Country Chart"><div id="myDiv"></div></div>');
						$('#chartdiv').html(temp1);
						var data = [{
						    type: 'choropleth',
						    locationmode: 'country names',
						    locations: labelsData,
						    z: frequencyData,
						    text: labelsData,
						    autocolorscale: true
						}];

						var layout = {
						    title: 'Country data',
						    geo: {
						        projection: {
						            type: 'robinson'
						        }
						    }
						};

						Plotly.newPlot("myDiv", data, layout, {showLink: false});

						$( function() {
						    $( "#dialog1" ).dialog();
						  } );
						
					}else{
						//delete chart and recreate it
				    	
						let temp1 = $('<div id="dialog2" title="'+selectedValue[0]+'"><canvas id="myChart2" style="display: block; width:800px;"></canvas></div>');
						$('#chartdiv').html(temp1);

				    	let maxValue = Math.max(...frequencyData);
				    	const ctx = document.getElementById('myChart2').getContext('2d');
				    	let chart = new Chart(ctx, {
						    // The type of chart we want to create
						    type: 'horizontalBar',
						    // The data for our dataset
						    data:{
						        labels: labelsData,
						        datasets: [{
						            label: 'Frequency',
						            backgroundColor: 'rgb(255, 99, 132)',
						            borderColor: 'rgb(255, 99, 132)',
						            data: frequencyData
						        }]
						    },
						    options: {
							    scales: {
							        xAxes: [{
							            ticks: {
							                min: 0,
							                max: maxValue+1
							            }
							        }]
							    }
							}
						});

						$( function() {
						    $( "#dialog2" ).dialog();
						  } );
					}


				}//end of if for selectedValue==1
				else{
	            	//combination of numerical data
	            	let finalData=[];
	            	if (divideData[selectedValue[0]] == "number" && divideData[selectedValue[1]] == "number" ){
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
						Object.keys(chartData).map(function(k){ 
					    	//console.log("key with value: "+k +" = "+chartData[k])  
					    	let temp={};
					    	temp['x'] = k;
					    	temp['y'] = chartData[k]; 
					    	finalData = [...finalData, temp];
					    });
						
		            	let temp1 = $('<div id="dialog3" title="'+selectedValue[0]+'"><canvas id="myChart3" style="display: block; width:800px;"></canvas></div>');
						$('#chartdiv').html(temp1);
					    //let maxValue = Math.max(...frequencyData);
					    const ctx = document.getElementById('myChart3').getContext('2d');
					    	let chart = new Chart(ctx, {
							    // The type of chart we want to create
							    type: 'scatter',
							    // The data for our dataset
							    data:{
							        
							        datasets: [{
							            label: 'Scatter Data',
							            backgroundColor: 'rgb(255, 99, 132)',
							            borderColor: 'rgb(255, 99, 132)',
							            data: finalData
							        }]
							    },
							    options: {
								    scales: {
								        xAxes: [{
								            type: 'linear',
                							position: 'bottom'
								        }],
								        yAxes: [{
								            ticks: {
								                min: 0,
								                max: 50
								            }
								        }]
								    }
								}
							});
							$( function() {
							    $( "#dialog3" ).dialog();
							  } );
					}// both are numerical data
					else if(divideData[selectedValue[0]] != divideData[selectedValue[1]] ){
	            		for (let j=0;j<favorite.length;j++){
		            		for(let i=0;i<jsonFinalData[favorite[j]].length;i++){
		            			
							    if (chartData[jsonFinalData[favorite[j]][i]]){
							    	chartData[jsonFinalData[favorite[j]][i]] += 1;
							    } 
							    else{
							    	chartData[jsonFinalData[favorite[j]][i]] = 1;
							    }
							}
						}
						console.log(chartData);
						let labelsData = Object.keys(chartData).map(function(key) {
							return key;
						});
						let frequencyData = Object.values(chartData).map(function(value) {
							return value;
						}); 
						let temp1 = $('<div id="dialog4" title="'+selectedValue[0]+'"><canvas id="myChart4" style="display: block; width:800px;"></canvas></div>');
						$('#chartdiv').html(temp1);

				    	let maxValue = Math.max(...frequencyData);
				    	const ctx = document.getElementById('myChart4').getContext('2d');
				    	let chart = new Chart(ctx, {
						    // The type of chart we want to create
						    type: 'horizontalBar',
						    // The data for our dataset
						    data:{
						        labels: labelsData,
						        datasets: [{
						            label: 'Frequency',
						            backgroundColor: 'rgb(255, 99, 132)',
						            borderColor: 'rgb(255, 99, 132)',
						            data: frequencyData
						        }]
						    },
						    options: {
							    scales: {
							        xAxes: [{
							            ticks: {
							                min: 0,
							                max: maxValue+1
							            }
							        }]
							    }
							}
						});
						$( function() {
							    $( "#dialog4" ).dialog();
							  } );

					}// one is numerical and the other is categorical
					else{
						//both are categorical
						categoricalJsonData={};
						for (let j=0;j<selectedValue.length;j++){
							chartData={};
		            		for(let i=0;i<jsonFinalData[selectedValue[j]].length;i++){
							    if (chartData[jsonFinalData[selectedValue[j]][i]]){
							    	chartData[jsonFinalData[selectedValue[j]][i]] += 1;
							    } 
							    else{
							    	chartData[jsonFinalData[selectedValue[j]][i]] = 1;
							    }
							}
							categoricalJsonData[selectedValue[j]]=chartData;
						} 
						


					}//end of else for both columsn are categorical data
						
	            }//end of else for selectedValue==2


			}//end of if condition for selected value <3 & >0


    	});// getgraph click function end
    	

 	}// displayHTMLTable end


 });// ready function end