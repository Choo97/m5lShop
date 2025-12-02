package com.kosta.shop.service;

import com.kosta.shop.dto.Member;

public interface MemberService {
	void signUp(Member member) throws Exception;
	Boolean idCheck(String userid) throws Exception;
	Member login(String userid, String passwd) throws Exception;
	void modifyMyPage(Member member) throws Exception;
	Member myPage(String userid) throws Exception;
}
