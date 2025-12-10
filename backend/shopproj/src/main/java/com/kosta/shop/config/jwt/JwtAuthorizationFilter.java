package com.kosta.shop.config.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.UserRepository;

//인가 : 로그인 처리가 되어야만 하는 처리가 들어왔을때 실행
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

	private UserRepository userRepository;
	public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
		super(authenticationManager);
		this.userRepository = userRepository;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		String uri = request.getRequestURI();
		
		//로그인(인증) 필요없는 요청은 토큰 체크하지 않는다
		if(!(uri.contains("/user") || uri.contains("/admin") || uri.contains("/manager"))) {
			chain.doFilter(request, response);
			return;
		}
		
		
		String authentication = request.getHeader(JwtProperties.HEADER_STRING);
		System.out.println(authentication);
		if(authentication == null || !authentication.startsWith(JwtProperties.TOKEN_PREFIX)) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
			return;
		}
		
		//json 형태의 문자열을 map으로 변환
//		**json형태가 아니여서 비활성화
//		ObjectMapper objectMapper = new ObjectMapper();
//		Map<String,String> token = objectMapper.readValue(authentication, Map.class);
//		System.out.println(token);
		
		//access_token : header로부터 accessToken 가져와 bear check
//		String accessToken = token.get("access_token");
		String accessToken = authentication.replace(JwtProperties.TOKEN_PREFIX, "");
				
		try {
			//1. access token check
			//1-1. 보안키, 만료시간 체크
			String username = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
									.build()
									.verify(accessToken)
									.getClaim("sub")
									.asString();
			System.out.println("Username from Token: " + username);
			if(username == null || username.isEmpty()) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				return;
			}
			//1-2. username check
			Optional<User> ouser = userRepository.findByEmail(username);
			if(ouser.isEmpty()) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				return;
			}
			
			PrincipalDetails principalDetails = new PrincipalDetails(ouser.get());
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principalDetails,null,
					principalDetails.getAuthorities());
			SecurityContextHolder.getContext().setAuthentication(auth);
			chain.doFilter(request, response);
			return;
			
			// ... (앞부분 생략)

		} catch(TokenExpiredException e) { // access token이 기간 만료되었을 때
		    e.printStackTrace();
		    
		    // 1. Refresh Token을 헤더에서 가져오기
		    // 프론트엔드에서 "RefreshToken"이라는 헤더에 값을 담아 보내준다고 가정합니다.
		    String refreshTokenHeader = request.getHeader("RefreshToken");

		    // Refresh Token이 없거나 형식이 올바르지 않으면 에러 리턴
		    if(refreshTokenHeader == null || !refreshTokenHeader.startsWith(JwtProperties.TOKEN_PREFIX)) {
		        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요 (Refresh Token 없음)");
		        return;				
		    }
		    
		    // "Bearer " 제거
		    String refreshToken = refreshTokenHeader.replace(JwtProperties.TOKEN_PREFIX, "");
		    
		    try {
		        // 2. Refresh Token 검증
		        String username = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
		                            .build()
		                            .verify(refreshToken)
		                            .getClaim("sub")
		                            .asString();
		        
		        if(username == null || username.isEmpty()) {
		            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
		            return;				
		        }
		        
		        Optional<User> ouser = userRepository.findByEmail(username);
		        if(ouser.isEmpty()) {
		            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
		            return;									
		        }
		        
		        // 3. 새 토큰 생성
		        JwtToken jwtToken = new JwtToken();
		        String nAccessToken = jwtToken.makeAccessToken(username);
		        String nRefreshToken = jwtToken.makeRefreshToken(username);
		        
		        // 4. 응답 헤더에 넣을 JSON 만들기
		        // (위에서 ObjectMapper를 지웠으므로 여기서 새로 생성해야 합니다)
		        ObjectMapper objectMapper = new ObjectMapper(); 
		        Map<String,String> mtoken = new HashMap<>();
		        mtoken.put("access_token", JwtProperties.TOKEN_PREFIX + nAccessToken);
		        mtoken.put("refresh_token", JwtProperties.TOKEN_PREFIX + nRefreshToken);
		        
		        String nToken = objectMapper.writeValueAsString(mtoken);
		        
		        // 5. Response Header에 새 토큰 세트 추가
		        // 프론트엔드의 axios interceptor가 이 헤더를 보고 토큰을 갱신합니다.
		        response.addHeader(JwtProperties.HEADER_STRING, nToken);
		        
		        // 6. 인증 처리 후 진행
		        PrincipalDetails principalDetails = new PrincipalDetails(ouser.get());
		        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
		                principalDetails, null, principalDetails.getAuthorities());
		        SecurityContextHolder.getContext().setAuthentication(auth);				
		        
		        chain.doFilter(request, response);
		        return;
		        
		    } catch(TokenExpiredException re) {  // Refresh token도 만료된 경우
		        re.printStackTrace();
		        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요 (Refresh Token 만료)");
		        return;	
		    } catch(Exception re) {
		        re.printStackTrace();
		        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 오류");
		        return;
		    }
		} catch(Exception e) {
		    e.printStackTrace();
		    // ...
		}	
	}
}
