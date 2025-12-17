package com.kosta.shop.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.dto.CartOrderDto;
import com.kosta.shop.dto.OrderHistDto;
import com.kosta.shop.dto.OrderItemDto;
import com.kosta.shop.entity.CartItem;
import com.kosta.shop.entity.Order;
import com.kosta.shop.entity.OrderItem;
import com.kosta.shop.entity.ProductImage;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.CartItemRepository;
import com.kosta.shop.repository.OrderRepository;
import com.kosta.shop.repository.ProductImageRepository;
import com.kosta.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    @Transactional
    public Long orders(List<CartOrderDto> cartOrderDtoList, String email) {
        
        // 1. 로그인한 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("회원 정보를 찾을 수 없습니다."));

        // 2. 주문할 상품 리스트 생성 (OrderItem 리스트)
        List<OrderItem> orderItemList = new ArrayList<>();

        for (CartOrderDto cartOrderDto : cartOrderDtoList) {
            // 장바구니 아이템 조회
            CartItem cartItem = cartItemRepository.findById(cartOrderDto.getCartItemId())
                    .orElseThrow(() -> new EntityNotFoundException("장바구니 아이템을 찾을 수 없습니다."));

            // 장바구니 아이템 -> 주문 상품(OrderItem)으로 변환
            // (이때 Product의 removeStock이 실행되면서 재고가 감소함)
            OrderItem orderItem = OrderItem.createOrderItem(cartItem.getProduct(), cartItem.getCount());
            orderItemList.add(orderItem);
        }

        // 3. 주문(Order) 엔티티 생성
        Order order = Order.createOrder(user, orderItemList);
        
        // 4. 주문 저장 (Cascade 설정으로 OrderItem들도 같이 저장됨)
        orderRepository.save(order);

        // 5. 주문한 장바구니 아이템 삭제 (중요!)
        for (CartOrderDto cartOrderDto : cartOrderDtoList) {
            CartItem cartItem = cartItemRepository.findById(cartOrderDto.getCartItemId())
                    .orElseThrow(() -> new EntityNotFoundException("장바구니 아이템 조회 실패"));
            cartItemRepository.delete(cartItem);
        }

        return order.getId();
    }
    
    @Override
    public List<OrderHistDto> getOrderList(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("회원이 존재하지 않습니다."));
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        List<OrderHistDto> orderHistDtos = new ArrayList<>();
        
        for (Order order : orders) {
            OrderHistDto orderHistDto = new OrderHistDto(order);
            List<OrderItem> orderItems = order.getOrderItems();
            for (OrderItem orderItem : orderItems) {
                ProductImage productImage = productImageRepository.findByProductIdAndIsRepImgTrue(orderItem.getProduct().getId());
                String imgUrl = (productImage != null) ? productImage.getImgUrl() : "";

                OrderItemDto orderItemDto = new OrderItemDto(orderItem, imgUrl);
                orderHistDto.addOrderItemDto(orderItemDto);
            }
            orderHistDtos.add(orderHistDto);
        }
        return orderHistDtos;
    }
}