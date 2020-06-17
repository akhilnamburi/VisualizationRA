  $(document).ready(function(){
  	let elements = document.getElementById('details');
  	
    $('#submitFile').on("click",function(e){
    	elements.style.display = 'block';
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

		let column = []
		let csvColumn=[]
		for (i=0;i<dataHeader.length;i++){
			column.push({ title: dataHeader[i] });
			csvColumn.push(dataHeader[i]+"("+typeof(dataHeader[i])+")");
		}
		$('#table1').dataTable( {
			"columnDefs": [{"defaultContent": "-","targets": "_all"}],
        	data: dataprocess,
        	"order": [[ 1, "asc" ]],
        	columns: column
    	} );
    	document.getElementById("myText1").innerHTML = dataHeader.length;
    	document.getElementById("myText2").innerHTML = csvColumn;
    	document.getElementById("myText3").innerHTML = dataprocess.length;
    	
	}
  });
