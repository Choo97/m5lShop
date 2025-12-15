package com.kosta.shop.repository;

import com.kosta.shop.dto.CartDetailDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

// Q클래스 Static Import (필수)
import static com.kosta.shop.entity.QCartItem.cartItem;
import static com.kosta.shop.entity.QProduct.product;
import static com.kosta.shop.entity.QProductImage.productImage;

@RequiredArgsConstructor
public class CartItemRepositoryImpl implements CartItemRepositoryCustom {

    private final JPAQueryFactory queryFactory;

//    장바구니 상세정보
    @Override
    public List<CartDetailDto> findCartDetailDtoList(Long cartId) {
        return queryFactory
                .select(Projections.constructor(
                        CartDetailDto.class,
                        cartItem.id,       // cartItemId
                        product.name,      // productName
                        product.price,     // price
                        cartItem.count,    // count
                        productImage.imgUrl // imgUrl
                ))
                .from(cartItem)
                .join(cartItem.product, product) // CartItem -> Product 조인
                .join(productImage).on(productImage.product.eq(product)) // Product -> ProductImage 조인
                .where(
                        cartItem.cart.id.eq(cartId),      // 해당 장바구니만
                        productImage.isRepImg.isTrue()    // 대표 이미지만
                )
                .orderBy(cartItem.createdAt.desc()) // 최신순 정렬
                .fetch();
    }
}