package com.kosta.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Builder
@AllArgsConstructor
public class WishDetailDto {
    private Long wishId;     // 찜 ID (삭제용)
    private Long productId;  // 상품 ID (상세 이동용)
    private String name;     // 상품명
    private int price;       // 가격
    private String imgUrl;   // 썸네일 이미지
}