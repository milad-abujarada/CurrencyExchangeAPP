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
		$("#result").html("");
		$("#result").append(selectFrom + " to " + selectTo + " : " + res[ids[0]] + " and " + selectTo + " to " + selectFrom + ": " + res[ids[1]] );
	});
});
function getCountryName(string){
	let index = 0;
	while (string[index] !== '/'){
		index++;
	};
	return string.substring(0,(index - 1));
};
