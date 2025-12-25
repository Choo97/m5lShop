package com.kosta.shop.controller;

import com.kosta.shop.auth.PrincipalDetails;
import com.kosta.shop.dto.StylingDto;
import com.kosta.shop.service.StylingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/styling")
@RequiredArgsConstructor
public class StylingController {

    private final StylingService stylingService;

    // 목록 조회
    @GetMapping
    public ResponseEntity<Page<StylingDto.Response>> getList(
            @PageableDefault(size = 9, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(stylingService.getStylingList(pageable));
    }

    // 글 작성 (이미지 포함)
    @PostMapping
    public ResponseEntity<String> create(
            @RequestPart(value = "data") StylingDto.Request request,
            @RequestPart(value = "file") MultipartFile file,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        try {
            stylingService.createStyling(request, file, principal.getUser().getEmail());
            return new ResponseEntity<>("스타일이 등록되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
 // 상세 조회 (수정)
    @GetMapping("/{id}")
    public ResponseEntity<StylingDto.Response> getDetail(
            @PathVariable Long id, 
            @AuthenticationPrincipal PrincipalDetails principal // 로그인 정보 받기
    ) {
        String email = (principal != null) ? principal.getUser().getEmail() : null;
        return ResponseEntity.ok(stylingService.getStylingDetail(id, email));
    }

    // ★ 댓글 등록
    @PostMapping("/{id}/comment")
    public ResponseEntity<String> addComment(
            @PathVariable Long id,
            @RequestBody StylingDto.CommentRequest req,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        stylingService.addComment(id, req.getContent(), principal.getUser().getEmail());
        return ResponseEntity.ok("댓글이 등록되었습니다.");
    }

    // ★ 댓글 삭제
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal PrincipalDetails principal
    ) {
        stylingService.deleteComment(commentId, principal.getUser().getEmail());
        return ResponseEntity.ok("댓글이 삭제되었습니다.");
    }
}