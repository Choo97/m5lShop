package com.kosta.shop.config.jwt;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

	private UserRepository userRepository;

	public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
		super(authenticationManager);
		this.userRepository = userRepository;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		String header = request.getHeader(JwtProperties.HEADER_STRING);
		
		// 1. 헤더가 없거나 Bearer로 시작하지 않으면 -> 그냥 통과 (비로그인 상태)
		if(header == null || !header.startsWith(JwtProperties.TOKEN_PREFIX)) {
			chain.doFilter(request, response);
			return;
		}
		
		// 2. 토큰 추출
		String accessToken = header.replace(JwtProperties.TOKEN_PREFIX, "");
				
		try {
			// 3. Access Token 검증
			String email = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
									.build()
									.verify(accessToken)
									.getClaim("sub")
									.asString();
			
			if(email != null) {
				Optional<User> ouser = userRepository.findByEmail(email);
				
				if(ouser.isPresent()) {
					User user = ouser.get();
					PrincipalDetails principalDetails = new PrincipalDetails(user);
					
					Authentication auth = new UsernamePasswordAuthenticationToken(
							principalDetails, null, principalDetails.getAuthorities());
					
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			}
			chain.doFilter(request, response);
			
		} catch(TokenExpiredException e) { 
			// ★ 핵심 변경: 여기서 재발급하지 않고 바로 401 에러를 보냅니다.
			// 그러면 프론트엔드(config.jsx)가 이걸 감지하고 AuthController로 갱신 요청을 보냅니다.
			log.info("Access Token 만료됨 -> 401 응답");
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 만료");
			
		} catch(Exception e) {
			log.error("토큰 오류", e);
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 오류");
		}	
	}
}