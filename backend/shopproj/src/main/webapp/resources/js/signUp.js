
	$(document).ready(function() {
		var checked="N";
		//아이디 중복 체크
		$("#checkId").click(function() {	
			$.ajax({
				url : 'idCheck',
				type : 'get',
				data : {
					id : $("#userid").val(),
					pw : '1234'
				},
				dataType : 'text', 
				success : function(responseData, status, xhr) {	
					var message = $("#idMessage");
					if(responseData=="사용가능"){
						message.css("color", "blue");
						checked = "Y";
					}else{
						message.css("color", "red");
						checked = "N";
					}				
					message.text(responseData);					
				},
				error : function(xhr, status, error) {
				}
			});			
		});
		
		//이메일 선택 처리
		$("#emailSelect").change(function() {
			var mailHost = $(this).val();
			if (mailHost == "self") {
				$("#email2").focus().val("");
			} else {
				$("#email2").val(mailHost);
			}
		});
		
		//다음 우편번호 검색 처리
		$("#calldaumPostCode").click(daumPostcode);
		
		//패스워드, 패스워드 확인 처리
		$("#passwdConfirm").blur(function(){			
			let message = $("#passwordMessage");
			
			if($(this).val()==$("#passwd").val()){
				message.css("color", "blue").text("일치");					
			}else{				
				message.css("color", "red").text("비밀번호확인");
			}
		});
		
		$("#postcode").focus(function(){
			$("#calldaumPostCode").click();
		});
		
		$(document.forms[0]).submit(function(){		
			if(checked !="Y"){
				alert("아이디 중복 확인이 필요합니다.");
				return false;
			}	
			if($("#passwd").val() == $("#passwdConfirm").val()){				
				return;
			}
			$("#passwordMessage").css("color", "red").text("비밀번호 확인");
			alert("비밀번호가 일치하지 않습니다. 비밀번호를 확인해 주세요.");
			return false;
			
		});
		
		$("#cancel").click(function(){			
			location.href="/shop";
		});
		
	});

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
