package com.kosta.shop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

@Service
@Slf4j
public class FileServiceImpl implements FileService{

	@Override
    public String uploadFile(String uploadPath, String originalFileName, byte[] fileData) throws Exception {
        // 1. 파일명 중복 방지를 위한 UUID 생성
        UUID uuid = UUID.randomUUID();
        
        // 2. 확장자 추출 (예: .jpg)
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        
        // 3. 저장될 파일 이름 (예: asd32-123sd.jpg)
        String savedFileName = uuid.toString() + extension;
        
        // 4. 전체 경로 (예: C:/shop/item/asd32-123sd.jpg)
        String fileUploadFullUrl = uploadPath + "/" + savedFileName;
        
        // 5. 파일 저장
        FileOutputStream fos = new FileOutputStream(fileUploadFullUrl);
        fos.write(fileData);
        fos.close();
        
        return savedFileName;
    }

	@Override
    public void deleteFile(String filePath) {
        File deleteFile = new File(filePath);
        if(deleteFile.exists()) {
            deleteFile.delete();
            log.info("파일을 삭제하였습니다.");
        } else {
            log.info("파일이 존재하지 않습니다.");
        }
    }
}