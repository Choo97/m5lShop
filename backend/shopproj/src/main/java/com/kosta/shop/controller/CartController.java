package com.kosta.shop.controller;

import com.kosta.shop.dto.CartItemDto;
import com.kosta.shop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity order(
            @RequestBody @Valid CartItemDto cartItemDto, // ★ @Valid로 검사
            BindingResult bindingResult
    ) {
        // 1. 유효성 검사 실패 시 에러 메시지 반환
        if (bindingResult.hasErrors()) {
            StringBuilder sb = new StringBuilder();
            List<FieldError> fieldErrors = bindingResult.getFieldErrors();
            for (FieldError fieldError : fieldErrors) {
                sb.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<String>(sb.toString(), HttpStatus.BAD_REQUEST);
        }

        // 2. 현재 로그인한 유저의 이메일 가져오기 (SecurityContext)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // PrincipalDetails나 Token에서 설정한 email

        try {
            Long cartItemId = cartService.addCart(cartItemDto, email);
            return new ResponseEntity<Long>(cartItemId, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}