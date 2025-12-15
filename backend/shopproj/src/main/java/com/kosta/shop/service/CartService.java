package com.kosta.shop.service;

import java.util.List;

import com.kosta.shop.dto.CartDetailDto;
import com.kosta.shop.dto.CartItemDto;

public interface CartService {
    // 장바구니에 상품 추가
    Long addCart(CartItemDto cartItemDto, String email);
    List<CartDetailDto> getCartList(String email); // 목록 조회
    boolean validateCartItem(Long cartItemId, String email); // 본인 장바구니인지 확인
    void updateCartItemCount(Long cartItemId, int count); // 수량 수정
    void deleteCartItem(Long cartItemId); // 삭제
}