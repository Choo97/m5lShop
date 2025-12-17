package com.kosta.shop.controller;

import com.kosta.shop.dto.ReviewResponseDto;
import com.kosta.shop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 상품 상세 페이지용 리뷰 조회
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDto>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }
}