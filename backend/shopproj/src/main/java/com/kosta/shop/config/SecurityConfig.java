package com.kosta.shop.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.kosta.shop.config.jwt.JwtAuthenticationFilter;
import com.kosta.shop.config.jwt.JwtAuthorizationFilter;
import com.kosta.shop.config.oauth.OAuth2SuccessHandler;
import com.kosta.shop.config.oauth.PrincipalOAuth2UserService;
import com.kosta.shop.repository.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PrincipalOAuth2UserService principalOAuth2UserService; 
	
	@Autowired
	private OAuth2SuccessHandler oAuth2SuccessHandler;
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
		http.cors() //다른 도메인 접근 허용, @Bean 에 의해 생성된 CorsFilter 자동으로 설정됨
			.and()
			.csrf().disable() //csrf 공격 비활성화
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); //session 비활성화
		
		http.formLogin().disable() //로그인 폼 비활성화
			.httpBasic().disable() //httpBasic은 header에 username, password를 암호화하지 않은 상태로 주고받는다. 이를 사용하지 않겠다는 의미
			.addFilterAt(new JwtAuthenticationFilter(authenticationManager,userRepository), UsernamePasswordAuthenticationFilter.class);
		
		//소셜 로그인
		http.oauth2Login()
			.authorizationEndpoint().baseUri("/oauth2/authorization")  //
			.and()
			.redirectionEndpoint().baseUri("/social/*")
			.and().userInfoEndpoint().userService(principalOAuth2UserService) // 카카오나 네이버로 사용자 정보를 받아 인증처리
			.and()
			.successHandler(oAuth2SuccessHandler); //인증 성공 후 토큰 만들어 리엑트에 전송
		
		http.addFilter(new JwtAuthorizationFilter(authenticationManager, userRepository))
			.authorizeRequests()
			.antMatchers("/user/**").authenticated()  // 로그인 필요
			.antMatchers("/admin/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_MANAGER')")
			.antMatchers("/manager/**").access("hasRole('ROLE_MANAGER')")
			.anyRequest().permitAll();
		
		return http.build();		
	}
	
	@Bean
	public BCryptPasswordEncoder encoderPassword() {
		return new BCryptPasswordEncoder();
	}

}
