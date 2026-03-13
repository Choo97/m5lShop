package com.kosta.shop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosta.shop.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisSubscriber {

    private final ObjectMapper objectMapper;
    private final SimpMessageSendingOperations messagingTemplate;

    // Redis에서 메시지가 발행(Publish)되면 이 메서드가 자동으로 실행됩니다.
    public void sendMessage(String publishMessage) {
        try {
            // 1. Redis에서 날아온 JSON 문자열을 DTO 객체로 변환
            ChatMessageDto chatMessage = objectMapper.readValue(publishMessage, ChatMessageDto.class);
            
            // 2. STOMP를 통해 해당 방(/sub/chat/room/{roomId})을 구독 중인 클라이언트들에게 뿌려줌!
            messagingTemplate.convertAndSend("/sub/chat/room/" + chatMessage.getRoomId(), chatMessage);
            
        } catch (Exception e) {
            log.error("Exception in RedisSubscriber: {}", e.getMessage());
        }
    }
}