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
		
		// 1. 헤더가 없거나 Bearer로 시작하지 않으면 -> 그냥 통과시킨다 (로그인 안 한 상태로 간주)
		// (SecurityConfig에서 권한이 필요한 주소라면 알아서 403/401 에러를 낼 것임)
		if(header == null || !header.startsWith(JwtProperties.TOKEN_PREFIX)) {
			chain.doFilter(request, response);
			return;
		}
		
		// 2. 토큰이 있다면 검증 시작
		String accessToken = header.replace(JwtProperties.TOKEN_PREFIX, "");
				
		try {
			// Access Token 검증
			String email = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
									.build()
									.verify(accessToken)
									.getClaim("sub")
									.asString();
			
			if(email != null) {
				Optional<User> ouser = userRepository.findByEmail(email);
				
				if(ouser.isPresent()) {
					User user = ouser.get();
					
					// ★ 여기서 PrincipalDetails 객체를 만들어 넣어줍니다.
					PrincipalDetails principalDetails = new PrincipalDetails(user);
					
					Authentication auth = new UsernamePasswordAuthenticationToken(
							principalDetails, 
							null,
							principalDetails.getAuthorities());
					
					// 시큐리티 세션에 등록
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			}
			
			chain.doFilter(request, response);
			
		} catch(TokenExpiredException e) { 
			// 토큰 만료 시 Refresh Token 확인 로직
			log.info("Access Token 만료됨. Refresh Token 확인 시도.");
			
			String refreshTokenHeader = request.getHeader("RefreshToken");

			if(refreshTokenHeader == null || !refreshTokenHeader.startsWith(JwtProperties.TOKEN_PREFIX)) {
				// 리프레시 토큰도 없으면 진짜 만료
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 만료 (로그인 필요)");
				return;				
			}
			
			String refreshToken = refreshTokenHeader.replace(JwtProperties.TOKEN_PREFIX, "");
			
			try {
				String email = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
									.build()
									.verify(refreshToken)
									.getClaim("sub")
									.asString();
				
				if(email != null) {
					Optional<User> ouser = userRepository.findByEmail(email);
					if(ouser.isPresent()) {
						// 새 토큰 발급
						// (주의: JwtToken 빈을 주입받지 못했다면 여기서 직접 생성 로직 구현 필요)
						// 임시로 하드코딩된 로직 대신, 기존 로직 유지
						
						// 인증 처리
						PrincipalDetails principalDetails = new PrincipalDetails(ouser.get());
						Authentication auth = new UsernamePasswordAuthenticationToken(
								principalDetails, null, principalDetails.getAuthorities());
						SecurityContextHolder.getContext().setAuthentication(auth);
						
						// 여기서 새 토큰을 헤더에 담아주는 로직이 필요하지만, 
						// 일단 필터 통과가 우선이므로 진행
						chain.doFilter(request, response);
						return;
					}
				}
			} catch(Exception re) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Refresh Token 만료");
			}
		} catch(Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 오류");
		}	
	}
}