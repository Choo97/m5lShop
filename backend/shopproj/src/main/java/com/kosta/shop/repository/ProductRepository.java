package com.kosta.shop.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kosta.shop.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>, ProductRepositoryCustom {

	// 1. 신상품 (최신순 8개)
    List<Product> findTop8ByIsNewTrueOrderByCreatedAtDesc();

    // 2. 특가상품 (최신순 8개)
    List<Product> findTop8ByIsSaleTrueOrderByCreatedAtDesc();

    /**
     * 연령대별 인기상품 조회 쿼리
     * 로직: OrderItem -> Order -> User를 조인해서
     * User의 생일이 startDate와 endDate 사이인 주문 건들을 찾고,
     * 상품별로 그룹핑(GROUP BY)해서 개수(COUNT)가 많은 순서대로 정렬
     */
    @Query("SELECT oi.product FROM OrderItem oi " +
           "WHERE oi.order.user.birthDate BETWEEN :startDate AND :endDate " +
           "GROUP BY oi.product " +
           "ORDER BY COUNT(oi) DESC")
    List<Product> findBestProductsByAge(@Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate, 
                                        Pageable pageable);
    
    // 4. (주문 데이터 없을 때용) 일반 인기상품 8개
    List<Product> findTop8ByIsBestTrueOrderByCreatedAtDesc();


}
