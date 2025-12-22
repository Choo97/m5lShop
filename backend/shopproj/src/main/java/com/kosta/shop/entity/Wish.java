package com.kosta.shop.entity;

import javax.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "wishes", 
       uniqueConstraints = { // 중복 찜 방지 (한 유저가 같은 상품을 두 번 찜 못함)
           @UniqueConstraint(columnNames = {"user_id", "product_id"})
       })
public class Wish extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Builder
    public Wish(User user, Product product) {
        this.user = user;
        this.product = product;
    }
}