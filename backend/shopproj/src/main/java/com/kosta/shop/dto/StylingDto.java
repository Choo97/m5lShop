package com.kosta.shop.dto;

import com.kosta.shop.entity.Styling;
import com.kosta.shop.entity.StylingProduct;
import lombok.Builder;
import lombok.Data;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

public class StylingDto {

    @Data
    public static class Request {
        private String content;
        private List<Long> productIds; // ★ 추가: 태그할 상품 ID 리스트
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private String content;
        private String imageUrl;
        private String nickname;
        private String profileImage;
        private String date;
        
        // ★ 추가: 태그된 상품 정보 (간단하게)
        private List<TagResponse> tags;

        public static Response from(Styling styling) {
            List<TagResponse> tagList = styling.getStylingProducts().stream()
                .map(sp -> TagResponse.builder()
                        .productId(sp.getProduct().getId())
                        .name(sp.getProduct().getName())
                        .price(sp.getProduct().getPrice())
                        .build())
                .collect(Collectors.toList());

            return Response.builder()
                    .id(styling.getId())
                    .content(styling.getContent())
                    .imageUrl(styling.getImageUrl())
                    .nickname(styling.getUser().getNickname())
                    .profileImage(styling.getUser().getProfileImage())
                    .date(styling.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .tags(tagList) // ★ 태그 리스트 포함
                    .build();
        }
    }

    @Data
    @Builder
    public static class TagResponse {
        private Long productId;
        private String name;
        private int price;
    }
}