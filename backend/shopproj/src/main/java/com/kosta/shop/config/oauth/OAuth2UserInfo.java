package com.kosta.shop.config.oauth;

public interface OAuth2UserInfo {
	String getProviderId(); //네이버,카카오 ㅇ
	String getProvider(); //네이버,카카오 ㅇ
	String getEmail(); //네이버,카카오 ㅇ
	String getName(); //네이버,카카오 ㅇ
	String getNickname(); //네이버,카카오 o
	String getProfileImage(); //네이버,카카오 ㅇ
	String getGender(); //네이버,카카오 ㅇ
	String getAgeRange(); // 연령대(범위) 예) 20-29
	String getBirthDay(); //네이버,카카오 ㅇ
	String getBirthYear(); //네이버,카카오 ㅇ
	String getMobile(); //네이버,카카오 ㅇ
	String getShippingAddress(); //카카오 ㅇ
}
