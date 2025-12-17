package com.kosta.shop.dto;

import com.kosta.shop.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemDto {

	private Long id;
    private String itemNm; // 상품명
    private int count;     // 주문 수량
    private int orderPrice;// 주문 금액
    private String imgUrl; // 상품 이미지 경로

    // 생성자: 엔티티와 이미지 경로를 받아서 DTO로 변환
    public OrderItemDto(OrderItem orderItem, String imgUrl){
    	this.id = orderItem.getId();
        this.itemNm = orderItem.getProduct().getName();
        this.count = orderItem.getCount();
        this.orderPrice = orderItem.getOrderPrice();
        this.imgUrl = imgUrl;
    }
}