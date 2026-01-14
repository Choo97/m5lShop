package com.kosta.shop.service;

import java.util.List;

import com.kosta.shop.dto.CartOrderDto;
import com.kosta.shop.dto.OrderHistDto;

public interface OrderService {
    // 장바구니 상품 주문
    public Long orders(List<CartOrderDto> cartOrderDtoList, String email);
    
    public List<OrderHistDto> getOrderList(String email);

    public List<OrderHistDto> getAllOrders();

    public void cancelOrder(Long orderId);
}