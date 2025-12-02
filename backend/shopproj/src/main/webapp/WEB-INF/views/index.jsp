<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath }"/>  
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>KT ds Mall</title>
<link rel="stylesheet" href="<c:url value="resources/css/index.css"/>">
<script src="<c:url value="/resources/js/jquery-3.3.1.js"/>"></script>
<script src="<c:url value="/resources/js/index.js"/>"></script>
</head>
<body>
<div class="login">
	<form id="loginForm" action="${contextPath }/login" method="post">
		<h1>KT ds Mall에 오신 것을 환영합니다.</h1>
		<h1>로그인하여 인증해주세요.</h1>
		<input type="text" id="id" name="userid" placeholder="아이디" required maxlength="10">
		<input type="password" id="pwd" name="passwd" placeholder="패스워드" required maxlength="10">
		<button type="submit">로그인</button>
		<button type="button" id="signUpBtn">회원가입</button>
	</form>
</div>
</body>
</html>