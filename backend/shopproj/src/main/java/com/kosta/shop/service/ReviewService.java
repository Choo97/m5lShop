package com.kosta.shop.service;

import com.kosta.shop.dto.ReviewResponseDto;
import com.kosta.shop.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // 상품별 리뷰 리스트 조회
    public List<ReviewResponseDto> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
    }
}