package com.kosta.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.kosta.shop.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT DISTINCT c.roomId FROM ChatMessage c ORDER BY c.createdAt DESC")
    List<String> findDistinctRoomIds();

    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(String roomId);

}
