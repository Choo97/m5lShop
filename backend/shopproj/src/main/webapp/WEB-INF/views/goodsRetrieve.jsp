<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>KT ds Mall</title>
<link rel="stylesheet" href="<c:url value="resources/css/goodsRetrieve.css"/>">
<script src="<c:url value="/resources/js/jquery-3.3.1.js"/>"></script>
<script src="<c:url value="/resources/js/goodsRetrieve.js"/>"></script>
<c:if test="${empty user}">
	<script>
		alert("임직원 전용입니다. 로그인 페이지로 이동합니다.");
		location.href = "/shop";
	</script>
</c:if>
<c:if test="${param.cart eq 'Y'}">
	<script>
		alert("${gCode} 상품이 장바구니에 추가되었습니다.");		
	</script>
</c:if>
</head>
<body>
	<header>
		<h1>상품 상세 화면입니다.</h1>
		<div class="menu">
			<a id="logoutBtn">로그아웃</a>
			<a id="myPageBtn">회원정보</a>
			<a id="cartListBtn">장바구니</a>			
		</div>
	</header>
	<div class="goodsDetail">
		<form name="goodRetrieveForm" method="GET" action="addCart">
			<input type="hidden" name="gImage" value="${item.gImage}">
			<input type="hidden" name="gCode" value="${item.gCode}">
			<input type="hidden" name="gName" value="${item.gName}">
			<input type="hidden" name="gPrice" value="${item.gPrice}">
			
			<table>
				<caption>상품 정보</caption>
				<tr>
					<td rowspan="6"><img src='<c:url value="/resources/images/items/${item.gImage}.gif"/>'></td>
					<td>제품코드</td>
					<td>${item.gCode}</td>
				</tr>
				<tr>
					<td>상품명</td>
					<td>${item.gName}</td>
				</tr>
				<tr>
					<td>가격</td>
					<td>${item.gPrice}</td>
				</tr>
				<tr>
					<td>배송비</td>
					<td><b> 무료배송</b>(도서 산간지역 별도 배송비 추가)</td>
				</tr>
				<tr>
					<td>상품옵션</td>
					<td>
						<select name="gSize" id="gSize" required>
							<option selected value="사이즈선택">사이즈선택</option>
							<option value="L">L</option>
							<option value="M">M</option>
							<option value="S">S</option>
						</select>
						<select name="gColor" id="gColor" required>
							<option selected value="색상선택">색상선택</option>
							<option value="navy">navy</option>
							<option value="black">black</option>
							<option value="ivory">ivory</option>
							<option value="white">white</option>
							<option value="gray">gray</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>주문수량</td>
					<td>
						<input type="text" name="gAmount" value="1" id="gAmount">
						<img src='<c:url value="/resources/images/up.PNG"/>' id="up">
						<img src='<c:url value="/resources/images/down.PNG"/>' id="down">
					</td>
				</tr>
			</table>
			<hr>
			<div class="buttonDiv">
				<button type="button" id="order">주문하기</button>			
				<button type="submit">장바구니</button>
				<button type="button" id="mainBtn">메인으로</button>
			</div>
		</form>
	</div>
</body>
</html>