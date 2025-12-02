<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>KT ds Mall</title>
<link rel="stylesheet" href='<c:url value="/resources/css/shopMain.css"/>'>
<script src="<c:url value="resources/js/jquery-3.3.1.js"/>"></script>
<script src="<c:url value="resources/js/shopMain.js"/>"></script>
<c:if test="${empty user}">
	<script>
		alert("임직원 전용입니다. 로그인 페이지로 이동합니다.");
		location.href="/shop";
	</script>
</c:if>
</head>
<body>
<header>
	<h1>KT ds Mall에 오신 것을 환영합니다.</h1>
	<div class="menu">
		<a id="logoutBtn">로그아웃</a>
		<a id="myPageBtn">회원정보</a>
		<a id="cartListBtn">장바구니</a>			
	</div>	
</header>
<div class="goods">
	<ul class="tabs">
		<li id="top">TOP</li>
		<li id="dress">DRESS</li>
		<li id="outer">OUTER</li>
		<li id="bottom">BOTTOM</li>		
	</ul>
	<div class="tab_content" id="tab_top">
	<c:forEach var="item" items="${goods}">
		<c:if test="${item.gCategory == 'top' }">
		<div class="item">
			<input type="hidden" class="gCode" value="${item.gCode }">
			<a href="goodsRetrieve?gCode=${item.gCode}">
				<img src="<c:url value="/resources/images/items/"/>${item.gImage }.gif">
			</a>			
			<p class="gName"><a href="goodsRetrieve?gCode=${item.gCode}">${item.gName }</a></p>
			<p class="gContent">${item.gContent }</p>
			<p><span class="gPrice">${item.gPrice }</span>원</p>
		</div>
		</c:if>
	</c:forEach>
	</div>
	<div class="tab_content" id="tab_dress">
	<c:forEach var="item" items="${goods }">
		<c:if test="${item.gCategory == 'dress' }">
		<div class="item">
			<input type="hidden" class="gCode" value="${item.gCode }">
			<a href="goodsRetrieve?gCode=${item.gCode}">
				<img src="<c:url value="/resources/images/items/"/>${item.gImage }.gif">
			</a>
			<p class="gName">${item.gName }</p>
			<p class="gContent">${item.gContent }</p>
			<p><span class="gPrice">${item.gPrice }</span>원</p>
		</div>
		</c:if>
	</c:forEach>
	</div>
	<div class="tab_content" id="tab_outer">
	<c:forEach var="item" items="${goods }">
		<c:if test="${item.gCategory == 'outer' }">
		<div class="item">
			<input type="hidden" class="gCode" value="${item.gCode }">
			<a href="goodsRetrieve?gCode=${item.gCode}">
				<img src="<c:url value="/resources/images/items/"/>${item.gImage }.gif">
			</a>
			<p class="gName">${item.gName }</p>
			<p class="gContent">${item.gContent }</p>
			<p><span class="gPrice">${item.gPrice }</span>원</p>
		</div>
		</c:if>
	</c:forEach>
	</div>
	<div class="tab_content" id="tab_bottom">
	<c:forEach var="item" items="${goods }">
		<c:if test="${item.gCategory == 'bottom' }">
		<div class="item">
			<input type="hidden" class="gCode" value="${item.gCode }">
			<a href="goodsRetrieve?gCode=${item.gCode}">
				<img src="<c:url value="/resources/images/items/"/>${item.gImage }.gif">
			</a>
			<p class="gName">${item.gName }</p>
			<p class="gContent">${item.gContent }</p>
			<p><span class="gPrice">${item.gPrice }</span>원</p>
		</div>
		</c:if>
	</c:forEach>
	</div>	
</div>
</body>
</html>