package com.kosta.shop.service;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.shop.dto.ReviewDto;
import com.kosta.shop.dto.ReviewResponseDto;
import com.kosta.shop.entity.OrderItem;
import com.kosta.shop.entity.Review;
import com.kosta.shop.entity.ReviewImage;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.OrderItemRepository;
import com.kosta.shop.repository.ReviewRepository;
import com.kosta.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository; // 주입 필요
    private final UserRepository userRepository;
    private final FileService fileService; 

    @Value("${uploadPath}")
    private String uploadPath;

    // 상품별 리뷰 리스트 조회
    public List<ReviewResponseDto> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewResponseDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void createReview(ReviewDto reviewDto, List<MultipartFile> files, String email) throws Exception {
        User user = userRepository.findByEmail(email).orElseThrow();
        
        // 1. 주문 상품 조회
        OrderItem orderItem = orderItemRepository.findById(reviewDto.getOrderItemId())
                .orElseThrow(() -> new EntityNotFoundException("주문 상품이 없습니다."));

        // 2. 리뷰 엔티티 생성
        Review review = Review.builder()
                .content(reviewDto.getContent())
                .rating(reviewDto.getRating())
                .product(orderItem.getProduct()) // 상품 연결
                .user(user) // 작성자 연결
                .build();

        // 3. 이미지 저장
        if(files != null && !files.isEmpty()){
            for(MultipartFile file : files){
                if(!file.isEmpty()){
                    String imgName = fileService.uploadFile(uploadPath, file.getOriginalFilename(), file.getBytes());
                    String imgUrl = "/images/" + imgName;
                    
                    ReviewImage reviewImage = ReviewImage.builder()
                            .imgName(imgName)
                            .oriImgName(file.getOriginalFilename())
                            .imgUrl(imgUrl)
                            .review(review)
                            .build();
                            
                    review.addReviewImage(reviewImage);
                }
            }
        }

        reviewRepository.save(review);
    }
}