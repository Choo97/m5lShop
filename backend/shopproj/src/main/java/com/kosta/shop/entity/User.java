package com.kosta.shop.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.kosta.shop.entity.convertor.RrnConverter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper=false) // ★ 이 줄을 추가하세요!
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users") // 테이블 명시
public class User extends BaseTimeEntity{
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;
	@Column(nullable = false, length = 100, unique = true)
	private String email;
	@Column(nullable = false, length = 100)
	private String password;
	@Column(nullable = false, length = 50)
	private String username;
	@Column(nullable = false, length = 50, unique = true)
	private String nickname;
	@Column(length = 20)
	private String phone;
	@Column(columnDefinition = "VARCHAR(255) COMMENT '회원 주민등록번호'")
	@Convert(converter = RrnConverter.class) // ★ 이 한 줄이면 끝!
    private String rrn;
	@Column(length = 20)
	private String ageRange;
	@Column
    private LocalDate birthDate; 
	@Column(length = 20)
	private String gender;
	@Column(length = 10)
	private String zipcode;
	@Column(length = 100)
	private String address;
	@Column(length = 100)
	private String detailAddress;
	@Enumerated(EnumType.STRING)
	private Role role; // ROLE_USER, ROLE_ADMIN, ROLE_GUEST

	@Column
	private String profileImage;
	
	//OAuth를 위해 만든 필드
	@Column
	private String provider;
	@Column
	private String providerId;
	
	public String getRoles() {
        return this.role != null ? this.role.name() : "";
    }
		
}

