package com.kosta.shop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kosta.shop.entity.Product;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProductFormDto {

    private Long id;

    @NotBlank(message = "상품명은 필수 입력 값입니다.")
    private String name;

    @NotNull(message = "가격은 필수 입력 값입니다.")
    private Integer price;

    @NotBlank(message = "상세 설명은 필수 입력 값입니다.")
    private String description;

    @NotNull(message = "재고는 필수 입력 값입니다.")
    private Integer stockQuantity;

    private String category; // outer, top...
    private String subCategory; // coat, hoodie...

    // 상품 판매 상태 (NEW, BEST, SALE 등은 체크박스로 받을 예정)
    // 자바에서 변수명이 is로 시작하는 boolean (기본형) 타입은, Lombok이나 Jackson이 처리할 때 is를 떼어버리고 new라는 이름으로 JSON을 찾으려 하는 특성이 있습니다.
    @JsonProperty("isNew")
    private boolean isNew;
    @JsonProperty("isBest")
    private boolean isBest;
    @JsonProperty("isSale")
    private boolean isSale;
    private int salePrice; // 할인가
    private int repImgIndex;

    // 이미지 정보를 담을 리스트 (수정 시 필요, 등록 시에는 비어있음)
    private List<ProductImgDto> productImgDtoList = new ArrayList<>();

    // 이미지 아이디 리스트 (수정 시 이미지 식별용)
    private List<Long> productImgIds = new ArrayList<>();

    private static ModelMapper modelMapper = new ModelMapper();

    // ★ 수정: 직접 Builder로 변환 (가장 확실함)
    public Product createProduct() {
        return Product.builder()
                .name(this.name)
                .price(this.price)
                .stockQuantity(this.stockQuantity)
                .description(this.description)
                .category(this.category)
                .subCategory(this.subCategory)
                .salePrice(this.salePrice)
                .isNew(this.isNew)
                .isBest(this.isBest)
                .isSale(this.isSale)
                // ID는 신규 등록 시 null이어도 자동 생성되므로 생략 가능
                .build();
    }

    public static ProductFormDto of(Product product) {
        return modelMapper.map(product, ProductFormDto.class);
    }
}