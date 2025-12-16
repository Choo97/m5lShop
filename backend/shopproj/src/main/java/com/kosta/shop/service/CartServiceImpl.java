package com.kosta.shop.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.kosta.shop.dto.CartDetailDto;
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
        CartItem savedCartItem = cartItemRepository.findByCartIdAndProductIdAndColor(
                cart.getId(), 
                product.getId(), 
                cartItemDto.getColor() // 색상 조건 추가
        );

        if (savedCartItem != null) {
            // 이미 같은 색상의 상품이 있으면 수량 증가
            savedCartItem.addCount(cartItemDto.getCount());
            return savedCartItem.getId();
        } else {
            // 없으면 새로 생성 (색상 정보 포함)
            CartItem cartItem = CartItem.createCartItem(
                    cart, 
                    product, 
                    cartItemDto.getCount(), 
                    cartItemDto.getColor() // ★ 색상 전달
            );
            cartItemRepository.save(cartItem);
            return cartItem.getId();
        }
    }

    @Override
    public List<CartDetailDto> getCartList(String email) {
        List<CartDetailDto> cartDetailDtoList = new ArrayList<>();

        User user = userRepository.findByEmail(email).orElse(null);
        if(user == null) return cartDetailDtoList; // 유저 없으면 빈 리스트

        Cart cart = cartRepository.findByUserId(user.getId());
        if(cart == null) return cartDetailDtoList; // 장바구니 없으면 빈 리스트

        return cartItemRepository.findCartDetailDtoList(cart.getId());
    }

    // ★ 2. 본인 확인 (수정/삭제 전 체크)
    @Override
    public boolean validateCartItem(Long cartItemId, String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElse(null);

        if(user != null && cartItem != null) {
            User savedUser = cartItem.getCart().getUser();
            return StringUtils.pathEquals(user.getEmail(), savedUser.getEmail());
        }
        return false;
    }

    // ★ 3. 수량 변경
    @Override
    @Transactional
    public void updateCartItemCount(Long cartItemId, int count) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니 아이템이 없습니다."));
        cartItem.updateCount(count); // Entity의 메소드 호출 (더티 체킹)
    }

    // ★ 4. 삭제
    @Override
    @Transactional
    public void deleteCartItem(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니 아이템이 없습니다."));
        cartItemRepository.delete(cartItem);
    }
}