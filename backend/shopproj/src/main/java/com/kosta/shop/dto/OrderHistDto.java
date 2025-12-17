package com.kosta.shop.dto;

import com.kosta.shop.entity.Order;
import com.kosta.shop.entity.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class OrderHistDto {

    private Long orderId; // 주문 아이디
    private String orderDate; // 주문 날짜 (yyyy-MM-dd HH:mm)
    private OrderStatus orderStatus; // 주문 상태
    
    // 주문 상품 리스트
    private List<OrderItemDto> orderItemDtoList = new ArrayList<>();

    public OrderHistDto(Order order){
        this.orderId = order.getId();
        // BaseTimeEntity의 createdAt을 포맷팅해서 문자열로 저장
        this.orderDate = order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        this.orderStatus = order.getOrderStatus();
    }

    // 상품 DTO를 리스트에 추가하는 메서드
    public void addOrderItemDto(OrderItemDto orderItemDto){
        orderItemDtoList.add(orderItemDto);
    }
}