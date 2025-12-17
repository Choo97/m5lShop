package com.kosta.shop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserUpdateDto {
    private String nickname;
    private String phone;
    private String zipcode;
    private String address;
    private String detailAddress;
}