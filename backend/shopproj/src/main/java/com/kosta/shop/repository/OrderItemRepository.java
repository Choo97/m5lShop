package com.kosta.shop.repository;

import com.kosta.shop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // 기본적으로 findById, save, delete 등이 포함되어 있습니다.
    
    // (선택사항) 추후에 '이 사람이 이 상품을 샀는지' 검증하거나
    // '이미 리뷰를 쓴 주문상품인지' 체크하는 메소드가 필요하면 여기에 추가합니다.
}