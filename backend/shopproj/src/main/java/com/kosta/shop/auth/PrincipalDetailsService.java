package com.kosta.shop.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.kosta.shop.entity.User;
import com.kosta.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// security 설정에서 loginProcessingUrl("/loginProc")
// /loginProc 요청이 오면 자동으로 UserDetailsService의 타입으로 IoC 되어있는 loadUserByUsername 함수가 호출된다.
@Service
@Slf4j
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

	private final UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		log.info("로그인 시도 {} :", email);
		User user = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("해당 사용자가 없습니다."));
		return new PrincipalDetails(user);
	}

}
