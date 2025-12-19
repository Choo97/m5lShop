package com.kosta.shop.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "stylings")
public class Styling extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "styling_id")
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content; // 내용

    private String imageUrl; // 스타일링 사진 URL

    private int viewCount; // 조회수 (추후 확장용)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToMany(mappedBy = "styling", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StylingProduct> stylingProducts = new ArrayList<>();

    @Builder
    public Styling(String content, String imageUrl, User user) {
        this.content = content;
        this.imageUrl = imageUrl;
        this.user = user;
        this.viewCount = 0;
    }
    
    public void addProduct(Product product) {
        StylingProduct stylingProduct = StylingProduct.builder()
                .styling(this)
                .product(product)
                .build();
        this.stylingProducts.add(stylingProduct);
    }
}