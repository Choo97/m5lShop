package com.kosta.shop.dao;

import java.util.List;
import java.util.Map;

import com.kosta.shop.dto.Cart;
import com.kosta.shop.dto.Order;
import com.kosta.shop.dto.OrderInfo;

public interface CartDao {
	void insertCart(Cart cart) throws Exception;
	List<Cart> selectCartList(String userid) throws Exception;
	List<Cart> selectCheckCart(List<Integer> list) throws Exception;
	Cart selectCart(Integer num) throws Exception;
	void delectMultiCart(List<Integer> list) throws Exception;
	void deleteCart(Integer num) throws Exception;
	void updateCart(Map<String,Integer> param) throws Exception;
	void insertOrder(Order order) throws Exception;
	void insertOrderInfo(OrderInfo orderInfo) throws Exception;
}
