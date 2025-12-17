package com.kosta.shop.entity;

import javax.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "review_images")
public class ReviewImage extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imgName;     // 저장된 파일명
    private String oriImgName;  // 원본 파일명
    private String imgUrl;      // 이미지 경로

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;

    @Builder
    public ReviewImage(String imgName, String oriImgName, String imgUrl, Review review) {
        this.imgName = imgName;
        this.oriImgName = oriImgName;
        this.imgUrl = imgUrl;
        this.review = review;
    }
    
    // 연관관계 편의 메서드용 setter
    public void setReview(Review review) {
        this.review = review;
    }
}