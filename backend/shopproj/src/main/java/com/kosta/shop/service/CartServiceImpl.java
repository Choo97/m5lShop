package com.kosta.shop.service;

import com.kosta.shop.dto.CartItemDto;
import com.kosta.shop.entity.Cart;
import com.kosta.shop.entity.CartItem;
import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.CartItemRepository;
import com.kosta.shop.repository.CartRepository;
import com.kosta.shop.repository.ProductRepository;
import com.kosta.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 1. 기본적으로 읽기 전용 모드로 설정 (조회 성능 최적화)
public class CartServiceImpl implements CartService { // ★ 인터페이스 구현

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional  //데이터 변경(Insert, Update)이 일어나는 곳이므로 readOnly = false (기본값) 적용
    public Long addCart(CartItemDto cartItemDto, String email) {

        // 1. 장바구니에 담을 상품 조회
        Product product = productRepository.findById(cartItemDto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));

        // 2. 현재 로그인한 회원 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("회원이 존재하지 않습니다."));

        // 3. 회원의 장바구니 조회
        Cart cart = cartRepository.findByUserId(user.getId());

        // 4. 장바구니가 없으면 처음 생성
        if (cart == null) {
            cart = Cart.createCart(user);
            cartRepository.save(cart);
        }

        // 5. 해당 상품이 장바구니에 이미 있는지 확인
        CartItem savedCartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (savedCartItem != null) {
            // 6-A. 이미 있다면 수량만 증가
            savedCartItem.addCount(cartItemDto.getCount());
            return savedCartItem.getId();
        } else {
            // 6-B. 없다면 새로 생성해서 저장
            CartItem cartItem = CartItem.createCartItem(cart, product, cartItemDto.getCount());
            cartItemRepository.save(cartItem);
            return cartItem.getId();
        }
    }
}