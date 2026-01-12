// ProductImgDto.java
package com.kosta.shop.dto;

import com.kosta.shop.entity.ProductImage;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;

@Getter
@Setter
public class ProductImgDto {
    private Long id;
    private String imgName;
    private String oriImgName;
    private String imgUrl;
    private boolean isRepImg;
    private static ModelMapper modelMapper = new ModelMapper();

    public static ProductImgDto of(ProductImage productImage) {
        return modelMapper.map(productImage, ProductImgDto.class);
    }
}