package com.kosta.shop.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.kosta.shop.config.jwt.JwtProperties;
import com.kosta.shop.config.jwt.JwtToken;
import com.kosta.shop.dto.UserIdCheckDto;
import com.kosta.shop.dto.UserJoinDto;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.UserRepository;
import com.kosta.shop.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;

	private final UserRepository userRepository;
	// JwtToken 빈이 없다면 new JwtToken() 사용하거나 Bean 등록 필요
	private final JwtToken jwtToken = new JwtToken();

	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {

		// 1. 헤더에서 Refresh Token 꺼내기
		String refreshTokenHeader = request.getHeader("RefreshToken");

		if (refreshTokenHeader == null || !refreshTokenHeader.startsWith(JwtProperties.TOKEN_PREFIX)) {
			return new ResponseEntity<>("Refresh Token이 없습니다.", HttpStatus.BAD_REQUEST);
		}

		String refreshToken = refreshTokenHeader.replace(JwtProperties.TOKEN_PREFIX, "");

		try {
			// 2. Refresh Token 유효성 검사
			String email = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET)).build().verify(refreshToken)
					.getClaim("sub").asString();

			if (email != null) {
				Optional<User> userOpt = userRepository.findByEmail(email);
				if (userOpt.isPresent()) {

					// 3. ★ 새로운 Access Token 발급!
					String newAccessToken = jwtToken.makeAccessToken(email);

					// 4. 응답 본문(JSON)으로 전달
					Map<String, String> tokenMap = new HashMap<>();
					tokenMap.put("access_token", JwtProperties.TOKEN_PREFIX + newAccessToken);

					// (선택사항) 응답 헤더에도 넣어줌
					response.addHeader(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + newAccessToken);

					log.info("토큰 재발급 성공: " + email);
					return new ResponseEntity<>(tokenMap, HttpStatus.OK);
				}
			}
			return new ResponseEntity<>("사용자를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);

		} catch (TokenExpiredException e) {
			return new ResponseEntity<>("Refresh Token이 만료되었습니다. 다시 로그인해주세요.", HttpStatus.UNAUTHORIZED);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("토큰 오류", HttpStatus.UNAUTHORIZED);
		}
	}

	// ★ 아이디 중복 확인
	@PostMapping("/doubleUserId")
	public ResponseEntity<Boolean> doubleMemberId(@RequestBody UserIdCheckDto dto) {
		// DB에 있으면 true (중복), 없으면 false (사용가능)
		boolean isDuplicate = userService.checkEmailDuplicate(dto.getEmail());
		return ResponseEntity.ok(isDuplicate);
	}

	@PostMapping("/join")
	public ResponseEntity<Boolean> join(@RequestBody UserJoinDto joinDto) {
		userService.join(joinDto); // 회원가입 서비스 호출
		return ResponseEntity.ok(true);
	}
}