package com.kosta.shop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosta.shop.dto.ChatMessageDto;
import com.kosta.shop.dto.ChatRoomDto;
import com.kosta.shop.entity.ChatMessage;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.ChatMessageRepository;
import com.kosta.shop.repository.UserRepository; // 유저 조회용
import com.kosta.shop.service.ChatService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final ObjectMapper objectMapper;

    @MessageMapping("/chat/message")
    @Transactional
    public void message(ChatMessageDto messageDto) {

        // 1. 유저 ID로 실제 유저 정보 조회 (없으면 예외처리 필요하지만 소켓이라 로그만 남김)
        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        // 2. DB 저장 (User 객체를 넣음)
        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(messageDto.getRoomId())
                .sender(sender) // User 객체 저장
                .message(messageDto.getMessage())
                .build();

        chatMessageRepository.save(chatMessage);

        // 3. 구독자들에게 보낼 데이터 가공 (DTO 변환)
        // 여기서 DB에 있는 최신 닉네임과 프로필 사진을 실어 보냅니다.
        ChatMessageDto responseDto = ChatMessageDto.from(chatMessage);

        // 4. 전송
        try {
            // 4. 변경점: STOMP로 바로 쏘는 대신, Redis로 발행 (Publish)
            // 객체를 JSON 문자열로 변환해서 레디스로 쏩니다.
            String jsonMessage = objectMapper.writeValueAsString(responseDto);
            redisTemplate.convertAndSend(channelTopic.getTopic(), jsonMessage);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/api/chat/rooms")
    public ResponseEntity<List<ChatRoomDto>> getChatRooms() {
        // 채팅 기록이 있는 방 번호(유저ID) 리스트 반환
        return ResponseEntity.ok(chatService.getChatRoomList());
    }

    @GetMapping("/api/chat/history/{roomId}")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@PathVariable String roomId) {
        // roomId에 해당하는 모든 메시지를 createdAt 오름차순으로 조회
        List<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);

        List<ChatMessageDto> dtos = messages.stream()
                .map(ChatMessageDto::from) // Entity -> DTO 변환 (기존에 만드셨을 것)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}