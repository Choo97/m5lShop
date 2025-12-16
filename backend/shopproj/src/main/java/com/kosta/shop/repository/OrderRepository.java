package com.kosta.shop.repository;

import com.kosta.shop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // 나중에 '나의 주문 내역' 조회할 때 필요
    // List<Order> findByUserId(Long userId); 
}