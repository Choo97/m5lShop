package com.kosta.shop.dto;

import com.kosta.shop.entity.Styling;
import lombok.Builder;
import lombok.Data;
import java.time.format.DateTimeFormatter;

public class StylingDto {

    @Data
    @Builder
    public static class Response {
        private Long id;
        private String content;
        private String imageUrl;
        private String userNickname;
        private String userProfile;
        private int viewCount;
        private String date;

        public static Response from(Styling styling) {
            return Response.builder()
                    .id(styling.getId())
                    .content(styling.getContent())
                    .imageUrl(styling.getImageUrl())
                    .userNickname(styling.getUser().getNickname())
                    .userProfile(styling.getUser().getProfileImage())
                    .viewCount(styling.getViewCount())
                    .date(styling.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .build();
        }
    }
    
    @Data
    public static class Request {
        private String content;
        // 이미지는 MultipartFile로 따로 받음
    }
}