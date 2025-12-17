package com.kosta.shop.service;

import com.kosta.shop.dto.UserUpdateDto;

public interface UserService {

	public void updateUserInfo(String email, UserUpdateDto dto);
}
