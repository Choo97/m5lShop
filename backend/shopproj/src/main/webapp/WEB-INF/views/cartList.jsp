<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>KT ds Mall</title>
<link rel="stylesheet" href="<c:url value="resources/css/cartList.css"/>">

<script src="<c:url value="/resources/js/jquery-3.3.1.js"/>"></script>
<%-- <script src="<c:url value="/resources/js/cartList.js"/>"></script> --%>
<script>
$(document).ready(function(){

	 //수정버튼
   $(".updateBtn").on("click",function(){
    var num = $(this).attr("data-xxx");
   	var gAmount = $("#cartAmount"+num).val();
   	var gPrice = $(this).attr("data-price");;
   	$.ajax({
   		url:"cartUpdate",
   		type:"get",
   		data:{num:num, gAmount:gAmount},
		success: function(data) {
			let sum=gAmount*gPrice;
			$("#sum"+num).text(sum+'원');
			alert("수량을 수정하였습니다.");			
		},
		error:function(err){}
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
   			xxx.parents().filter("tr").remove();
   			let itemCount=$(".items").length;
   			if(itemCount>0) {
   				alert("상품을 삭제하였습니다.");
   			} else {
   				alert("상품을 삭제하였습니다. 장바구니가 비어 메인화면으로 이동합니다.");
   				location.href="/shop/main";
   			}
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
	    if($(".check:checked").length==0) return false;
   		$("form").attr("action", "cartOrderAllConfirm");
   		$("form").submit();// trigger
   });
});
</script>
<c:if test="${empty user}">
	<script>
		alert("임직원 전용입니다. 로그인 페이지로 이동합니다.");
		location.href = "/shop";
	</script>
</c:if>
</head>
<body>
	<header>
		<h1>KT ds Mall 장바구니</h1>
		<div class="menu">
			<a id="logoutBtn">로그아웃</a>
			<a id="myPageBtn">회원정보</a>
			<a id="cartListBtn">장바구니</a>			
		</div>
	</header>
	<div class="cart">
		<form name="myForm">
			<table>
				<colgroup>
					<col style="width: 10%;">
					<col style="width: 5%;">
					<col style="width: 10%;">
					<col style="width: 25%;">
					<col style="width: 10%;">
					<col style="width: 15%;">
					<col style="width: 15%;">
					<col style="width: 5%;">
					<col style="width: 5%;">
				</colgroup>
				<tbody>
				<tr>
					<th><input type="checkbox" name="allCheck" id="allCheck"/>전체선택</th>
					<th>CartNo</th>
					<th colspan=2>상품정보</th>
					<th>판매가</th>
					<th>수량</th>
					<th>합계</th>
					<th>  </th>
					<th>  </th>
				</tr>
				
				
				<c:if test="${empty cartList}">
					<tr>
						<td colspan=9>장바구니가 비었습니다.</td>
					</tr>
				</c:if>
				
													
				<c:forEach var="item" items="${cartList}" varStatus="status">
					<tr class="items">
						<td>
							<input type="checkbox" name="check" id="check81" class="check" value="${item.num}">
						</td>
						<td>${item.num}</td>
						<td>
							<img src='<c:url value="/resources/images/items/${item.gImage}.gif"/>'/>
						</td>
						<td>
							<span class="gName">${item.gName}</span>
							<span class="gOption">[옵션:사이즈(${item.gSize}),색상(${item.gColor})]</span>
						<td>${item.gPrice}원</td>
						<td>
							<input type="text" name="cartAmount" id="cartAmount${item.num}" value="${item.gAmount}"/>
							<button type="button" class="updateBtn" data-xxx="${item.num}" data-price="${item.gPrice}">수정</button> 
						</td>
						<td><span id="sum${item.num}">${item.gPrice * item.gAmount}원</span></td>
						<td>
							<button type="button" class="orderBtn" data-xxx="${item.num}">주문</button>
						</td>
						<td>
							<button type="button" id="xx${status.index}" class="delBtn" data-xxx="${item.num}">삭제</button>
						</td>						
					</tr>
				</c:forEach>
				<tr>
					<td colspan="9">
					<div class="ordMenu">
						<c:if test="${not empty cartList}">
							<a id="orderAllConfirm">선택주문 </a>
							<a id="delAllCart"> 선택삭제 </a>	
						</c:if>						
						<a id="mainBtn"> 메인으로</a>
					</div>
					</td>
				</tr>
							
			</tbody>
			</table>
		</form>
	</div>
</body>
</html>