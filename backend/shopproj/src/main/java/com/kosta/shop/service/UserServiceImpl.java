package com.kosta.shop.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.shop.dto.UserUpdateDto;
import com.kosta.shop.entity.SocialAccount;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.SocialAccountRepository;
import com.kosta.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
	@Value("${uploadPath}") // application.yml의 경로 (C:/shop/item/)
    private String uploadPath;
    
    private final FileService fileService; // 주입 필요

	private final UserRepository userRepository;
	
	private final SocialAccountRepository socialAccountRepository;

	@Override
	@Transactional
	public void updateUserInfo(String email, UserUpdateDto dto) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("회원 없음"));

		user.updateInfo(dto.getNickname(), dto.getPhone(), dto.getZipcode(), dto.getAddress(), dto.getDetailAddress(),
				dto.getGender());
	}

	@Override
	public Map<String, Boolean> getSocialStatus(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("회원 없음"));

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
	
	@Override
    @Transactional
    public String updateProfileImage(String email, MultipartFile file) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("회원 없음"));

        String imgUrl = "";

        if(file != null && !file.isEmpty()) {
            // 1. 기존 이미지가 있다면 삭제하는 로직을 추가해도 좋습니다. (선택사항)
            
            // 2. 파일 저장 (FileService 활용)
            String savedFileName = fileService.uploadFile(uploadPath, file.getOriginalFilename(), file.getBytes());
            
            // 3. 접근 URL 생성 (/images/파일명)
            imgUrl = "/images/" + savedFileName;
            
            // 4. DB 업데이트
            user.updateProfileImage(imgUrl);
        }
        
        return imgUrl; // 변경된 이미지 주소 반환
    }

}
