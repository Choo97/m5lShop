<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${result.title }</title>
<link rel="stylesheet" href='<c:url value="resources/css/result.css"/>'>
<script src="<c:url value="/resources/js/jquery-3.3.1.js"/>"></script>
<script src="<c:url value="/resources/js/result.js"/>"></script>
</head>
<body>
<div class="result">	
	<h1>${action }</h1>
	<hr>
	<h3>${message}</h3>
	
	<button type="button" id="loginBtn">로그인 하기</button>	
	<c:if test="${action ne '로그인'}">	
		<button type="button" id="retryBtn">다시 시도</button>
	</c:if>
</div>
</body>
</html>