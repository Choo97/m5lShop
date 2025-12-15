package com.kosta.shop.repository;

import com.kosta.shop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long>, CartItemRepositoryCustom {
    
    // 특정 장바구니에 특정 상품이 이미 있는지 확인
    CartItem findByCartIdAndProductId(Long cartId, Long productId);

}