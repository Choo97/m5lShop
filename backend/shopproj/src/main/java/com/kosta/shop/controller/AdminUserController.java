package com.kosta.shop.controller;

import com.kosta.shop.dto.AdminUserDto;
import com.kosta.shop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    // 1. 전체 회원 목록 조회
    @GetMapping
    public ResponseEntity<List<AdminUserDto>> getUserList() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 2. 회원 강제 탈퇴
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("회원이 삭제되었습니다.");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 3. 권한 변경 (USER <-> ADMIN)
    @PatchMapping("/{userId}/role")
    public ResponseEntity<String> changeRole(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        try {
            userService.changeRole(userId, body.get("role"));
            return ResponseEntity.ok("권한이 변경되었습니다.");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}