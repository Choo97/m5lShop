package com.kosta.shop.service;

import com.kosta.shop.dto.CartOrderDto;
import java.util.List;

public interface OrderService {
    // 장바구니 상품 주문
    Long orders(List<CartOrderDto> cartOrderDtoList, String email);
}