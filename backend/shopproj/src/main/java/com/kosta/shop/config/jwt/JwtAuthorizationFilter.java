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
import com.kosta.board.auth.PrincipalDetails;
import com.kosta.board.entity.User;
import com.kosta.board.repository.UserRepository;

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
		if(authentication==null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
			return;
		}
		
		//json 형태의 문자열을 map으로 변환
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,String> token = objectMapper.readValue(authentication, Map.class);
		System.out.println(token);
		
		//access_token : header로부터 accessToken 가져와 bear check
		String accessToken = token.get("access_token");
		if(!accessToken.startsWith(JwtProperties.TOKEN_PREFIX)) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
			return;
		}
		//access token에서 Bearer 삭제
		accessToken = accessToken.replace(JwtProperties.TOKEN_PREFIX, "");
		
		try {
			//1. access token check
			//1-1. 보안키, 만료시간 체크
			String username = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
									.build()
									.verify(accessToken)
									.getClaim("sub")
									.asString();
			System.out.println(username);
			if(username == null || username.isEmpty()) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				return;
			}
			//1-2. username check
			Optional<User> ouser = userRepository.findById(username);
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
			
		} catch(TokenExpiredException e) { //access token이 기간 만료되었을때 refresh token check 함
			e.printStackTrace();
			//1. refresh token 타당할 경우
			String refreshToken = token.get("refresh_token");

			if(!refreshToken.startsWith(JwtProperties.TOKEN_PREFIX)) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				return;				
			}
			
			refreshToken = refreshToken.replace(JwtProperties.TOKEN_PREFIX, "");
			
			try {
				String username = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
									.build()
									.verify(refreshToken)
									.getClaim("sub")
									.asString();
				if(username == null || username.isEmpty()) {
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
					return;				
				}
				
				Optional<User> ouser =  userRepository.findById(username);
				if(ouser.isEmpty()) {
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
					return;									
				}
				
				//새 토큰 생성
				JwtToken jwtToken = new JwtToken();
				String nAccessToken = jwtToken.makeAccessToken(username);
				String nRefreshToken = jwtToken.makeRefreshToken(username);
				
				Map<String,String> mtoken = new HashMap<>();
				mtoken.put("access_token", JwtProperties.TOKEN_PREFIX+nAccessToken);
				mtoken.put("refresh_token", JwtProperties.TOKEN_PREFIX+nRefreshToken);
				
				String nToken = objectMapper.writeValueAsString(mtoken);
				
				//response header에 새로 만든 토큰을 넣어준다.
				response.addHeader(JwtProperties.HEADER_STRING, nToken);
				
				PrincipalDetails principalDetails = new PrincipalDetails(ouser.get());
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principalDetails,null,
						principalDetails.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(auth);				
				chain.doFilter(request, response);
				return;
				
			} catch(TokenExpiredException re) {  //2. refresh token 기간 만료
				re.printStackTrace();
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				return;				
			}
		} catch(Exception e) {
			e.printStackTrace();
		}		
	}
}
