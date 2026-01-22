package com.kosta.shop.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.shop.dto.AdminUserDto;
import com.kosta.shop.dto.UserJoinDto;
import com.kosta.shop.dto.UserUpdateDto;
import com.kosta.shop.entity.Role;
import com.kosta.shop.entity.SocialAccount;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.SocialAccountRepository;
import com.kosta.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
	
	@Value("${uploadPath}")
    private String uploadPath;
    
    private final FileService fileService; // 주입 필요

	private final UserRepository userRepository;
	
	private final SocialAccountRepository socialAccountRepository;
	
	private final BCryptPasswordEncoder bCryptPasswordEncoder;

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

	@Override
	public boolean checkEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
	}

	@Override
	@Transactional
    public void join(UserJoinDto joinDto) {
        // 1. 중복 체크 (안전장치)
        if (userRepository.existsByEmail(joinDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 2. 비밀번호 암호화
        String rawPassword = joinDto.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);

        // 3. DTO -> Entity 변환 및 저장
        User user = joinDto.toEntity(encPassword);
        userRepository.save(user);
        
        // (선택사항) 회원가입 시 장바구니 생성 등 추가 로직
    }

	@Override
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserDto::from)
                .collect(Collectors.toList()); // List import 확인
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("회원이 없습니다."));
        // 연관된 데이터(주문, 장바구니 등)가 있으면 Cascade 설정에 따라 같이 삭제되거나 에러가 날 수 있음.
        // 여기서는 유저 삭제 시 관련 데이터도 삭제된다고 가정 (User 엔티티 설정 확인 필요)
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void changeRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("회원이 없습니다."));
        
        // String -> Enum 변환
        if(roleName.equals("ADMIN")) user.setRole(Role.ROLE_ADMIN);
        else if(roleName.equals("USER")) user.setRole(Role.ROLE_USER);
        
        // User 엔티티에 setRole 메소드가 없으면 추가하거나 updateRole 메소드 생성 필요
    }

}
