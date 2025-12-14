package com.kosta.shop.repository;

import static com.kosta.shop.entity.QProduct.product;

import java.util.List;
import com.kosta.shop.repository.ProductRepositoryCustom;
import com.kosta.shop.entity.Product;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepositoryCustom {

    private final JPAQueryFactory queryFactory;
	    
    @Override
    public List<Product> searchProducts(String category, String subCategory, String type) { // type 추가
        return queryFactory
                .selectFrom(product)
                .where(
                        eqCategory(category),
                        eqSubCategory(subCategory),
                        eqType(type) // type 조건 함수 추가
                )
                .orderBy(product.createdAt.desc())
                .fetch();
    }
	private BooleanExpression eqCategory(String category) {
        // category가 null이거나 빈 문자열이면 null 반환 -> Where 절에서 자동 제외됨
        if (!StringUtils.hasText(category)) {
            return null;
        }
        return product.category.eq(category);
    }

    private BooleanExpression eqSubCategory(String subCategory) {
        if (!StringUtils.hasText(subCategory)) {
            return null;
        }
        return product.subCategory.eq(subCategory);
    }
    private BooleanExpression eqType(String type) {
        if (!StringUtils.hasText(type)) return null;
        if ("new".equals(type)) return product.isNew.isTrue();
        if ("best".equals(type)) return product.isBest.isTrue();
        if ("sale".equals(type)) return product.isSale.isTrue();
        return null;
    }
}
