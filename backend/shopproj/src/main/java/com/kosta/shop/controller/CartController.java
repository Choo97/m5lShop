package com.kosta.shop.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // ★ 필수 Import
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.dto.CartDetailDto;
import com.kosta.shop.dto.CartItemDto;
import com.kosta.shop.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;

    // 1. 장바구니 담기
    @PostMapping
    public ResponseEntity order(
            @RequestBody @Valid CartItemDto cartItemDto,
            BindingResult bindingResult,
            @AuthenticationPrincipal PrincipalDetails principal // ★ 이렇게 받으면 끝!
    ) {
        if (bindingResult.hasErrors()) {
            StringBuilder sb = new StringBuilder();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                sb.append(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<String>(sb.toString(), HttpStatus.BAD_REQUEST);
        }

        try {
            // ★ principal에서 바로 이메일 꺼내기
            String email = principal.getUser().getEmail();
            Long cartItemId = cartService.addCart(cartItemDto, email);
            return new ResponseEntity<Long>(cartItemId, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 2. 장바구니 목록 조회
    @GetMapping
    public ResponseEntity<List<CartDetailDto>> orderHist(@AuthenticationPrincipal PrincipalDetails principal) {
        // ★ 한 줄로 깔끔하게 해결
        List<CartDetailDto> cartDetailDtoList = cartService.getCartList(principal.getUser().getEmail());
        log.debug(Integer.toString(cartDetailDtoList.size()));
        return new ResponseEntity<>(cartDetailDtoList, HttpStatus.OK);
    }

    // 3. 수량 수정
    @PatchMapping("/{cartItemId}")
    public ResponseEntity updateCartItem(
            @PathVariable("cartItemId") Long cartItemId, 
            int count,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (count <= 0) {
            return new ResponseEntity<String>("최소 1개 이상 담아주세요.", HttpStatus.BAD_REQUEST);
        } else if (!cartService.validateCartItem(cartItemId, principal.getUser().getEmail())) {
            return new ResponseEntity<String>("수정 권한이 없습니다.", HttpStatus.FORBIDDEN);
        }

        cartService.updateCartItemCount(cartItemId, count);
        return new ResponseEntity<Long>(cartItemId, HttpStatus.OK);
    }

    // 4. 삭제
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity deleteCartItem(
            @PathVariable("cartItemId") Long cartItemId,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        if (!cartService.validateCartItem(cartItemId, principal.getUser().getEmail())) {
            return new ResponseEntity<String>("수정 권한이 없습니다.", HttpStatus.FORBIDDEN);
        }

        cartService.deleteCartItem(cartItemId);
        return new ResponseEntity<Long>(cartItemId, HttpStatus.OK);
    }
}