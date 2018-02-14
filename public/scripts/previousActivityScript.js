$(document).ready(() => {
	console.log('DOM is ready');
	let checkLocalhost = document.getElementById("localhost"), URI;
	
	$("td").on("click", ".edit", function(event) {
		console.log($(this).attr('id'));
	});
	$("td").on("click", ".delete", function(event) {
		if(checkLocalhost.innerText === "true") {
			URI = `http://localhost:3000/currencyHistory/${$(this).attr('id')}`;
		} else {
			URI = `https://mysterious-waters-61063.herokuapp.com/currencyHistory/${$(this).attr('id')}`;
		};
		$.ajax({
			url: URI,
			method:'DELETE'
		}).done(error => {
			if (!error){
				location.reload();
			}
		});
	});
});