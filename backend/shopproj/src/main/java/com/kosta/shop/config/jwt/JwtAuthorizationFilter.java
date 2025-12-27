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
	
    private JwtToken jwtToken; 

	public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
		super(authenticationManager);
		this.userRepository = userRepository;
		
        this.jwtToken = new JwtToken(); 

	}
	
	@Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String uri = request.getRequestURI();

        String header = request.getHeader(JwtProperties.HEADER_STRING); // "Authorization" 헤더

     // 1. 토큰이 없으면? -> 그냥 통과 (비로그인 상태로 SecurityConfig에 도달함)
        if(header == null || !header.startsWith(JwtProperties.TOKEN_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        // 2. 토큰 추출 및 정제 (★ 중요: Bearer 중복 제거)
        String accessToken = header.replace(JwtProperties.TOKEN_PREFIX, "").trim();
        // 혹시 모를 "Bearer Bearer " 같은 경우를 대비해 다시 한번 제거
        while (accessToken.startsWith(JwtProperties.TOKEN_PREFIX)) {
            accessToken = accessToken.replace(JwtProperties.TOKEN_PREFIX, "").trim();
        }

        // 3. Access Token 검증 (Email 추출)
        try {
            String email = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
                    .build()
                    .verify(accessToken)
                    .getClaim("sub")
                    .asString();

            if (email != null) {
                Optional<User> ouser = userRepository.findByEmail(email);

                if (ouser.isPresent()) {
                    User user = ouser.get();
                    PrincipalDetails principalDetails = new PrincipalDetails(user);
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            principalDetails, null, principalDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
            // 검증 후 다음 필터로 진행
            chain.doFilter(request, response);

        } catch (TokenExpiredException e) {
            // Access Token 만료 시 Refresh Token 처리 (별도 API 호출 방식)
            log.info("Access Token 만료됨. Refresh Token 확인 시도.");

            // 프론트엔드에서 별도 헤더("RefreshToken")로 Refresh Token을 보내준다고 가정
            String refreshTokenHeader = request.getHeader("RefreshToken");

            if (refreshTokenHeader == null || !refreshTokenHeader.startsWith(JwtProperties.TOKEN_PREFIX)) {
                log.warn("Refresh Token 헤더 없음");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 만료 (Refresh Token 없음)");
                return;
            }

            String refreshToken = refreshTokenHeader.replace(JwtProperties.TOKEN_PREFIX, "").trim();

            try {
                // Refresh Token 검증
                String emailFromRefresh = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
                        .build()
                        .verify(refreshToken)
                        .getClaim("sub")
                        .asString();

                if (emailFromRefresh != null) {
                    Optional<User> userOpt = userRepository.findByEmail(emailFromRefresh);
                    if (userOpt.isPresent()) {
                        // 새 Access Token 발급
                        String newAccessToken = jwtToken.makeAccessToken(emailFromRefresh);
                        
                        // 응답 헤더에 새 Access Token 추가 (프론트가 이걸 받아서 localStorage 갱신)
                        response.addHeader(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + newAccessToken);
                        
                        // 현재 요청에 대한 인증 정보도 갱신 (액세스 토큰이 방금 발급되었으니)
                        PrincipalDetails principalDetails = new PrincipalDetails(userOpt.get());
                        Authentication auth = new UsernamePasswordAuthenticationToken(
                                principalDetails, null, principalDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);

                        chain.doFilter(request, response);
                        return;
                    }
                }
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 Refresh Token");
            } catch (TokenExpiredException re) {
                log.warn("Refresh Token이 만료되었습니다. 재로그인이 필요합니다.");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Refresh Token 만료");
            } catch (Exception re) {
                log.error("Refresh Token 검증 중 오류 발생", re);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Refresh Token 오류");
            }
        } catch (Exception e) {
            // Access Token 검증 자체에 실패했을 경우
            log.error("JWT 검증 중 알 수 없는 오류", e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰");
        }
    }
}