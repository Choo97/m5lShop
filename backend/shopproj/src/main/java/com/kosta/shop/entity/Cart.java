package com.kosta.shop.entity;

import javax.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "carts")
public class Cart extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;

    // 유저와 1:1 관계 (유저 한 명당 장바구니 하나)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // ★ 유저에게 장바구니 생성하는 정적 메서드
    public static Cart createCart(User user) {
        return Cart.builder()
                .user(user)
                .build();
    }
}