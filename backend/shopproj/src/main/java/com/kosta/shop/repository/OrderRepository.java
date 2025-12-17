package com.kosta.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosta.shop.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	// 유저의 주문 내역 조회 (최신순)
    // 페이징 없이 전체 조회 (간단 버전)
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);}