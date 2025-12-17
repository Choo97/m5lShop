package com.kosta.shop.dto;

import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponseDto {

    private Long id;
    private String name;
    private int price;
    private int salePrice;
    private int discountRate;
    private String description; // 상세 설명 포함
    private String category;
    private String subCategory;
    
    private boolean isSoldOut;
    private boolean isNew;
    private boolean isBest;
    private boolean isSale;
    
    private List<String> colors;
    
    // ★ 상세 페이지용: 모든 이미지 리스트
    private List<String> productImages; 
    private List<String> detailImages;  // 하단 상세설명용 (isDetailImg == true)

    public static ProductDetailResponseDto from(Product product) {
        int rate = 0;
        if (product.isSale() && product.getPrice() > 0) {
            rate = (int) ((product.getPrice() - product.getSalePrice()) / (double) product.getPrice() * 100);
        }

     // 1. 상단 갤러리 이미지 (상세 이미지가 아닌 것들)
        List<String> galleryImages = product.getProductImages().stream()
                .filter(img -> !img.isDetailImg()) 
                .map(ProductImage::getImgUrl)
                .collect(Collectors.toList());

        // 2. 하단 상세 설명 이미지 (상세 이미지인 것들)
        List<String> descImages = product.getProductImages().stream()
                .filter(ProductImage::isDetailImg)
                .map(ProductImage::getImgUrl)
                .collect(Collectors.toList());

        return ProductDetailResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .salePrice(product.getSalePrice())
                .discountRate(rate)
                .description(product.getDescription())
                .category(product.getCategory())
                .subCategory(product.getSubCategory())
                .isSoldOut(product.getStockQuantity() <= 0)
                .isNew(product.isNew())
                .isBest(product.isBest())
                .isSale(product.isSale())
                .colors(product.getColors())
                .productImages(galleryImages) // 분리해서 저장
                .detailImages(descImages)     // 분리해서 저장
                .build();
    }
}