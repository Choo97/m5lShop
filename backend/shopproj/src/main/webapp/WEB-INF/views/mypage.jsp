<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>회원 정보</title>
<link rel="stylesheet" href="resources/css/myPage.css">
<!-- jQuery  $ Daum 주소 API -->
<script type="text/javascript" src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
<script type="text/javascript" src="resources/js/jquery-3.3.1.js"></script>
<script type="text/javascript" src="resources/js/myPage.js"></script>

</head>
<body>
<div class="memberInfo">
	<h1>회원 정보</h1>
	<form action="updateMember" method="POST">
	<hr>
	<table>
		<colgroup>
			<col style="width: 25%;">
			<col style="width: 75%;">
		</colgroup>
		<tbody>
		<tr>
			<th>아 이 디</th>
			<td>
				<input type="hidden" name="userid" id="userid" value="${user.userid }" required readonly>
				<span>${user.userid }</span>				
			</td>
		</tr>
		<tr>
			<th>비밀번호</th>
			<td>
				<input type="password" name="passwd" id="passwd" value="${user.userid }" required>
			</td>
		</tr>
		<tr>
			<th>비빌번호확인</th>
			<td>
				<input type="password" name="passwdConfirm" id="passwdConfirm" value="${user.userid }" required> <span id="passwordMessage"></span>
			</td>
		</tr>
		<tr>
			<th>이 름</th>
			<td><span>${user.username }</span></td>
		</tr>
		<tr>
			<th>주 소</th>
			<td>
				<input type="text" name="post" id="postcode" value="${user.post }" placeholder="우편번호" required>
				<button type="button" id="calldaumPostCode">우편번호검색</button><br>
				<input type="text" class="addr" name="addr1" id="address" value="${user.addr1 }" placeholder="주소" required><br>				
				<input type="text" class="addr" name="addr2" id="detailAddress" value="${user.addr2 }" placeholder="상세 주소">
			</td>
		</tr>
		<tr>
			<th>전화번호</th>
			<td>
				<select	name="phone1" value="${user.phone1 }" required>
					<option value="010" selected>010</option>
					<option value="011">011</option>
				</select>
				<input type="text" name="phone2" value="${user.phone2 }" required maxlength="4">
				<input type="text" name="phone3" value="${user.phone3 }" required maxlength="4">
			</td>
		</tr>
		<tr>
			<th>이메일</th>
			<td>
				<input type="text" name="email1" id="email1" value="${user.email1 }" required> @
				<input type="text" name="email2" id="email2" value="${user.email2 }" required>
				<select id="emailSelect">
					<option value="">이메일선택</option>
					<option value="daum.net">Daum</option>
					<option value="naver.com">Naver</option>
					<option value="gmail.com">Google</option>
					<option value="self">직접 입력</option>
				</select>
			</td>
		</tr>
		<tr>
	</tbody>
	</table>
	<hr>
	<div class="buttonDiv">
			<button type="submit">정보수정</button>
			<button type="reset"> 지우기</button>
			<button type="button" id="cancel">수정취소</button>
	</div>
	</form>
</div>
</body>
</html>