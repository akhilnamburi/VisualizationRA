  $(document).ready(function(){
  	let elements = document.getElementById('details');
  	let elements1 = document.getElementById('details1');
  	
    $('#submitFile').on("click",function(e){
    	elements.style.display = 'block';
    	elements1.style.display = 'block';
		e.preventDefault();
		$('#files').parse({
			config: {
				delimiter: "auto",
				complete: displayHTMLTable,
			}
		});
    });

	function displayHTMLTable(results){
		let data = results.data;
		let dataprocess=[];
		let dataHeader =[];
		dataHeader = data.splice(0,1).toString().split(",");
		for (i=0;i<data.length;i++){
			if(data[i][0].length>1){
				let temp = data[i][0].toString().replace(/"/g, '\'');
				dataprocess.push(temp.match(/('[^']+'|[^,]+)/g));
			}
		}
		
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
        	data: dataprocess,
        	"order": [[ 1, "asc" ]],
        	columns: column
    	} );
    	document.getElementById("myText1").innerHTML = dataHeader.length;
    	document.getElementById("myText2").innerHTML = csvColumn;
    	document.getElementById("myText3").innerHTML = dataprocess.length;
    	//search box
    	$("#myInput").on("keyup", function() {
    		let value = $(this).val().toLowerCase();
   	 		$("#myList li").filter(function() {
      			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    		});
  		});

    	let temp = $('<ul class="list-group menu" style="list-style: none;" id="myList"> </ul>');
    	for (let i = 0; i < dataHeader.length; i++) {       
        	temp.append('<li><a href="#" class="button" >'+dataHeader[i]+'</a></li>');
    	}
    	$('#users').html(temp);

    	//Json data of entire csv file
		let jsonFinalData ={};
		for (let i=0;i<dataHeader.length;i++){
			let temp=[]
			for (let j=0;j<dataprocess.length;j++){
				temp.push(dataprocess[j][i]);
			}
			jsonFinalData[dataHeader[i]] = temp;
		}

    	//list on-click event
	  	let listItems = document.querySelectorAll("ul li");
	  	listItems.forEach(function(item) {
			item.onclick = function(e) {
				//delete the chart initially
				$('#myChart').remove();
				let temp1 = $('<div class="col-sm-8" class="graphContainer">');     
		        temp1.append('<canvas id="myChart" style="display: block; height: 800px; width: 950px;"></canvas>');
		    	$('#users1').html(temp1);
		    	let chartData = {};
			    let count = 1;
			    
			    for(let i=0;i<jsonFinalData[this.innerText].length;i++){
			    	if (chartData[jsonFinalData[this.innerText][i]]){
			    		chartData[jsonFinalData[this.innerText][i]] = count+1;
			    	} 
			    	else{
			    		chartData[jsonFinalData[this.innerText][i]] = 1;
			    	}
			    }
			    console.log(chartData);
			    chartData = Object.entries(chartData).sort().reduce( (o,[k,v]) => (o[k]=v,o), {} );
				if((this.innerText).toLowerCase() == "country" || (this.innerText).toLowerCase() == "state"){
						alert("oops");
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
				}//end of else condition
			}//end of onclick function
		});
	}// end of displayHTMLTable
  	

  });
