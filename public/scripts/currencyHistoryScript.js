console.log('file is working');
var xchangeIt = document.getElementById("xchangeIt").addEventListener('click', function() {
	document.getElementById('saved').style.display = 'none';
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
		response = JSON.parse(res);
		var index = 0;
		for (property in response){
			for(nestedProperty in response[property]){
				if(index){
					dataTo.push(response[property][nestedProperty]);
					dates.push(nestedProperty);
				}else{
					dataFrom.push(response[property][nestedProperty]);
				};
			};
			index++;
		};
		console.log("dataFrom", dataFrom, "\ndataTo", dataTo, "\ndates", dates);
		let fromCurrencyAndSymbol, toCurrencyAndSymbol;
		if(checkLocalhost.innerText === "true"){
			fromCurrencyAndSymbol = getCurrencyNameAndSymbol(selectFrom);
			toCurrencyAndSymbol = getCurrencyNameAndSymbol(selectTo);
		} else {
			fromCurrencyAndSymbol = getCurrencyNameAndSymbol(selectTo);
			toCurrencyAndSymbol = getCurrencyNameAndSymbol(selectFrom);
		};
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
		let commentDiv =  document.createElement("div");
		commentDiv.setAttribute("id", "commentDiv");

		let commentForm = document.createElement("form");
		commentForm.setAttribute("class", "form-horizontal");
		let formGroupDiv = document.createElement("div");
		formGroupDiv.setAttribute("class", "form-group");
		commentForm.appendChild(formGroupDiv);
		let commentLabel = document.createElement("label");
		commentLabel.innerText ="comment:";
		commentLabel.setAttribute("class", "control-label");
		commentLabel.setAttribute("for", "commentTextarea");
		formGroupDiv.appendChild(commentLabel);
		let commentTextarea = document.createElement("textarea");
		commentTextarea.setAttribute("id", "commentTextarea");
		commentTextarea.setAttribute("class", "form-control");
		formGroupDiv.appendChild(commentTextarea);
		commentDiv.appendChild(commentForm);
		let saveButton =  document.createElement("button");
		saveButton.setAttribute("id", "saveButton");
		saveButton.setAttribute("class", "btn btn-info btn-md");
		saveButton.innerText = "save search result";
		commentDiv.appendChild(saveButton);
		document.body.appendChild(commentDiv);
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
					//location.reload();
					document.getElementById('commentDiv').remove();
					document.getElementById('saved').style.display = 'block';
				};
			});
		});
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
