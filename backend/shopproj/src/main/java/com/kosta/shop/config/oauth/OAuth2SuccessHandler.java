package com.kosta.shop.config.oauth;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.config.jwt.JwtProperties;
import com.kosta.shop.config.jwt.JwtToken;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	
	private JwtToken jwtToken = new JwtToken();
	
	@Value("${react-token-uri}")
	private String reactTokenUri;
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		
		PrincipalDetails principalDetails = (PrincipalDetails)authentication.getPrincipal();
		
	    String email = principalDetails.getUser().getEmail(); 
		
		String accessToken = jwtToken.makeAccessToken(email);
		String refreshToken = jwtToken.makeRefreshToken(email);

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,String> map = new HashMap<>();
		map.put("access_token", JwtProperties.TOKEN_PREFIX+accessToken);
		map.put("refresh_token", JwtProperties.TOKEN_PREFIX+refreshToken);
		
		String token = objectMapper.writeValueAsString(map);
		System.out.println(token);
		
		String targetUrl = UriComponentsBuilder.fromUriString(reactTokenUri)
							.queryParam("token", token)
							.build().toString();
		
		getRedirectStrategy().sendRedirect(request, response, targetUrl);
	}
}
