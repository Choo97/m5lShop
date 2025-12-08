package com.kosta.shop.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "products")
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

    // 색상 정보 (별도 테이블로 자동 생성됨)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color_hex")
    private List<String> colors = new ArrayList<>();

    @Builder
    public Product(String name, int price, int salePrice, String description, String imageUrl, String category, String subCategory, boolean isNew, boolean isBest, boolean isSale, int stockQuantity, List<String> colors) {
        this.name = name;
        this.price = price;
        this.salePrice = salePrice;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.subCategory = subCategory;
        this.isNew = isNew;
        this.isBest = isBest;
        this.isSale = isSale;
        this.stockQuantity = stockQuantity;
        this.colors = colors;
    }
}
