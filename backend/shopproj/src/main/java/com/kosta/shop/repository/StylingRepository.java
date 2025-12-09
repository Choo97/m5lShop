package com.kosta.shop.repository;

import com.kosta.shop.entity.Styling;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StylingRepository extends JpaRepository<Styling, Long> {
    // 최신순 정렬해서 가져오기
    Page<Styling> findAllByOrderByCreatedAtDesc(Pageable pageable);
}