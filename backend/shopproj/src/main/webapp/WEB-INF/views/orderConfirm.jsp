<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath }"/>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>KT ds Mall</title>
<link rel="stylesheet" href='<c:url value="resources/css/orderConfirm.css"/>'>
<!-- jQuery  $ Daum 주소 API -->
<script type="text/javascript" src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
<script src="<c:url value="resources/js/jquery-3.3.1.js"/>"></script>
<%-- <script src="<c:url value="resources/js/orderConfirm.js"/>"></script> --%> 
<script>
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
			<h1>KT ds Mall 주문확인</h1>
			<div class="menu">
				<a id="logoutBtn">로그아웃</a>
				<a id="myPageBtn">회원정보</a>
				<a id="cartListBtn">장바구니</a>				
			</div>
	</header>
	<div class="order">
	<c:if test="${not empty cDTO}">
		<c:set var="gColor" value="${cDTO.gColor}"/>
		<c:set var="gSize" value="${cDTO.gSize}"/>
		<c:set var="gAmount" value="${cDTO.gAmount}"/>	
		<c:set var="num" value="${cDTO.num}"/>	
	</c:if>
	<c:if test="${empty cDTO}">
		<c:set var="cDTO" value="${gDTO}"/>		
	</c:if>
	
		<form name="myForm" method="get" action="cartOrderDone">
			<input type="hidden" name="gCode" value="${cDTO.gCode}">
			<input type="hidden" name="gName" value="${cDTO.gName}">
			<input type="hidden" name="gPrice" value="${cDTO.gPrice}">
			<input type="hidden" name="gSize" value="${gSize}">
			<input type="hidden" name="gColor" value="${gColor}">
			<input type="hidden" name="gAmount" value="${gAmount}">
			<input type="hidden" name="gImage" value="${cDTO.gImage}">
			<c:if test="${not empty num }">
				<input type="hidden" name="orderNum" value="${num}">
			</c:if>
			<input type="hidden" id="mname" maxlength="20" value="${user.username}">
			<input type="hidden" id="mpost" maxlength="6" value="${user.post}" readonly>
			<input type="hidden" id="maddress1" maxlength="200" value="${user.addr1}" readonly>
			<input type="hidden" id="maddress2" maxlength="200" value="${user.addr2}" readonly>
			<input type="hidden" id="mphone" maxlength="15" value="${user.phone1}-${user.phone2}-${user.phone3}">
				<table>
					<tr>
						<td>
							<table>
								<tr>
									<th></th>
									<th>상품정보</th>
									<th>판매가</th>
									<th>수량</th>
								</tr>
								<tr>
									
									<td><img src='<c:url value="/resources/images/items/${cDTO.gImage }.gif"/>'></td>
									<td>[옵션 : 사이즈(${gSize }), 색상(${gColor })]</td>
									<td>${cDTO.gPrice}</td>
									<td>${gAmount} </td>
								</tr>
								<tr>
									<td></td>
									<td>총 결제 금액 :</td>
									<th>${cDTO.gPrice*gAmount}원</th>
								</tr>
							</table>
					</td>
					</tr>
					<!--  고객 정보 시작-->
					<tr>
						<th>고객 정보</th>
					</tr>
					<tr>
						<td>
							<table>
							<colgroup>
								<col style="width: 20%;">
								<col style="width: 80%;">
							</colgroup>
							<tbody>
								<tr>
									<td>이 름</td>
									<td>${user.username }</td>
								</tr>
								<tr>
									<td>우편번호</td>
									<td>${user.post }</td>
								</tr>
								<tr>
									<td>주 소</td>
									<td>${user.addr1 }, ${user.addr2 }
									</td>
								</tr>
								<tr>
									<td>휴대전화</td>
									<td>${user.phone1 }-${user.phone2 }-${user.phone3 }</td>
								</tr>
								</tbody>
							</table>
						</td>
					</tr>
					<!--  고객 정보 끝-->
					<tr>
						<td> <input type="checkbox" name="same" id="same">배송지가 동일할 경우 선택하세요.</td>
					</tr>
					<!--  배송지 정보 시작-->
					<tr>
						<th>배송지 정보</th>
					</tr>
					<tr>
						<td>
							<table>
							<colgroup>
								<col style="width: 20%;">
								<col style="width: 80%;">
							</colgroup>
							<tbody>
								<tr>
									<th>이 름</th>
									<td>
										<input type="text" id="orderName" name="orderName" maxlength="20" required>
									</td>
								</tr>
								<tr>
									<th>주 소</th>
										<td>
											<input type="text" name="post" id="postcode" placeholder="우편번호" required>
											<button type="button" id="calldaumPostCode">우편번호검색</button><br>
											<input type="text" class="addr" name="addr1" id="address" placeholder="주소" required><br>				
											<input type="text" class="addr" name="addr2" id="detailAddress" placeholder="상세 주소">
										</td>
								</tr>
								<tr>
									<th>휴대전화</th>
									<td>
										<input type="text" id="phone" name="phone" maxlength="15" value="">
									</td>
								</tr>
								</tbody>
							</table>
						</td>
					</tr>
					<!--  배송지 정보 끝-->
					<tr>
						<td><b>결제수단</b></td>
					</tr>
					<tr>
						<td>
							<table>
								<tr>
									<td>
										<input type="radio" name="payMethod" value="신용카드" checked>신용카드
										<input type="radio" name="payMethod" value="계좌이체">계좌이체
										<input type="radio" name="payMethod" value="무통장 입금">무통장 입금
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td>
						<div id="btnBox">
							<button type='button' id="mainBtn">메인으로</button>
							<button type='button' id="cancelBtn">취소</button>
							<button type='submit' id="orderBtn">결제하기</button>
						</div>
						</td>
					</tr>

				</table>
			</form>	
	</div>
</body>
</html>