package com.kosta.shop.controller;

import com.kosta.shop.dto.ProductResponseDto;
import com.kosta.shop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getProducts(
            @RequestParam(required = false) String category,      // required=false: 파라미터가 없어도 됨
            @RequestParam(required = false, name = "sub") String subCategory // URL엔 sub, 코드엔 subCategory
    ) {
        List<ProductResponseDto> list = productService.getProductList(category, subCategory);
        return ResponseEntity.ok(list);
    }
}