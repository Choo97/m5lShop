package com.kosta.shop.repository;

import com.kosta.shop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long>, CartItemRepositoryCustom {
    
    // 특정 장바구니 상품ID + 색상까지 같아야 장바구니에 담김
    CartItem findByCartIdAndProductIdAndColor(Long cartId, Long productId, String color);

}