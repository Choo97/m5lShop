package com.kosta.shop.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.dto.ProductDetailResponseDto;
import com.kosta.shop.dto.ProductResponseDto;
import com.kosta.shop.entity.Product;
import com.kosta.shop.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    
	@Override
	public List<ProductResponseDto> getBestProductsByAge(int age) {
		 // 1. 현재 연도 구하기
        int currentYear = LocalDate.now().getYear();

        // 2. 나이대로 생년월일 범위 계산 (만 나이 기준 약식 계산)
        // 예: 20대 (age=20) -> 2004년생(end) ~ 1995년생(start)
        int endYear = currentYear - age; 
        int startYear = endYear - 9; 

        LocalDate startDate = LocalDate.of(startYear, 1, 1);
        LocalDate endDate = LocalDate.of(endYear, 12, 31);

        // 3. 쿼리 실행 (상위 8개만 가져오기)
        Pageable limit = PageRequest.of(0, 8);
        List<Product> products = productRepository.findBestProductsByAge(startDate, endDate, limit);

        // 4. DTO 변환 후 리턴
        return products.stream()
                .map(ProductResponseDto::from)
                .collect(Collectors.toList());
    }

	@Override
	public List<ProductResponseDto> getProductList(String category, String subCategory, String type, String keyword) {
		// QueryDSL로 만든 동적 쿼리 메소드 호출
        List<Product> products = productRepository.searchProducts(category, subCategory, type, keyword);

        return products.stream()
                .map(ProductResponseDto::from)
                .collect(Collectors.toList());
    }

	@Override
    public ProductDetailResponseDto getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        
        return ProductDetailResponseDto.from(product);
    }

	@Override
    public List<ProductResponseDto> getMainNewProducts() {
        return productRepository.findTop8ByIsNewTrueOrderByCreatedAtDesc().stream()
                .map(ProductResponseDto::from)
                .collect(Collectors.toList());
    }

	@Override
    public List<ProductResponseDto> getMainSaleProducts() {
        return productRepository.findTop8ByIsSaleTrueOrderByCreatedAtDesc().stream()
                .map(ProductResponseDto::from)
                .collect(Collectors.toList());
    }

	@Override
    public List<ProductResponseDto> getMainBestProductsByAge(int age) {
        // 나이로 생년월일 범위 계산 (한국 나이 기준 단순 계산)
        int currentYear = LocalDate.now().getYear();
        int endYear = currentYear - age + 1; 
        int startYear = endYear - 9;         

        LocalDate startDate = LocalDate.of(startYear, 1, 1);
        LocalDate endDate = LocalDate.of(endYear, 12, 31);

        // 상위 8개만 조회
        Pageable limit = PageRequest.of(0, 8);
        List<Product> products = productRepository.findBestProductsByAge(startDate, endDate, limit);

        // 데이터가 없으면 일반 Best 상품으로 대체 (Fallback)
        if (products.isEmpty()) {
            products = productRepository.findTop8ByIsBestTrueOrderByCreatedAtDesc();
        }

        return products.stream()
                .map(ProductResponseDto::from)
                .collect(Collectors.toList());
    }

}
