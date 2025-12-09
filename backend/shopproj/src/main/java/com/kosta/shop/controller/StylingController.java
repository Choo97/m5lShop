package com.kosta.shop.controller;

import com.kosta.shop.dto.StylingDto;
import com.kosta.shop.entity.Styling;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.StylingRepository;
import com.kosta.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/styling")
@RequiredArgsConstructor
public class StylingController {

    private final StylingRepository stylingRepository;
    private final UserRepository userRepository;
    // private final FileService fileService; // 파일 저장 서비스 필요

    // 1. 목록 조회
    @GetMapping
    public Page<StylingDto.Response> getStylingList(@PageableDefault(size = 12) Pageable pageable) {
        return stylingRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(StylingDto.Response::from);
    }

    // 2. 글 작성 (이미지 업로드 포함)
    @PostMapping
    public void createStyling(
            @RequestPart(value = "data") StylingDto.Request request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Principal principal) {
        
        // 유저 찾기
        // User user = userRepository.findByUsername(principal.getName()).orElseThrow();

        // 파일 저장 로직 (생략 - 실제로는 여기서 C:/shop/styling/.. 에 저장하고 경로를 받음)
        // String imgUrl = fileService.upload(file); 
        String imgUrl = "https://placehold.co/600x800"; // 임시 이미지

        // DB 저장
        // stylingRepository.save(new Styling(request.getContent(), imgUrl, user));
    }
}