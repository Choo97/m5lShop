package com.kosta.shop.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.kosta.shop.dto.Goods;

@Repository
public class GoodsDaoImpl implements GoodsDao {
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<Goods> selectGoodsList() throws Exception {
		return sqlSession.selectList("mapper.goods.selectGoodsList");
	}

	@Override
	public Goods selectGoods(String gCode) throws Exception {
		return sqlSession.selectOne("mapper.goods.selectGoods", gCode);
	}
}