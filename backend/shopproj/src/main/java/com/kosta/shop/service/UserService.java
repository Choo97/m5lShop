package com.kosta.shop.service;

import java.util.Map;

import com.kosta.shop.dto.UserUpdateDto;

public interface UserService {

	public void updateUserInfo(String email, UserUpdateDto dto);

	public Map<String, Boolean> getSocialStatus(String email);
}
