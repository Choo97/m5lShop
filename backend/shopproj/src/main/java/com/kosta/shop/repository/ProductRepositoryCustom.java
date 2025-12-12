package com.kosta.shop.repository;

import java.util.List;

import com.kosta.shop.entity.Product;

public interface ProductRepositoryCustom {

    List<Product> searchProducts(String category, String subCategory);

}
