console.log('file is working');
var xchangeIt = document.getElementById("xchangeIt").addEventListener('click', function(){
	let selectFrom = $("#from").val();
	from = getCountryName(selectFrom);
	let selectTo = $("#to").val();
	to = getCountryName(selectTo);
	$.ajax({
		url:'http://localhost:3000/exchangeRate', 
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
		$("#result").append(fromCurrencyAndSymbol + " to " + toCurrencyAndSymbol + ": " + res[ids[0]])
		if(selectFrom !== selectTo){
			$("#reverseResult").html("");
			$("#reverseResult").append(toCurrencyAndSymbol + " to " + fromCurrencyAndSymbol + ": " + res[ids[1]] );
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
