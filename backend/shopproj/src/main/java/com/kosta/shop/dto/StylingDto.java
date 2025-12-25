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
    public static class CommentRequest {
        private String content;
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
        private int viewCount; 

        private List<TagResponse> tags;

        private List<CommentResponse> comments; 
        
        public static Response from(Styling styling) {
            return from(styling, null);
        }
        
        public static Response from(Styling styling, String principalEmail) {
            List<TagResponse> tagList = styling.getStylingProducts().stream()
                .map(sp -> TagResponse.builder()
                        .productId(sp.getProduct().getId())
                        .name(sp.getProduct().getName())
                        .price(sp.getProduct().getPrice())
                        .build())
                .collect(Collectors.toList());

            List<CommentResponse> commentList = styling.getComments().stream()
                    .map(c -> CommentResponse.builder()
                            .id(c.getId())
                            .content(c.getContent())
                            .nickname(c.getUser().getNickname())
                            .profileImage(c.getUser().getProfileImage())
                            .date(c.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                            .isOwner(c.getUser().getEmail().equals(principalEmail)) // 로그인한 사람이 작성자인가?
                            .build())
                 .collect(Collectors.toList());
            
            return Response.builder()
                    .id(styling.getId())
                    .content(styling.getContent())
                    .imageUrl(styling.getImageUrl())
                    .nickname(styling.getUser().getNickname())
                    .profileImage(styling.getUser().getProfileImage())
                    .date(styling.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .viewCount(styling.getViewCount()) 
                    .tags(tagList) // 태그 리스트 포함
                    .comments(commentList) // 댓글 리스트 추가
                    .build();
        }
    }
    
    @Data
    @Builder
    public static class CommentResponse {
        private Long id;
        private String content;
        private String nickname;
        private String profileImage;
        private String date;
        private boolean isOwner; // 본인 댓글인지 여부 (삭제 버튼 표시용)
    }

    @Data
    @Builder
    public static class TagResponse {
        private Long productId;
        private String name;
        private int price;
    }
}