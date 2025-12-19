package com.kosta.shop.service;

import com.kosta.shop.dto.StylingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface StylingService {
    Page<StylingDto.Response> getStylingList(Pageable pageable);
    public void createStyling(StylingDto.Request request, MultipartFile file, String email) throws Exception; 
}