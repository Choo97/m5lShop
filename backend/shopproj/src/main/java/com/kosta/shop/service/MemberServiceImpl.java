package com.kosta.shop.service;

import org.springframework.stereotype.Service;

import com.kosta.shop.dto.Member;

@Service
public class MemberServiceImpl implements MemberService {

	@Override
	public void signUp(Member member) throws Exception {
		// memberDao.insertMember(member);		
	}

	@Override
	public Boolean idCheck(String userid) throws Exception {
		Integer cnt = 0; //memberDao.idCheck(userid);
		return cnt!=0;
	}

	@Override
	public Member login(String userid, String passwd) throws Exception {
		Member member = null; // memberDao.selectMember(userid);
		if(member==null) throw new Exception("아이디 오류");
		if(!member.getPasswd().equals(passwd)) throw new Exception("비밀번호 오류");
		return member;
	}

	@Override
	public void modifyMyPage(Member member) throws Exception {
		if(member.getPasswd().equals(member.getUserid())) {
			member.setPasswd(null);
		}
		// memberDao.updateMember(member);
	}

	@Override
	public Member myPage(String userid) throws Exception {
		return null; // memberDao.selectMember(userid);
	}
}
