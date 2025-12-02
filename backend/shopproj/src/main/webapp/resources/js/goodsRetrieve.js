
	$(document).ready(function() {
		var amount=$("#gAmount");
		$("#up").click(function(){
			amount.val(+amount.val()+1);
		});
		$("#down").click(function(){
			if(amount.val()>1){
				amount.val(+amount.val()-1);
			}
		});
		
		var size=$("#gSize");
		var color=$("#gColor");
		
		$(document.forms[0]).submit(function(){
			if(size.val()=="사이즈선택" || color.val()=="색상선택"){
				alert("사이즈 또는 색상이 선택되지 않았습니다.");
				return false;
			}
		});
						
		$("#order").click(function(){
			var frm=$(document.forms[0]);
			frm.attr("action", "orderConfirm");			
			frm.submit();
			
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
		$("#mainBtn").click(function(){
			location.href="/shop/main";
		});
	});
	