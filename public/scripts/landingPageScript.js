console.log('file is working');
var xchangeIt = document.getElementById("xchangeIt").addEventListener('click', function(){
	let checkLocalhost = document.getElementById("localhost"), URI;
	if(checkLocalhost.innerText === "true") {
		URI = 'http://localhost:3000/exchangeRate';
	} else {
		URI = 'https://mysterious-waters-61063.herokuapp.com/exchangeRate';
	}
	let selectFrom = $("#from").val();
	from = getCountryName(selectFrom);
	let selectTo = $("#to").val();
	to = getCountryName(selectTo);
	$.ajax({
		url:URI, 
		data:{ from:from, to:to }
	}).done(function(res){
		res = JSON.parse(res);
		let ids = [];
		for(let property in res){
			ids.push(property);
		};
		let fromCurrencyAndSymbol = getCurrencyNameAndSymbol(selectFrom);
		let toCurrencyAndSymbol = getCurrencyNameAndSymbol(selectTo);
		$("#result").html("");
		if (checkLocalhost.innerText === "true") {
			$("#result").append(fromCurrencyAndSymbol + " to " + toCurrencyAndSymbol + ": " + res[ids[0]])
			if(selectFrom !== selectTo){
				$("#reverseResult").html("");
				$("#reverseResult").append(toCurrencyAndSymbol + " to " + fromCurrencyAndSymbol + ": " + res[ids[1]]);
			} else {
				$("#result").append(fromCurrencyAndSymbol + " to " + toCurrencyAndSymbol + ": " + res[ids[1]])
				if(selectFrom !== selectTo){
					$("#reverseResult").html("");
					$("#reverseResult").append(toCurrencyAndSymbol + " to " + fromCurrencyAndSymbol + ": " + res[ids[0]]);
				};
			};
		};
			
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
