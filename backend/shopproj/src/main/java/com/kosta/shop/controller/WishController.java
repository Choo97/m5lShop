package com.kosta.shop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.service.WishService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wish")
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;

    // 찜 토글
    @PostMapping("/{productId}")
    public ResponseEntity<Boolean> toggleWish(
            @PathVariable Long productId,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        boolean result = wishService.toggleWish(principal.getUser().getEmail(), productId);
        return ResponseEntity.ok(result);
    }
    
    // 찜 여부 확인 (상세 페이지 진입 시)
    @GetMapping("/{productId}")
    public ResponseEntity<Boolean> checkWish(
            @PathVariable Long productId,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if(principal == null) return ResponseEntity.ok(false);
        boolean result = wishService.isWished(principal.getUser().getEmail(), productId);
        return ResponseEntity.ok(result);
    }
}
