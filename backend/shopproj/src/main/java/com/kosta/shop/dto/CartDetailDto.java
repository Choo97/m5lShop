package com.kosta.shop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CartDetailDto {

    private Long cartItemId; // 장바구니 상품 ID (수정/삭제용)
    private Long productId;
    private String name;     // 상품명
    private int price;       // 가격
    private int count;       // 담은 수량
    private String imgUrl;   // 이미지 경로
    private String color;

    public CartDetailDto(Long cartItemId, Long productId, String name, int price, int count, String imgUrl, String color) {
        this.cartItemId = cartItemId;
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.count = count;
        this.imgUrl = imgUrl;
        this.color = color;
    }
}