package com.kosta.shop.dto;

import com.kosta.shop.entity.Role;
import com.kosta.shop.entity.User;
import lombok.Builder;
import lombok.Data;
import java.time.format.DateTimeFormatter;

@Data
@Builder
public class AdminUserDto {
    private Long id;
    private String email;
    private String name;
    private String nickname;
    private Role role;       // 권한 (USER, ADMIN)
    private String provider; // 가입 경로 (null이면 일반, kakao, naver 등)
    private String regTime;  // 가입일

    public static AdminUserDto from(User user) {
        return AdminUserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getUsername())
                .nickname(user.getNickname())
                .role(user.getRole())
                .provider(user.getProvider())
                .regTime(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .build();
    }
}