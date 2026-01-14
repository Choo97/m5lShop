package com.kosta.shop.repository;

import com.kosta.shop.entity.ProductImage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    // 상품 ID로 대표 이미지 찾기
    ProductImage findByProductIdAndIsRepImgTrue(Long productId);

    List<ProductImage> findByProductIdOrderByIdAsc(Long productId);
}