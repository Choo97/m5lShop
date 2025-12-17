package com.kosta.shop.service;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.dto.UserUpdateDto;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	@Transactional
    public void updateUserInfo(String email, UserUpdateDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("회원 없음"));
        
        user.updateInfo(dto.getNickname(), dto.getPhone(), dto.getZipcode(), dto.getAddress(), dto.getDetailAddress());
    }

}
