package com.kosta.shop.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.dto.UserUpdateDto;
import com.kosta.shop.entity.User;
import com.kosta.shop.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	private UserService userService;

	// 현재 로그인한 유저 정보 반환
	@GetMapping("/me")
	public User getCurrentUser(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return principalDetails.getUser();
	}

	@PatchMapping("/me")
	public ResponseEntity<String> updateUserInfo(@RequestBody UserUpdateDto dto,
			@AuthenticationPrincipal PrincipalDetails principal) {
		try {
			userService.updateUserInfo(principal.getUser().getEmail(), dto);
			return new ResponseEntity<>("회원 정보가 수정되었습니다.", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/social")
	public ResponseEntity<Map<String, Boolean>> getSocialStatus(@AuthenticationPrincipal PrincipalDetails principal) {
		Map<String, Boolean> status = userService.getSocialStatus(principal.getUser().getEmail());
		return ResponseEntity.ok(status);
	}

	@PostMapping("/profile")
	public ResponseEntity<String> updateProfileImage(@RequestParam("file") MultipartFile file,
			@AuthenticationPrincipal PrincipalDetails principal) {
		try {
			String newImgUrl = userService.updateProfileImage(principal.getUser().getEmail(), file);
			return ResponseEntity.ok(newImgUrl); // 바뀐 이미지 주소를 리턴
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("이미지 업로드 실패", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}