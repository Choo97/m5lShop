package com.kosta.shop.repository;

import com.kosta.shop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 상품 ID로 리뷰 조회 (최신순)
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
}