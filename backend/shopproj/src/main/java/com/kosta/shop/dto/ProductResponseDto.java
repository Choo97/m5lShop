package com.kosta.shop.dto;

import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {

    private Long id;
    private String name;
    private int price;          // 정가
    private int salePrice;      // 할인가
    private int discountRate;   // 할인율 (계산해서 내려줌)
    
    private String imageUrl;    // 대표 이미지 URL (썸네일)
    private String category;    // 대분류
    private String subCategory; // 중분류
    
    private List<String> colors; // 색상 정보 (예: ["#000000", "#FFFFFF"])
    
    // 상태 플래그 (뱃지 표시용)
    private boolean isNew;
    private boolean isBest;
    private boolean isSale;
    private boolean isSoldOut;  // 품절 여부 (재고 확인)

    // ★ Entity -> DTO 변환 메서드 (핵심 로직)
    public static ProductResponseDto from(Product product) {
        
        // 1. 할인율 계산 로직
        int rate = 0;
        if (product.isSale() && product.getPrice() > 0 && product.getSalePrice() > 0) {
            // 공식: (정가 - 할인가) / 정가 * 100
            rate = (int) ((product.getPrice() - product.getSalePrice()) / (double) product.getPrice() * 100);
        }

        // 2. 대표 이미지(썸네일) 추출 로직
        // ProductImage 리스트 중에서 isRepImg가 true인 것의 url을 가져옴
        String thumbnail = "";
        if (product.getProductImages() != null && !product.getProductImages().isEmpty()) {
            thumbnail = product.getProductImages().stream()
                    .filter(ProductImage::isRepImg) // 대표 이미지만 필터링
                    .findFirst()
                    .map(ProductImage::getImgUrl)
                    .orElse(product.getProductImages().get(0).getImgUrl()); // 없으면 첫 번째 이미지
        }

        // 3. 품절 여부 확인
        boolean soldOut = product.getStockQuantity() <= 0;

        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .salePrice(product.getSalePrice())
                .discountRate(rate) // 계산된 할인율
                .imageUrl(thumbnail) // 추출된 이미지 URL
                .category(product.getCategory())
                .subCategory(product.getSubCategory())
                .colors(product.getColors()) // List<String> 그대로 복사
                .isNew(product.isNew())
                .isBest(product.isBest())
                .isSale(product.isSale())
                .isSoldOut(soldOut) // 품절 여부
                .build();
    }
}