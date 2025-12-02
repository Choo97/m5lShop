package com.kosta.shop.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.kosta.shop.dto.Cart;
import com.kosta.shop.dto.Order;
import com.kosta.shop.dto.OrderInfo;

@Repository
public class CartDaoImpl implements CartDao {
	
	@Autowired
	private SqlSession sqlSession;

	@Override
	public void insertCart(Cart cart) throws Exception {
		sqlSession.insert("mapper.cart.insertCart", cart);
	}

	@Override
	public List<Cart> selectCartList(String userid) throws Exception {
		return sqlSession.selectList("mapper.cart.selectCartList", userid);
	}

	@Override
	public void delectMultiCart(List<Integer> list) throws Exception {
		sqlSession.delete("mapper.cart.delectMultiCart", list);
	}

	@Override
	public void deleteCart(Integer num) throws Exception {
		sqlSession.delete("mapper.cart.deleteCart", num);
	}

	@Override
	public void updateCart(Map<String, Integer> param) throws Exception {
		sqlSession.update("mapper.cart.updateCart", param);
	}

	@Override
	public Cart selectCart(Integer num) throws Exception {
		// TODO Auto-generated method stub
		return sqlSession.selectOne("mapper.cart.selectCart",num);
	}

	@Override
	public List<Cart> selectCheckCart(List<Integer> list) throws Exception {
		return sqlSession.selectList("mapper.cart.selectCheckCart", list);
	}

	@Override
	public void insertOrder(Order order) throws Exception {
		sqlSession.insert("mapper.cart.insertOrder", order);
	}

	@Override
	public void insertOrderInfo(OrderInfo orderInfo) throws Exception {
		sqlSession.insert("mapper.cart.insertOrderInfo",orderInfo);
	}
}
