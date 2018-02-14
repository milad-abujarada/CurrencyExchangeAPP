console.log('file is working');
var xchangeIt = document.getElementById("xchangeIt").addEventListener('click', function() {
	let checkLocalhost = document.getElementById("localhost"), URI;
	if(checkLocalhost.innerText === "true") {
		URI = 'http://localhost:3000/getCurrencyHistory';
	} else {
		URI = 'https://mysterious-waters-61063.herokuapp.com/getCurrencyHistory';
	};
	let selectFrom = $("#currencyFrom").val();
	from = getCountryName(selectFrom);
	let selectTo = $("#currencyTo").val();
	to = getCountryName(selectTo);
	let fromDate = $("#fromDate").val();
	let toDate = $("#toDate").val();
	console.log('from:', selectFrom,' to:', selectTo, ' old date:', fromDate, ' new date:', toDate );
	let dataFrom = [];
	let dataTo = [];
	let dates = [];
	let commentDiv =  document.getElementById("commentDiv");
	if(commentDiv){
		commentDiv.parentNode.removeChild(commentDiv);
	};
	$.ajax({
		url:URI,
		data:{ 
			from:from, 
			to:to, 
			fromDate:fromDate, 
			toDate:toDate 
		}
	}).done(function(res) {
		/*console.log(res);*/
		response = JSON.parse(res);
		
		//console.log(typeof(response));
		var index = 0;
		for (property in response){
			//console.log(property);
			for(nestedProperty in response[property]){
				//console.log(response[property][nestedProperty]);
				if(index){
					dataTo.push(response[property][nestedProperty]);
					dates.push(nestedProperty);
				}else{
					dataFrom.push(response[property][nestedProperty]);
				};
				//typeof(response[property].nestedProperty));
			};
			index++;
		};
		console.log("dataFrom", dataFrom, "\ndataTo", dataTo, "\ndates", dates);
	/*	res = JSON.parse(res);
		let ids = [];
		for(let property in res){
			ids.push(property);
		};*/
		let fromCurrencyAndSymbol = getCurrencyNameAndSymbol(selectTo);
		let toCurrencyAndSymbol = getCurrencyNameAndSymbol(selectFrom);


		var ctx = document.getElementById('myChart').getContext('2d');
		var chart = new Chart(ctx, {
		    // The type of chart we want to create
		    type: 'bar',

		    // The data for our dataset
		    data: {
		        labels: dates,
		        datasets: [{
		            label: fromCurrencyAndSymbol + " to " + toCurrencyAndSymbol,
		            backgroundColor: 'rgb(255, 99, 132)',
		            borderColor: 'rgb(255, 99, 132)',
		            data: dataFrom,
		        },{
		            label: toCurrencyAndSymbol + " to " + fromCurrencyAndSymbol ,
		            backgroundColor: 'rgb(255, 199, 132)',
		            borderColor: 'rgb(255, 199, 132)',
		            data: dataTo,
		        }]
		    },

		    // Configuration options go here
		    options: {}
		});
/*		$("#result").html("");
		$("#result").append(fromCurrencyAndSymbol + " to " + toCurrencyAndSymbol + ": " + res[ids[0]])
		if(selectFrom !== selectTo){
			$("#reverseResult").html("");
			$("#reverseResult").append(toCurrencyAndSymbol + " to " + fromCurrencyAndSymbol + ": " + res[ids[1]] );
		};*/
		//let body = document.getElementsByTagName("body");
		let commentDiv =  document.createElement("div");
		commentDiv.setAttribute("id", "commentDiv");
		document.body.appendChild(commentDiv);
		let commentLabel = document.createElement("label");
		commentLabel.innerText ="comment";
		commentDiv = document.getElementById("commentDiv");
		commentDiv.appendChild(commentLabel);
		let commentTextarea = document.createElement("textarea");
		commentDiv.appendChild(commentTextarea);
		commentTextarea.setAttribute("id", "commentTextarea");
		let saveButton =  document.createElement("button");
		saveButton.setAttribute("id", "saveButton")
		saveButton.innerText = "save search result";
		commentDiv.appendChild(saveButton);
		document.getElementById("saveButton").addEventListener("click", () => {
			if (checkLocalhost.innerText === "true") {
				URI = 'http://localhost:3000/currencyHistory/save';
			} else {
				URI = 'https://mysterious-waters-61063.herokuapp.com/currencyHistory/save';
			};
			let commentText = $("#commentTextarea").val();
			$.ajax({
				url:URI,
				method:'POST',
				data: {
					date: Date(),
					from: selectFrom,
					to: selectTo,
					fromRates: dataFrom,
					toRates: dataTo,
					historyDates: dates,
					comment: commentText
				}
			}).done(error => {
				if (!error) { 
					location.reload();
				};
			});
		});
		//console.log(body);
		/*document.body.appendChild(commentLabel);
		document.body.appendChild(textArea);
		document.body.appendChild(button);*/
		
		/*document.createElement("label").appendChild("body");*/
	});
});
function getCountryName(string){
	let index = 0;
	while (string[index] !== '/'){
		index++;
	};
	return string.substring(0,(index - 1));
};
function getCurrencyNameAndSymbol(string){
	let index = 0;
	while (string[index] !== '/'){
		index++;
	};
	return string.substring((index + 1),(string.length));
}
