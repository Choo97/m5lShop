package com.kosta.shop.config.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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

		setFilterProcessesUrl("/api/auth/login");
	}

	// super의 attemptAuthentication 메소드가 실행되고 성공하면 successfulAuthentication가 호출된다.
	// attemptAuthentication 메소드가 리턴해준 Authentication을 파라미터로 받음
//	백엔드에서 보내는 데이터
//	{
//	    accessToken = "eyJh...", 
//	    user = { email="test@test.com", name="홍길동" }
//	}
//	프론트에서 받는 데이터
//	{
//	    accessToken = "eyJh...", 
//	    user = { email="test@test.com", name="홍길동" }
//	}
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();
		User user = principalDetails.getUser();
		String username = user.getEmail();

		// fcmToken 저장
//		String fcmToken = request.getParameter("fcmToken");
//		user.setFcmToken(fcmToken);
		userRepository.save(user);

		String accesssToken = jwtToken.makeAccessToken(username);
		String refreshToken = jwtToken.makeRefreshToken(username);

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("access_token", accesssToken);
		responseBody.put("refresh_token", refreshToken);

		Map<String, Object> userInfo = new HashMap<>();
		userInfo.put("name", user.getNickname());
		userInfo.put("username", user.getUsername());
		userInfo.put("email", user.getEmail());
		userInfo.put("address", user.getAddress());
		userInfo.put("detailAddress", user.getDetailAddress());
		userInfo.put("roles", user.getRoles());

		responseBody.put("userData", userInfo);

		// map에 있는 token을 json 문자열로 변환
//		ObjectMapper objectMapper = new ObjectMapper();
//		String token =  objectMapper.writeValueAsString(jwtBody);

//		log.debug("token {}", token);

//		response.addHeader(JwtProperties.HEADER_STRING, token);
		response.setContentType("application/json; charset=utf-8");
//		response.getWriter().write(objectMapper.writeValueAsString(responseBody));
		new ObjectMapper().writeValue(response.getWriter(), responseBody);

	}

	// 로그인 시도 시 실행되는 메소드
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		log.info("JwtAuthenticationFilter : 로그인 시도중");

		try {
			// 1. request의 Body(JSON)를 읽어서 Map 또는 DTO로 변환
			ObjectMapper om = new ObjectMapper();

			// 프론트엔드가 { "username": "...", "password": "..." } 로 보낸다고 가정
			// 만약 LoginRequestDto 클래스가 있다면 그걸 써도 됩니다.
			Map<String, String> userMap = om.readValue(request.getInputStream(), Map.class);

			String username = userMap.get("username"); // 프론트에서 보낸 email 값
			String password = userMap.get("password");

			log.info("입력된 email(username 값): " + username);
			log.info("입력된 Password: " + password);

			// 2. 인증 토큰 생성 (아직 인증 안 된 상태)
			UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
					password);

			// 3. 실제 인증 처리 (Manager가 UserDetailsService를 호출해서 비밀번호 비교)
			// 성공하면 authentication 객체 리턴, 실패하면 예외 발생(401)
			Authentication authentication = getAuthenticationManager().authenticate(authenticationToken);

			return authentication;

		} catch (IOException e) {
			e.printStackTrace();
		}

		return null; // 실패 시
	}

}
