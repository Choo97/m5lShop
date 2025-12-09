package com.kosta.shop.service;

import java.util.List;

import com.kosta.shop.dto.ProductResponseDto;

public interface ProductService {
	List<ProductResponseDto> getBestProductsByAge(int age);
}
