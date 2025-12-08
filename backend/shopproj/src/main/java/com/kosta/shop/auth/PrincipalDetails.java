package com.kosta.shop.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.kosta.board.entity.User;

import lombok.Data;
// security가 /loginProc 주소를 낚아채서 로그인 한다.
// 로그인 진행이 완료가 되면 security session을 만들어 준다(Security ContextHolder)
// security session에 들어가는 타입은 Authentication 타입의 객체여야 한다.
// 그래서, Authentication 안에 User 정보를 넣어야 한다.
// 그 User 오브젝트 타입은 UserDetails 타입이어야 한다.
// 즉, (Security ContextHoder (new Authentication(new UserDetails(new User)))
@Data
public class PrincipalDetails implements UserDetails , OAuth2User {
	private User user;
	private Map<String, Object> attributes;
	
	public PrincipalDetails(User user) {
		this.user=user;
	}
	
	public PrincipalDetails(User user, Map<String, Object> attributes) {
		super();
		this.user = user;
		this.attributes = attributes;
	}	

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collect = new ArrayList<>();
		collect.add(()->user.getRoles());
		return collect;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return user.getUsername();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		//우리 사이트에서 1년동안 로그인을 안하면 휴먼 계정으로 변하기로 했다면
		//현재시간 - 마지막 로그인한 시간을 계산하여 1년 초과하면 return false;
		return true;
	}

	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}

	@Override
	public String getName() {
		return user.getUsername();
	}

}
