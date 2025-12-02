$(document).ready(function(){
	$("#same").click(function(){
		if(this.checked) {
			$("#orderName").val($("#mname").val())
			$("#postcode").val($("#mpost").val());
			$("#address").val($("#maddress1").val());
			$("#detailAddress").val($("#maddress2").val());
			$("#phone").val($("#mphone").val());
		} else {
			$("#orderName").val("")
			$("#postcode").val("");
			$("#address").val("");
			$("#detailAddress").val("");
			$("#phone").val("");
		}		
	});
	
	//다음 우편번호 검색 처리
	$("#calldaumPostCode").click(daumPostcode);
	
	//Daum 우편번호 API 이용
	function daumPostcode() {		
		new daum.Postcode(
				{
					oncomplete : function(data) {
						var address=data.roadAddress;
						if(data.userSelectedType=="J"){
							address=data.jibunAddress;
						}
						// 우편번호와 주소 정보를 해당 필드에 넣는다.
						$("#postcode").val(data.zonecode); 
						$("#address").val(address);	
						$(this).blur();
						$("#detailAddress").focus();									
					}
				}).open();
	};
	
	
	$("#mainBtn").click(function() {
		location.href = "/shop/main";
	});
	$("#cancelBtn").click(function() {
		history.back();
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