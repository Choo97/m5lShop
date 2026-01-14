package com.kosta.shop.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kosta.shop.dto.ProductDetailResponseDto;
import com.kosta.shop.dto.ProductFormDto;
import com.kosta.shop.dto.ProductResponseDto;

public interface ProductService {
    public List<ProductResponseDto> getBestProductsByAge(int age);

    public List<ProductResponseDto> getProductList(String category, String subCategory, String type, String keyword);

    public ProductDetailResponseDto getProductDetail(Long id);

    public List<ProductResponseDto> getMainNewProducts();

    public List<ProductResponseDto> getMainSaleProducts();

    public List<ProductResponseDto> getMainBestProductsByAge(int age);

    public Long saveProduct(ProductFormDto productFormDto,
            List<MultipartFile> thumbnailFiles,
            List<MultipartFile> detailFiles) throws Exception;

    public void deleteProduct(Long productId);

    public ProductFormDto getProductDtl(Long productId);

    public Long updateProduct(ProductFormDto productFormDto, List<MultipartFile> itemImgFileList) throws Exception;

}