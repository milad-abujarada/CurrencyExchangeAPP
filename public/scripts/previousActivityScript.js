$(document).ready(() => {
	console.log('DOM is ready');
	let checkLocalhost = document.getElementById("localhost"), URI;
	
	$("td").on("click", ".edit", function(event) {
		//console.log($(this));
		$(this).text('Save').removeClass('edit').addClass('save');
		let text = $(`#comment${$(this).attr('id')}`).text();
		$(`#comment${$(this).attr('id')}`).text('');
		$(`#comment${$(this).attr('id')}`).append(`<textarea id='textArea${$(this).attr('id')}'>${text}</textarea>`);
		$(".save").on("click", function(event) {
			console.log("saved is being clicked");
			if(checkLocalhost.innerText === "true") {
				URI = `http://localhost:3000/currencyHistory/${$(this).attr('id')}`;
				} else {
					URI = `https://mysterious-waters-61063.herokuapp.com/currencyHistory/${$(this).attr('id')}`;
				};
				let newComment = $(`#textArea${$(this).attr('id')}`).val();
				console.log(newComment);
				$.ajax({
					url: URI,
					method:'PUT',
					data: {
						newComment: newComment
					}
				}).done(error => {
					if (!error) {
						location.reload();
					};
				});
			$(this).text('Edit').removeClass('save')/*.addClass('edit')*/;
		});
		
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