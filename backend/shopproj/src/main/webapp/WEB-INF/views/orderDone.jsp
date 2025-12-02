<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>KT ds Mall</title>
<link rel="stylesheet" href='<c:url value="resources/css/orderDone.css"/>'>
<script src="<c:url value="resources/js/jquery-3.3.1.js"/>"></script>
<script src="<c:url value="resources/js/orderDone.js"/>"></script>
<c:if test="${empty user}">
	<script>
		alert("임직원 전용입니다. 로그인 페이지로 이동합니다.");
		location.href = "/shop";
	</script>
</c:if>

</head>
<body>
<header>
			<h1>KT ds Mall 주문 결과</h1>
			<div class="menu">
				<a id="logoutBtn">로그아웃</a>
				<a id="myPageBtn">회원정보</a>
				<a id="cartListBtn">장바구니</a>				
			</div>
	</header>
	<div class="orderDetail">
	<table>
		<tr id="titleMessage">
			<th>주문해주셔서 감사합니다.</th>
		</tr>
		<tr id="detailMessage">
			<th>${orderInfo.userid} 님의 주문이	안전하게 처리되었습니다.</th>
		</tr>
		<tr>
			<th>상품 및 배송정보</th>
		</tr>
		<tr>
			<td>
			<table>
				<tr>
					<td> 받으시는 분</td>
					<td> ${orderInfo.orderName}</td>
				</tr>
				<tr>
					<td> 주소</td>
					<td><span>(${orderInfo.post})</span> 
						${orderInfo.addr1}&nbsp;${orderInfo.addr2}
					</td>
				</tr>				
				<tr>
					<td> 휴대전화</td>
					<td> ${orderInfo.phone}</td>
				</tr>
			</table>
		</tr>
		<tr>
			<td>
				<table>
					<tr>
						<th>상품명</th>
						<th>판매가</th>
						<th>수량</th>
						<th>합계</th>
					</tr>				
					<tr>
						<td>
							<span>${order.gName}</span>
						</td>
						<td>
							<span>${order.gPrice}</span>원
						</td>
						<td>
							<span>${order.gAmount}</span>권
						</td>
						<td>
							<span>${order.gPrice* order.gAmount}</span>원
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td><b>결제정보</b></td>
		</tr>		
		<tr>
			<td>
				<table>
					<tr>
						<td> 결제금액</td>
						<th>${order.gPrice* order.gAmount}원	</th>
					</tr>
					<tr>
						<td> 결제수단</td>
						<th> ${orderInfo.payMethod}</th>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
		<td>
			<div id="btnBox">				
				<a id="mainBtn">메인으로 이동</a>
			</div>
		</td>
	</tr>
	</table>
	</div>
</body>
</html>