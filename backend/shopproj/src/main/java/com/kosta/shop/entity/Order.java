package com.kosta.shop.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter
public class Order extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 주문일 (BaseTimeEntity의 regTime 사용)

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus; // 주문 상태

    // 양방향 매핑 (Cascade: 주문 저장 시 아이템도 같이 저장)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();

    // ★ 연관관계 편의 메서드
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    // ★ 주문 생성 메서드
    public static Order createOrder(User user, List<OrderItem> orderItemList) {
        Order order = new Order();
        order.setUser(user);
        
        for(OrderItem orderItem : orderItemList) {
            order.addOrderItem(orderItem);
        }
        
        order.setOrderStatus(OrderStatus.ORDER); // 상태: 주문 완료
        return order;
    }

    // ★ 총 주문 금액 계산
    public int getTotalPrice() {
        int totalPrice = 0;
        for(OrderItem orderItem : orderItems){
            totalPrice += orderItem.getTotalPrice();
        }
        return totalPrice;
    }

    // ★ 주문 취소
    public void cancelOrder() {
        this.orderStatus = OrderStatus.CANCEL;
        for(OrderItem orderItem : orderItems) {
            orderItem.cancel(); // 각 상품마다 재고 복구
        }
    }
}