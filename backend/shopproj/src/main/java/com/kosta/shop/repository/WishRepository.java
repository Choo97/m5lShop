package com.kosta.shop.repository;

import com.kosta.shop.entity.User;
import com.kosta.shop.entity.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface WishRepository extends JpaRepository<Wish, Long> {
    // 유저가 특정 상품을 찜했는지 확인
    Optional<Wish> findByUserIdAndProductId(Long userId, Long productId);
    
    // 유저의 찜 목록 조회
    List<Wish> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Wish> findAllByUserOrderByCreatedAtDesc(User user);
}