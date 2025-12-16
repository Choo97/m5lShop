package com.kosta.shop.entity;

import javax.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "cart_items")
public class CartItem extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long id;

    // 어느 장바구니인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // 어떤 상품인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // 몇 개 담았는지
    private int count;
    
    // 색상 정보 저장
    private String color; 

    // 장바구니 아이템 생성 메서드
    public static CartItem createCartItem(Cart cart, Product product, int count, String color) {
        return CartItem.builder()
                .cart(cart)
                .product(product)
                .count(count)
                .color(color) // 색상 저장
                .build();
    }    

    // ★ 수량 증가 메서드 (이미 담긴 상품을 또 담았을 때)
    public void addCount(int count) {
        this.count += count;
    }

    // ★ 수량 변경 메서드 (장바구니 페이지에서 수량 변경 시)
    public void updateCount(int count) {
        this.count = count;
    }
}