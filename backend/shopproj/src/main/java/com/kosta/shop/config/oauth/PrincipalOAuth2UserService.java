package com.kosta.shop.config.oauth;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.entity.Role;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PrincipalOAuth2UserService extends DefaultOAuth2UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		return processOAuth2User(userRequest, oAuth2User);
	}
	
	private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
		String registrationId = userRequest.getClientRegistration().getRegistrationId();
		
		OAuth2UserInfo oAuth2UserInfo = null;
		if(registrationId.equals("naver")) {
			oAuth2UserInfo = new NaverUserInfo(oAuth2User.getAttribute("response"));
		} else if(registrationId.equals("kakao")) {
			oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes(), 
					oAuth2User.getAttribute("properties"), oAuth2User.getAttribute("kakao_account")); 
		} else {
			log.info("카카오 네이버만 지원");
			return null;	
		}
		
		LocalDate birthDate = null;
		try {
			String year = oAuth2UserInfo.getBirthYear(); 
			String day = oAuth2UserInfo.getBirthDay();
			
			if (year != null && day != null) {
				String dateStr = year + day.replace("-", ""); 
				
				birthDate = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyyMMdd"));
			}
		} catch (Exception e) {
			log.error("생년월일 파싱 실패: {}", e.getMessage());
		}

		Optional<User> ouser = userRepository.findByEmail(oAuth2UserInfo.getEmail());
		
		User user = null;
		if(ouser.isEmpty()) { 
			user = User.builder()
						.username(oAuth2UserInfo.getName())
						.email(oAuth2UserInfo.getEmail())
						.provider(oAuth2UserInfo.getProvider())
						.providerId(oAuth2UserInfo.getProviderId())
						.profileImage(oAuth2UserInfo.getProfileImage())
						.nickname(oAuth2UserInfo.getNickname())
						.gender(oAuth2UserInfo.getGender())
						.ageRange(oAuth2UserInfo.getAgeRange())
						.phone(oAuth2UserInfo.getMobile())
						.birthDate(birthDate)
						.role(Role.ROLE_USER)
						.password("SOCIAL_LOGIN")
						.build();
		} else {
			user = ouser.get();
			
			user.setProvider(oAuth2UserInfo.getProvider());
			user.setProviderId(oAuth2UserInfo.getProviderId());
			user.setUsername(oAuth2UserInfo.getName());
			user.setProfileImage(oAuth2UserInfo.getProfileImage());
		}
		
		userRepository.save(user);
		return new PrincipalDetails(user, oAuth2User.getAttributes());
	}
}