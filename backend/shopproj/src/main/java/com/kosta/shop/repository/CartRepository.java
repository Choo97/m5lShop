package com.kosta.shop.repository;

import com.kosta.shop.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // 유저 ID로 장바구니 찾기
    Cart findByUserId(Long userId);
}