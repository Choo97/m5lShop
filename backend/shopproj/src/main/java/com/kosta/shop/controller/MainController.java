package com.kosta.shop.controller;

import com.kosta.shop.dto.ProductResponseDto;
import com.kosta.shop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/main")
@RequiredArgsConstructor
public class MainController {

    private final ProductService productService;

    // 신상품 (GET /api/main/new)
    @GetMapping("/new")
    public ResponseEntity<List<ProductResponseDto>> getNewProducts() {
        return ResponseEntity.ok(productService.getMainNewProducts());
    }

    // 특가상품 (GET /api/main/sale)
    @GetMapping("/sale")
    public ResponseEntity<List<ProductResponseDto>> getSaleProducts() {
        return ResponseEntity.ok(productService.getMainSaleProducts());
    }

    // 연령대별 인기상품 (GET /api/main/best?age=20)
    @GetMapping("/best")
    public ResponseEntity<List<ProductResponseDto>> getBestProducts(@RequestParam(defaultValue = "20") int age) {
        return ResponseEntity.ok(productService.getMainBestProductsByAge(age));
    }
}