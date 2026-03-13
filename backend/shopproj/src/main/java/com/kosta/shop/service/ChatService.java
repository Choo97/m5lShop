package com.kosta.shop.service;

import com.kosta.shop.dto.ChatRoomDto;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.ChatMessageRepository;
import com.kosta.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public List<ChatRoomDto> getChatRoomList() {
        // 1. 대화 기록이 있는 방 번호(roomId)들 가져오기
        List<String> roomIds = chatMessageRepository.findDistinctRoomIds();
        
        List<ChatRoomDto> chatRooms = new ArrayList<>();

        for (String roomId : roomIds) {
            try {
                // roomId가 곧 userId이므로 Long으로 변환
                Long userId = Long.parseLong(roomId);
                
                // 유저 정보 조회
                User user = userRepository.findById(userId).orElse(null);
                
                if (user != null) {
                    chatRooms.add(ChatRoomDto.builder()
                            .roomId(roomId)
                            .roomName(user.getNickname()) // 닉네임 사용 (또는 user.getName())
                            .build());
                } else {
                    // 탈퇴한 회원 등 유저 정보가 없으면 ID만 표시
                    chatRooms.add(ChatRoomDto.builder()
                            .roomId(roomId)
                            .roomName("알 수 없음 (ID: " + roomId + ")")
                            .build());
                }
            } catch (NumberFormatException e) {
                // roomId가 숫자가 아닌 경우 (예외 처리)
                continue;
            }
        }
        
        return chatRooms;
    }
}