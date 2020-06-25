    
  $(document).ready(function(){
  	let elements = document.getElementById('details');
  	let elements1 = document.getElementById('details1');
  	
    $('#submitFile').on("click",function(e){

    	elements.style.display = 'block';
    	elements1.style.display = 'block';
		e.preventDefault();
		$('#files').parse({
			config: {
				dynamicTyping: true,
				skipEmptyLines: true,
				trimEmptyTrailingLines:true,
				complete: displayHTMLTable,
			}
		});
    });

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
			column.push({ title: dataHeader[i] });
			csvColumn.push(dataHeader[i]+"("+typeof(dataHeader[i])+")");
		}
	
		//Datatable creation using dataprocess array
		$('#table1').dataTable( {
			"columnDefs": [{"defaultContent": "-","targets": "_all"}],
        	data: data,
        	"order": [[ 1, "asc" ]],
        	columns: column
    	} );
    	document.getElementById("myText1").innerHTML = dataHeader.length;
    	document.getElementById("myText2").innerHTML = csvColumn;
    	document.getElementById("myText3").innerHTML = data.length;
    	
    	//search box
    	$("#myInput").on("keyup", function() {
    		let value = $(this).val().toLowerCase();
   	 		$("#myList li").filter(function() {
      			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    		});
  		});
    
        // columns list display
    	let temp = $('<ul class="list-group list-group-flush" id="myList"></ul>');
    	for (let i = 0; i < dataHeader.length; i++) {       
        	temp.append('<li class="list-group-item"><div class="custom-control custom-checkbox"><input type="checkbox" value="'+dataHeader[i]+'" name="columnName" class="custom-control-input" id="check'+i+'">'+
        		'  <label class="custom-control-label" for="check'+i+'">'+ dataHeader[i]+'</label></div></li>');
    	}
    	$('#users').html(temp);

    	//Json data of entire csv file
		let jsonFinalData ={};
		for (let i=0;i<dataHeader.length;i++){
			let temp=[]
			for (let j=0;j<data.length;j++){
				temp.push(data[j][i]);
			}
			if (typeof(temp[0])=="number"){
				temp.sort(function(a, b){return b-a});
			}else{
				temp.sort();
			}
			jsonFinalData[dataHeader[i]] = temp;
		}

		//generate chart button click
		$("button").click(function(){
            const favorite = [];
            $.each($("input[name='columnName']:checked"), function(){
                favorite.push($(this).val());
            });
            if (favorite.length<3 && favorite.length>0){
            	if (favorite.length==1){
            		$('#myChart').remove();
					let temp1 = $('<div class="col-sm-8" class="graphContainer">');     
			        temp1.append('<canvas id="myChart" style="display: block; height: 800px; width: 950px;"></canvas>');
			    	$('#users1').html(temp1);
			    	let chartData = {};
				    let count = 1;
				    for(let i=0;i<jsonFinalData[favorite[0]].length;i++){

				    	if (chartData[jsonFinalData[favorite[0]][i]]){
				    		chartData[jsonFinalData[favorite[0]][i]] = count+1;
				    	} 
				    	else{
				    		chartData[jsonFinalData[favorite[0]][i]] = 1;
				    	}
				    }   
				    //chartData = Object.entries(chartData).sort().reduce( (o,[k,v]) => (o[k]=v,o), {} );
					if((this.innerText).toLowerCase() == "country" || (this.innerText).toLowerCase() == "state"){
							alert("work in progress");
					}
					else{
				    	let labelsData = Object.keys(chartData).map(function(key) {
							return key;
						});
						let frequencyData = Object.values(chartData).map(function(value) {
							return value;
						});
				    	let maxValue = Math.max(...frequencyData);
				    	const ctx = document.getElementById('myChart').getContext('2d');
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
					}
	            }// end of if for faviourite==1
	            else{

	            }
            }
            else{
            	alert("select no more than 2 column names");
            }

        });//generate button click end	    	
	}// end of displayHTMLTable
  	

  });
