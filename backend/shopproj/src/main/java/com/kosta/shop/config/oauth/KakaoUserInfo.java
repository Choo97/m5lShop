package com.kosta.shop.config.oauth;

import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo {

	private Map<String,Object> attributes;
	private Map<String,Object> properties;
	
	public KakaoUserInfo(Map<String,Object> attributes, Map<String,Object> properties) {
		this.attributes = attributes;
		this.properties = properties;
	}
	
	@Override
	public String getProviderId() {
		return String.valueOf(attributes.get("id"));
	}

	@Override
	public String getProvider() {
		return "Kakao";
	}

	@Override
	public String getEmail() {
		return null;
	}

	@Override
	public String getName() {
		return (String)properties.get("nickname");
	}

	@Override
	public String getProfileImage() {
		return (String)properties.get("profile_image");
	}

}
