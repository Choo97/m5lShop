package com.kosta.shop.controller;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.dto.CartOrderDto;
import com.kosta.shop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 장바구니 상품 주문
    @PostMapping("/cart")
    public ResponseEntity cartOrder(@RequestBody List<CartOrderDto> cartOrderDtoList, 
                                    @AuthenticationPrincipal PrincipalDetails principal) {
        
        if (cartOrderDtoList == null || cartOrderDtoList.isEmpty()) {
            return new ResponseEntity<String>("주문할 상품을 선택해주세요.", HttpStatus.FORBIDDEN);
        }

        // (선택사항) 여기서 장바구니 아이템들이 본인 것이 맞는지 검증하는 로직을 추가할 수 있습니다.
        // CartService.validateCartItem() 등을 활용

        try {
            Long orderId = orderService.orders(cartOrderDtoList, principal.getUser().getEmail());
            return new ResponseEntity<Long>(orderId, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}