package com.kosta.shop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kosta.shop.dto.Goods;

@Service
public class GoodsServiceImpl implements GoodsService {

	@Override
	public List<Goods> goodsList() throws Exception {
		return null; // goodsDao.selectGoodsList();
	}
	@Override
	public Goods goodsRetrieve(String gCode) throws Exception {
		return null; // goodsDao.selectGoods(gCode);
	}
}
