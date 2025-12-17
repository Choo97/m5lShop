package com.kosta.shop.dto;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.kosta.shop.entity.Review;
import com.kosta.shop.entity.ReviewImage;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewResponseDto {
    private Long id;
    private String content;
    private int rating;
    private String writer; // 작성자 닉네임
    private String writeDate;
    private List<String> imgUrls;

    public ReviewResponseDto(Review review) {
        this.id = review.getId();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.writer = review.getUser().getNickname(); // User 엔티티에 nickname 필드 사용
        this.writeDate = review.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.imgUrls = review.getReviewImages().stream()
                .map(ReviewImage::getImgUrl)
                .collect(Collectors.toList());
    }
}