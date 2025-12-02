package com.kosta.shop.dao;

import java.util.List;

import com.kosta.shop.dto.Goods;

public interface GoodsDao {
	List<Goods> selectGoodsList() throws Exception;
	Goods selectGoods(String gCode) throws Exception;
}
