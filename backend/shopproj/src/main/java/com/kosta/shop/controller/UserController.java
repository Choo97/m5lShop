package com.kosta.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.dto.UserUpdateDto;
import com.kosta.shop.entity.User;
import com.kosta.shop.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
	
	@Autowired
    private UserService userService;

    // 현재 로그인한 유저 정보 반환
    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        return principalDetails.getUser();
    }
    
    @PatchMapping("/me")
    public ResponseEntity<String> updateUserInfo(@RequestBody UserUpdateDto dto, 
                                                 @AuthenticationPrincipal PrincipalDetails principal) {
        try {
            userService.updateUserInfo(principal.getUser().getEmail(), dto);
            return new ResponseEntity<>("회원 정보가 수정되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}