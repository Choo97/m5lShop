package com.kosta.shop.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kosta.shop.dao.CartDao;
import com.kosta.shop.dto.Cart;
import com.kosta.shop.dto.Order;
import com.kosta.shop.dto.OrderInfo;

@Service
public class CartServiceImpl implements CartService {
	
	@Autowired
	private CartDao cartDao;

	@Override
	public void addCart(Cart cart) throws Exception {
		cartDao.insertCart(cart);
	}

	@Override
	public List<Cart> cartList(String userid) throws Exception {
		return cartDao.selectCartList(userid);
	}

	@Override
	public void cartDeleteAll(List<Integer> list) throws Exception {
		cartDao.delectMultiCart(list);
	}

	@Override
	public void cartDelete(Integer num) throws Exception {
		cartDao.deleteCart(num);
	}

	@Override
	public void cartAmountUpdate(Integer num, Integer gAmount) throws Exception {
		Map<String,Integer> param = new HashMap<>();
		param.put("num", num);
		param.put("gAmount", gAmount);
		cartDao.updateCart(param);
	}

	@Override
	public Cart cartRetrieve(Integer num) throws Exception {
		return cartDao.selectCart(num);
	}

	@Override
	public List<Cart> orderAllConfirm(List<Integer> list) throws Exception {
		return cartDao.selectCheckCart(list);
	}

	@Override
	public void orderDone(OrderInfo orderInfo, Order order, Integer orderNum) throws Exception {
		cartDao.insertOrderInfo(orderInfo);
		order.setOrderinfo_num(orderInfo.getNum());
		cartDao.insertOrder(order);
		if(orderNum != null) {
			cartDao.deleteCart(orderNum);
		}
	}

	@Override
	public List<Order> orderAllDone(OrderInfo orderInfo, List<Integer> nums) throws Exception {
		cartDao.insertOrderInfo(orderInfo);
		List<Cart> checkCart = cartDao.selectCheckCart(nums);
		List<Order> orderList = new ArrayList<>();
		for(Cart cart : checkCart) {
			Order order = new Order();
			order.setUserid(cart.getUserid());
			order.setgCode(cart.getgCode());
			order.setgName(cart.getgName());
			order.setgPrice(cart.getgPrice());
			order.setgSize(cart.getgSize());
			order.setgColor(cart.getgColor());
			order.setgAmount(cart.getgAmount());
			order.setgImage(cart.getgImage());
			order.setOrderinfo_num(orderInfo.getNum());
			cartDao.insertOrder(order);
			cartDao.deleteCart(cart.getNum());
			orderList.add(order);
		}
		return orderList;
	}
}
