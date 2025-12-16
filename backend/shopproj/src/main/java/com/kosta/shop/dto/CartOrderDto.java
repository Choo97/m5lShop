package com.kosta.shop.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CartOrderDto {
    private Long cartItemId;
    
    // (선택사항) 만약 장바구니 화면에서 수량을 바꿔서 바로 주문한다면 count 필드도 필요하지만,
    // 보통은 장바구니에 저장된 수량 그대로 주문하므로 ID만 있으면 됩니다.
}