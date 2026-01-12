package com.kosta.shop.controller;

import com.kosta.shop.dto.ProductFormDto;
import com.kosta.shop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

   @PostMapping("/new")
    public ResponseEntity<String> productNew(
            @RequestPart(value = "data") @Valid ProductFormDto productFormDto,
            
            // ★ 수정: 두 개의 리스트로 분리해서 받음
            @RequestPart(value = "thumbnailFiles", required = false) List<MultipartFile> thumbnailFiles,
            @RequestPart(value = "detailFiles", required = false) List<MultipartFile> detailFiles
    ) {
        try {
            // 서비스에 두 리스트 모두 전달
            productService.saveProduct(productFormDto, thumbnailFiles, detailFiles);
            return new ResponseEntity<>("상품 등록 완료", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {
        try {
            productService.deleteProduct(productId);
            return new ResponseEntity<>("상품이 삭제되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}