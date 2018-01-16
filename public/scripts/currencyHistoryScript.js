console.log('file is working');
var xchangeIt = document.getElementById("xchangeIt").addEventListener('click', function(){
	let selectFrom = $("#currencyFrom").val();
	from = getCountryName(selectFrom);
	let selectTo = $("#currencyTo").val();
	to = getCountryName(selectTo);
	let fromDate = $("#fromDate").val();
	let toDate = $("#toDate").val();
	console.log('from:', selectFrom,' to:', selectTo, ' old date:', fromDate, ' new date:', toDate );
	$.ajax({
		url:'http://localhost:3000/getCurrencyHistory', 
		data:{ from:from, to:to, fromDate:fromDate, toDate:toDate }
	}).done(function(res){
		console.log(res);
	/*	res = JSON.parse(res);
		let ids = [];
		for(let property in res){
			ids.push(property);
		};*/
		let fromCurrencyAndSymbol = getCurrencyNameAndSymbol(selectFrom);
		let toCurrencyAndSymbol = getCurrencyNameAndSymbol(selectTo);
		var ctx = document.getElementById('myChart').getContext('2d');
		var chart = new Chart(ctx, {
		    // The type of chart we want to create
		    type: 'line',

		    // The data for our dataset
		    data: {
		        labels: ["January", "February", "March", "April", "May", "June", "July"],
		        datasets: [{
		            label: "My First dataset",
		            backgroundColor: 'rgb(255, 99, 132)',
		            borderColor: 'rgb(255, 99, 132)',
		            data: [0, 10, 5, 2, 20, 30, 45],
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
