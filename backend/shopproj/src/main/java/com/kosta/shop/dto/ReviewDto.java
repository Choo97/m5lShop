package com.kosta.shop.dto;

import lombok.Data;

@Data
public class ReviewDto {
    private Long orderItemId; // 어떤 주문상품에 대한 리뷰인지
    private String content;
    private int rating;
}