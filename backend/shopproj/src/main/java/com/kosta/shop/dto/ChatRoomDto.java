package com.kosta.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    private String roomId;    // 방 번호 (유저 ID 문자열)
    private String roomName;  // 방 이름 (유저 닉네임 또는 이름)
}