package com.kosta.shop.service;

import java.util.List;

import com.kosta.shop.dto.Cart;
import com.kosta.shop.dto.Order;
import com.kosta.shop.dto.OrderInfo;

public interface CartService {
	void addCart(Cart cart) throws Exception;
	List<Cart> cartList(String userid) throws Exception;
	List<Cart> orderAllConfirm(List<Integer> list) throws Exception;
	Cart cartRetrieve(Integer num) throws Exception;
	void cartDeleteAll(List<Integer> list) throws Exception;
	void cartDelete(Integer num) throws Exception;
	void cartAmountUpdate(Integer num, Integer gAmount) throws Exception;
	void orderDone(OrderInfo orderInfo, Order order, Integer orderNum) throws Exception;
	List<Order> orderAllDone(OrderInfo orderInfo, List<Integer> nums) throws Exception;
}
