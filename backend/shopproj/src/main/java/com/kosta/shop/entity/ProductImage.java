package com.kosta.shop.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product_images")
public class ProductImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imgName; // 이미지 파일명 (예: uuid_coat.jpg)

    private String oriImgName; // 원본 파일명 (예: coat.jpg)

    private String imgUrl; // 이미지 조회 경로 (예: /images/item/uuid_coat.jpg)

    private boolean isRepImg; // 대표 이미지 여부 (true면 썸네일)

    private boolean isDetailImg;  // 상세 설명 이미지 여부 (true면 상세설명이미지, 아니면 상단 이미지)

    // 어떤 상품의 이미지인지 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    public void updateProduct(Product product) {
        this.product = product;
    }

    @Builder
    public ProductImage(String imgName, String oriImgName, String imgUrl, boolean isRepImg, boolean isDetailImg, Product product) {
        this.imgName = imgName;
        this.oriImgName = oriImgName;
        this.imgUrl = imgUrl;
        this.isRepImg = isRepImg;
        this.isDetailImg = isDetailImg;
        this.product = product;
    }
}