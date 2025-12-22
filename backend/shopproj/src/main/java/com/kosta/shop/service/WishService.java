package com.kosta.shop.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.dto.WishDetailDto;
import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.ProductImage;
import com.kosta.shop.entity.User;
import com.kosta.shop.entity.Wish;
import com.kosta.shop.repository.ProductImageRepository;
import com.kosta.shop.repository.ProductRepository;
import com.kosta.shop.repository.UserRepository;
import com.kosta.shop.repository.WishRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishService {

    private final WishRepository wishRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    // 찜 토글 (true: 찜 됨, false: 찜 취소됨)
    @Transactional
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
    public boolean isWished(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return wishRepository.findByUserIdAndProductId(user.getId(), productId).isPresent();
    }

    public List<WishDetailDto> getWishList(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Wish> wishes = wishRepository.findAllByUserOrderByCreatedAtDesc(user);
        
        List<WishDetailDto> wishDtos = new ArrayList<>();
        
        for (Wish wish : wishes) {
            // 대표 이미지 찾기
            ProductImage img = productImageRepository.findByProductIdAndIsRepImgTrue(wish.getProduct().getId());
            String imgUrl = (img != null) ? img.getImgUrl() : "";

            WishDetailDto dto = WishDetailDto.builder()
                    .wishId(wish.getId())
                    .productId(wish.getProduct().getId())
                    .name(wish.getProduct().getName())
                    .price(wish.getProduct().getPrice())
                    .imgUrl(imgUrl)
                    .build();
            
            wishDtos.add(dto);
        }
        return wishDtos;
    }
    
    public void deleteWish(Long wishId) {
        wishRepository.deleteById(wishId);
    }
}
