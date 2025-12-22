package com.kosta.shop.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.User;
import com.kosta.shop.entity.Wish;
import com.kosta.shop.repository.ProductRepository;
import com.kosta.shop.repository.UserRepository;
import com.kosta.shop.repository.WishRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WishService {

    private final WishRepository wishRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // 찜 토글 (true: 찜 됨, false: 찜 취소됨)
    public boolean toggleWish(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        Optional<Wish> wishOpt = wishRepository.findByUserIdAndProductId(user.getId(), product.getId());

        if (wishOpt.isPresent()) {
            wishRepository.delete(wishOpt.get()); // 이미 있으면 삭제 (취소)
            return false;
        } else {
            wishRepository.save(new Wish(user, product)); // 없으면 저장 (찜)
            return true;
        }
    }
    
    // 내가 찜한 상품인지 확인
    @Transactional(readOnly = true)
    public boolean isWished(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return wishRepository.findByUserIdAndProductId(user.getId(), productId).isPresent();
    }
}
