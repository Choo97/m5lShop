package com.kosta.shop.service;

import com.kosta.shop.dto.CartItemDto;

public interface CartService {
    // 장바구니에 상품 추가
    Long addCart(CartItemDto cartItemDto, String email);
}