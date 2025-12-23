package com.kosta.shop.service;

import java.util.List;

import com.kosta.shop.dto.ProductDetailResponseDto;
import com.kosta.shop.dto.ProductResponseDto;

public interface ProductService {
	public List<ProductResponseDto> getBestProductsByAge(int age);
	
    public List<ProductResponseDto> getProductList(String category, String subCategory, String type, String keyword);

    public ProductDetailResponseDto getProductDetail(Long id);

    public List<ProductResponseDto> getMainNewProducts();
    
    public List<ProductResponseDto> getMainSaleProducts();
    
    public List<ProductResponseDto> getMainBestProductsByAge(int age);
}
