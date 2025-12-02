package com.kosta.shop.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.kosta.shop.dto.Member;

@Repository
public class MemberDaoImpl implements MemberDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public void insertMember(Member member) throws Exception {
		sqlSession.insert("mapper.member.insertMember", member);
	}

	@Override
	public Member selectMember(String userid) throws Exception {
		return sqlSession.selectOne("mapper.member.selectMember", userid);
	}

	@Override
	public Integer idCheck(String userid) throws Exception {
		return sqlSession.selectOne("mapper.member.idCheck", userid);
	}

	@Override
	public void updateMember(Member member) throws Exception {
		sqlSession.update("mapper.member.updateMember", member);
	}
}
