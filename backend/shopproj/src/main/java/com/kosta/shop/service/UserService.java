package com.kosta.shop.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.kosta.shop.dto.UserJoinDto;
import com.kosta.shop.dto.UserUpdateDto;

public interface UserService {

	public void updateUserInfo(String email, UserUpdateDto dto);

	public Map<String, Boolean> getSocialStatus(String email);

	public String updateProfileImage(String email, MultipartFile file) throws Exception;
	
    public boolean checkEmailDuplicate(String email);

	public void join(UserJoinDto joinDto);

}
