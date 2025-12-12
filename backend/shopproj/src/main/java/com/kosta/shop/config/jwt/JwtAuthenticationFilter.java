package com.kosta.shop.config.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	private UserRepository userRepository;
	
	JwtToken jwtToken = new JwtToken();
	
	public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
		super(authenticationManager);
		this.userRepository = userRepository;
	}

	//super의 attemptAuthentication 메소드가 실행되고 성공하면 successfulAuthentication가 호출된다.
	//attemptAuthentication 메소드가 리턴해준 Authentication을 파라미터로 받음
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		PrincipalDetails principalDetails = (PrincipalDetails)authResult.getPrincipal();
		String username = principalDetails.getUsername();
		User user = principalDetails.getUser();
		
		//fcmToken 저장
//		String fcmToken = request.getParameter("fcmToken");
//		user.setFcmToken(fcmToken);
		userRepository.save(user);
		
		String accesssToken = jwtToken.makeAccessToken(username);
		String refreshToken = jwtToken.makeRefreshToken(username);
		
		Map<String,String> map = new HashMap<>();
		map.put("access_token", JwtProperties.TOKEN_PREFIX+accesssToken);
		map.put("refresh_token", JwtProperties.TOKEN_PREFIX+refreshToken);
		
		//map에 있는 token을 json 문자열로 변환
		ObjectMapper objectMapper = new ObjectMapper();
		String token =  objectMapper.writeValueAsString(map);
		
		log.debug("token {}", token);
		
		response.addHeader(JwtProperties.HEADER_STRING, token);
		response.setContentType("application/json; charset=utf-8");
		
		Map<String,Object> userInfo = new HashMap<>();
		userInfo.put("name", user.getNickname());
		userInfo.put("username", user.getUsername());
		userInfo.put("email", user.getEmail());
		userInfo.put("address", user.getAddress());
		userInfo.put("detailAddress", user.getDetailAddress());
		userInfo.put("roles", user.getRoles());
		
		response.getWriter().write(objectMapper.writeValueAsString(userInfo));
	}
	
}
