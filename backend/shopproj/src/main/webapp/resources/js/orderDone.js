$(document).ready(function(){	
	
	$("#mainBtn").click(function() {
		location.href = "/shop/main";
	});
	$("#logoutBtn").click(function() {
		location.href = "/shop/logout";
		alert("로그아웃 되었습니다.");
	});
	$("#myPageBtn").click(function() {
		location.href = "/shop/mypage";
	});
	$("#cartListBtn").click(function() {
		location.href = "/shop/cartList";
	});       
});