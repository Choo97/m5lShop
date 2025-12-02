package com.kosta.shop.service;

import java.util.List;

import com.kosta.shop.dto.Goods;

public interface GoodsService {
	List<Goods> goodsList() throws Exception;
	Goods goodsRetrieve(String gCode) throws Exception;
}
