package com.kosta.shop.controller;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    // 현재 로그인한 유저 정보 반환
    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        return principalDetails.getUser();
    }
}