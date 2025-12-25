package com.kosta.shop.service;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.shop.dto.StylingDto;
import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.Styling;
import com.kosta.shop.entity.StylingComment;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.ProductRepository;
import com.kosta.shop.repository.StylingCommentRepository;
import com.kosta.shop.repository.StylingRepository;
import com.kosta.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StylingServiceImpl implements StylingService {

    @Value("${uploadPath}")
    private String uploadPath;

    private final StylingRepository stylingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final StylingCommentRepository stylingCommentRepository; // 주입 필요
    private final FileService fileService; // 이미 만들어둔 파일 서비스

 // ★ 댓글 등록
    @Override
    @Transactional
    public void addComment(Long stylingId, String content, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Styling styling = stylingRepository.findById(stylingId).orElseThrow();

        StylingComment comment = StylingComment.builder()
                .content(content)
                .styling(styling)
                .user(user)
                .build();
        
        styling.addComment(comment); // 리스트에도 추가
        stylingCommentRepository.save(comment);
    }

    // ★ 댓글 삭제
    @Override
    public void deleteComment(Long commentId, String email) {
        StylingComment comment = stylingCommentRepository.findById(commentId).orElseThrow();
        if (!comment.getUser().getEmail().equals(email)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        stylingCommentRepository.delete(comment);
    }
    
    @Override
    @Transactional
    public void createStyling(StylingDto.Request request, MultipartFile file, String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("회원 없음"));

        String imgUrl = "";
        if (file != null && !file.isEmpty()) {
            String savedFileName = fileService.uploadFile(uploadPath, file.getOriginalFilename(), file.getBytes());
            imgUrl = "/images/" + savedFileName; // WebMvcConfig 설정 경로
        }

        Styling styling = Styling.builder()
                .content(request.getContent())
                .imageUrl(imgUrl)
                .user(user)
                .build();

        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            for (Long productId : request.getProductIds()) {
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new EntityNotFoundException("상품 없음"));
                
                styling.addProduct(product); // 엔티티 메서드 호출
            }
        }
        
        stylingRepository.save(styling);
    }

    @Override
    public Page<StylingDto.Response> getStylingList(Pageable pageable) {
        return stylingRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(StylingDto.Response::from);
    }
    
    @Override
    @Transactional // 조회수 변경(Update)이 일어나므로 readOnly=false
    public StylingDto.Response getStylingDetail(Long id, String email) {
        Styling styling = stylingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 없습니다."));
        
        styling.increaseViewCount(); // 조회수 증가 (Entity에 메소드 필요)
        
        return StylingDto.Response.from(styling, email);
    }
}