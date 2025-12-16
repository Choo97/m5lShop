package com.kosta.shop.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "products")
@Builder
public class Product extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 상품명

    @Column(nullable = false)
    private int price; // 가격

    private int salePrice; // 할인가 (0이면 할인 없음)

    @Column(length = 1000)
    private String description; // 상세 설명

    private String imageUrl; // 대표 이미지 URL

    // 카테고리 (대분류: outer, top... / 중분류: coat, hoodie...)
    private String category;
    private String subCategory;

    // 상태 플래그 (메인 페이지 노출용)
    private boolean isNew;
    private boolean isBest;
    private boolean isSale;

    private int stockQuantity; // 재고
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default 
    private List<ProductImage> productImages = new ArrayList<>();

    // 색상 정보 (별도 테이블로 자동 생성됨)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color_hex")
    @Builder.Default 
    private List<String> colors = new ArrayList<>();

 // 재고 증가 (주문 취소 시)
    public void addStock(int quantity){
        this.stockQuantity += quantity;
    }

    // 재고 감소 (주문 시)
    public void removeStock(int quantity){
        int restStock = this.stockQuantity - quantity;
        if(restStock < 0){
            // 사용자 정의 예외를 만들면 좋지만, 일단 RuntimeException 사용
            throw new RuntimeException("상품의 재고가 부족합니다. (현재 재고: " + this.stockQuantity + ")");
        }
        this.stockQuantity = restStock;
    }
    
}
