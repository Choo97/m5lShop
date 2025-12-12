package com.kosta.shop.repository;

import java.util.List;

import org.springframework.util.StringUtils;

import com.kosta.shop.entity.Product;
import static com.kosta.shop.entity.QProduct.product;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepositoryCustom {

    private final JPAQueryFactory queryFactory;
	    
	@Override
	public List<Product> searchProducts(String category, String subCategory) {
		return queryFactory
                .selectFrom(product)
                .where(
                        eqCategory(category),       // 대분류 조건 (없으면 무시)
                        eqSubCategory(subCategory)  // 중분류 조건 (없으면 무시)
                )
                .orderBy(product.createdAt.desc())  // 최신순 정렬
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
}
