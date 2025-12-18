package com.kosta.shop.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.dto.UserUpdateDto;
import com.kosta.shop.entity.SocialAccount;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.SocialAccountRepository;
import com.kosta.shop.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
    private SocialAccountRepository socialAccountRepository;
	@Override
	@Transactional
    public void updateUserInfo(String email, UserUpdateDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("회원 없음"));
        
        user.updateInfo(dto.getNickname(), dto.getPhone(), dto.getZipcode(), dto.getAddress(), dto.getDetailAddress(), dto.getGender() );
    }
	@Transactional(readOnly = true)
    public Map<String, Boolean> getSocialStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("회원 없음"));
        
        // 1. 초기값 설정 (전부 false)
        Map<String, Boolean> status = new HashMap<>();
        status.put("kakao", false);
        status.put("naver", false);

        // 2. [SocialAccount 테이블 확인] (1:N 연동된 계정들)
        // (SocialAccountRepository가 없다면 이 부분은 에러나니 주석 처리하거나 만드셔야 합니다)
        try {
            List<SocialAccount> accounts = socialAccountRepository.findByUserId(user.getId());
            for (SocialAccount account : accounts) {
                if (account.getProvider() != null) {
                    status.put(account.getProvider().toLowerCase(), true);
                }
            }
        } catch (Exception e) {
            // SocialAccount 리포지토리가 없거나 에러나면 패스
        }

        // 3. [User 테이블 확인] (최초 가입 계정 - Fallback)
        // SocialAccount 테이블에 데이터가 없더라도, User 테이블에 provider가 있으면 연동된 것으로 처리
        if (user.getProvider() != null) {
            status.put(user.getProvider().toLowerCase(), true);
        }
        
        return status;
    }
}
