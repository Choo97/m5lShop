package com.kosta.shop.repository;

import com.kosta.shop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // 특정 장바구니에 특정 상품이 이미 있는지 확인
    CartItem findByCartIdAndProductId(Long cartId, Long productId);

    // 장바구니 ID로 들어있는 모든 상품 조회 (최신순)
    // DTO로 바로 조회하는 쿼리는 다음 단계에서 DTO 만들고 작성할게요!
    List<CartItem> findByCartIdOrderByCreatedAtDesc(Long cartId);
}