$(function() {
	console.log("bb")
	var loginBtn = $('#loginBtn');

	loginBtn.click(function() {		
		location.href = '/shop';
	});
	
	var retryBtn = $('#retryBtn');

	retryBtn.click(function() {		
		history.back();
	});
});