package com.kosta.shop.config.oauth;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo {
	private Map<String, Object> attributes ;
	
	
	public NaverUserInfo(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	@Override
	public String getProviderId() {
		return (String)attributes.get("id");
	}

	@Override
	public String getProvider() {
		return "Naver";
	}

	@Override
	public String getEmail() {
		return (String)attributes.get("email");
	}

	@Override
	public String getName() {
		return (String)attributes.get("name");
	}

	@Override
	public String getProfileImage() {
		return (String)attributes.get("profile_image");
	}

	@Override
	public String getNickname() {
		return (String)attributes.get("nickname");
	}

	@Override
	public String getGender() {
		return (String)attributes.get("gender");
	}

	@Override
	public String getAgeRange() {
		return (String)attributes.get("age");
	}

	@Override
	public String getBirthYear() {
		return (String)attributes.get("birthyear");
	}
	
	@Override
	public String getBirthDay() {
		// TODO Auto-generated method stub
		return (String)attributes.get("birthday");
	}

	@Override
	public String getMobile() {
		// TODO Auto-generated method stub
		return (String)attributes.get("mobile");
	}

	@Override
	public String getShippingAddress() {
		// TODO Auto-generated method stub
		return null;
	}

}
