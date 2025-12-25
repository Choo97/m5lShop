package com.kosta.shop.dto;

import com.kosta.shop.entity.Role;
import com.kosta.shop.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
public class UserJoinDto {

    // 프론트엔드의 submitData 키값과 일치해야 합니다.
	@NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email(message = "이메일 형식으로 입력해주세요.")
    private String email;
	
    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    private String password;

    @NotBlank(message = "이름은 필수 입력 값입니다.")
    private String name;

    @NotBlank(message = "닉네임은 필수 입력 값입니다.")
    private String nickname;

    private String phone;
    private String rrn;     // 주민번호 (앞뒤 합친 것)
    private String gender;  // male, female 등
    private String zipcode;
    private String address;
    private String detailAddress;
    
    private String role;    // "ROLE_USER" 문자열로 넘어옴

    // DTO -> Entity 변환 편의 메서드
    // (비밀번호는 암호화해서 넣어야 하므로 파라미터로 받음)
    public User toEntity(String encodedPassword) {
        return User.builder()
                .username(this.name)
                .password(encodedPassword) // 암호화된 비밀번호 저장
                .nickname(this.nickname)
                .email(this.email)
                .phone(this.phone)
                .rrn(this.rrn) // Converter가 동작하여 자동 암호화됨
                .gender(this.gender)
                .zipcode(this.zipcode)
                .address(this.address)
                .detailAddress(this.detailAddress)
                .role(Role.valueOf(this.role)) // String -> Enum 변환
                .build();
    }
}