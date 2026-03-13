package com.kosta.shop.dto;

import com.kosta.shop.entity.ChatMessage;
import com.kosta.shop.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private String roomId;
    private Long senderId;        // ★ 보내는 사람 ID (필수)
    private String senderName;    // 보여줄 닉네임 (Response용)
    private String senderProfile; // 보여줄 프로필 사진 (Response용)
    private String message;
    private Role senderRole; 

    public static ChatMessageDto from(ChatMessage entity) {
        return ChatMessageDto.builder()
                .roomId(entity.getRoomId())
                .senderId(entity.getSender().getId())
                .senderName(entity.getSender().getNickname())
                .senderProfile(entity.getSender().getProfileImage()) // 프로필 이미지도 같이 전달
                .message(entity.getMessage())
                .senderRole(entity.getSender().getRole()) 
                .build();
    }
}
