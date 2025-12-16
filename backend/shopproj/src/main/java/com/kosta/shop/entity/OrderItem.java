package com.kosta.shop.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "order_item")
public class OrderItem extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    private int orderPrice; // 주문 당시 가격 (할인 등이 적용될 수 있으므로)
    private int count;      // 수량

    // ★ 생성 메서드: 주문할 때 상품 재고를 감소시킴
    public static OrderItem createOrderItem(Product product, int count) {
        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setCount(count);
        
        // 주문 당시의 가격 (할인가가 있으면 할인가, 없으면 정가)
        int price = (product.getSalePrice() > 0) ? product.getSalePrice() : product.getPrice();
        orderItem.setOrderPrice(price);

        product.removeStock(count); // 재고 감소 로직 호출
        return orderItem;
    }

    // ★ 주문 가격 계산 (가격 * 수량)
    public int getTotalPrice() {
        return orderPrice * count;
    }

    // ★ 주문 취소 시 재고 복구
    public void cancel() {
        this.getProduct().addStock(count); // Product 엔티티에 addStock 메소드 필요
    }
}