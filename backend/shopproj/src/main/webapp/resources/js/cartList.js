$(document).ready(function(){

    	 //수정버튼
        $(".updateBtn").on("click",function(){
           	var num;
        	var gAmount;
        	var gPrice;
        	$.ajax({
        	
        	
	        	/*  장바구니 목록에서 수량 수정하기 JS 구현
				 *
			 	 *
			 	 */
			 	 
        	});//end ajax
        });
    	 
        //삭제버튼
        $(".delBtn").on("click",function(){
        	var num= $(this).attr("data-xxx");
        	var xxx = $(this);
        	$.ajax({
        		url:'cartDelete',
        		type:'get',
        		dataType:'text',
        		data:{
        			num:num
        		},
        		success:function(data,status,xhr){
        		
        		
        			/*  상품상세화면에서 삭제 JS 구현
					 *
					 *
					 */
        		},
        		error:function(xhr,status,error){
        			
        		}
        	});//end ajax
        });
 
        $("#mainBtn").click(function(){
			location.href="/shop/main";
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
		
		
        //전체선택
        $("#allCheck").on("click",function(){
        	let isCheck = this.checked;
        	$(".check").each(function(idx,data) {
        		this.checked=isCheck;
        	});
        	
        });
        
       
        $("#delAllCart").on("click",function(){
        	
        	$("form").attr("action", "CartDelAll");
        	$("form").submit();// trigger
        });
        
       
        $(".orderBtn").on("click",function(){
        	var num= $(this).attr("data-xxx");
        	location.href="cartOrderConfirm?num="+num;
        });
     
        $("#orderAllConfirm").on("click",function(){
        	$("form").attr("action", "cartOrderAllConfirm");
        	$("form").submit();// trigger
        });
   });