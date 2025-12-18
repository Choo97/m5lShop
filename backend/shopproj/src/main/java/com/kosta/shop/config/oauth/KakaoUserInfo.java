package com.kosta.shop.config.oauth;

import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class KakaoUserInfo implements OAuth2UserInfo {

	private Map<String,Object> attributes;
	private Map<String,Object> properties;
	private Map<String,Object> account;
	
	public KakaoUserInfo(Map<String,Object> attributes, Map<String,Object> properties, Map<String,Object> account) {
		this.attributes = attributes;
		this.properties = properties;
		this.account = account;
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
		return String.valueOf(account.get("email"));
	}

	@Override
	public String getName() {
		return String.valueOf(account.get("name"));
	}

	@Override
	public String getProfileImage() {
		return (String)properties.get("profile_image");
	}

	@Override
	public String getNickname() {
		return (String)properties.get("nickname");
	}

	@Override
	public String getGender() {
		String gender = String.valueOf(account.get("gender"));
		
		return gender.equals("male") ? "남자" : "여자" ;
	}

	@Override
	public String getAgeRange() {
		return String.valueOf(account.get("age_range"));
	}

	@Override
	public String getBirthDay() {
		return String.valueOf(account.get("birthday"));
	}

	@Override
	public String getBirthYear() {
		return String.valueOf(account.get("birthyear"));
	}

	@Override
	public String getMobile() {
		String phone = String.valueOf(account.get("phone_number"));
		
		return convertPhoneNumber(phone);
	}

	@Override
	public String getShippingAddress() {
		return null;
	}

	public String convertPhoneNumber(String input) {
	    // input: "+82 10-0000-0000"

	    // 1. 숫자만 남기고 나머지(+, -, 공백) 다 제거
	    // 결과: "821000000000"
	    String onlyNumber = input.replaceAll("[^0-9]", ""); 

	    // 2. 맨 앞이 '82'로 시작하면 '0'으로 교체
	    if (onlyNumber.startsWith("82")) {
	        // 82를 잘라내고 앞에 0을 붙임
	        return "0" + onlyNumber.substring(2);
	    }
	    
	    // 82로 시작 안 하면(이미 010... 이면) 그대로 반환
	    return onlyNumber;
	}
}
