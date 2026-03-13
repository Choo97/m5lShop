package com.kosta.shop;

import java.util.Arrays;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // ★ 암호화 주입
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.ProductImage;
import com.kosta.shop.entity.Review;
import com.kosta.shop.entity.ReviewImage;
import com.kosta.shop.entity.Role;
import com.kosta.shop.entity.Styling;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.ProductRepository;
import com.kosta.shop.repository.ReviewRepository;
import com.kosta.shop.repository.StylingRepository;
import com.kosta.shop.repository.UserRepository;
import com.kosta.shop.service.FileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInit implements CommandLineRunner {

	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final ReviewRepository reviewRepository;
	private final StylingRepository stylingRepository;
    private final FileService fileService; 
    private final BCryptPasswordEncoder passwordEncoder; // ★ 임시 유저 비번 암호화용
    
    @Value("${uploadPath}")
    private String uploadPath;

	@Override
	@Transactional
	public void run(String... args) throws Exception {

		createDummyUsers();

        // 1. 상품 데이터 생성 (문구점 테마)
		if (productRepository.count() == 0) {
            System.out.println("========== 테스트용 문구점 데이터 생성 시작 ==========");

            // 임시 관리자 계정 생성 (상품 등록자로 쓰기 위함)
            User adminUser = createOrGetDummyUser("admin@test.com", "Admin", "총관리자", Role.ROLE_ADMIN);

            // 1. 노트/다이어리 (Note)
            createProduct("미드나잇 감성 만년 다이어리", 18500, "note", "diary", true, true, false,
                    Arrays.asList("#000000", "#191970", "#8B4513"), "/images/diary1.jpg", adminUser);

            createProduct("심플 그리드 메모패드", 4500, "note", "memo", false, true, false,
                    Arrays.asList("#FFFFFF", "#F5F5DC"), "/images/memo1.jpg", adminUser);

            createProduct("위클리 데스크 플래너", 12000, "note", "planner", true, false, true,
                    Arrays.asList("#FFFFFF"), "/images/planner1.jpg", adminUser);

            // 2. 필기구 (Pen)
            createProduct("사각사각 무광 만년필 (F촉)", 45000, "pen", "fountain", false, true, false,
                    Arrays.asList("#000000", "#006400", "#8B0000"), "/images/fountain_pen.jpg", adminUser);

            createProduct("부드러운 젤 잉크 볼펜 0.5mm", 1500, "pen", "ballpoint", true, false, false,
                    Arrays.asList("#000000", "#FF0000", "#0000FF"), "/images/ballpoint.jpg", adminUser);

            createProduct("파스텔 형광펜 5색 세트", 6500, "pen", "highlighter", false, false, true,
                    Arrays.asList("#FFB6C1", "#E6E6FA"), "/images/highlighter.jpg", adminUser);

            // 3. 스티커/사무용품 (Sticker & Office)
            createProduct("빈티지 무드 마스킹 테이프", 3500, "sticker", "masking", true, true, false,
                    Arrays.asList("#D2B48C"), "/images/masking.jpg", adminUser);

            createProduct("원목 데스크 오거나이저", 32000, "office", "organizer", false, true, false, 
                    Arrays.asList("#8B4513"), "/images/organizer.jpg", adminUser);

            // 4. 대량 데이터 생성 (페이지네이션 테스트용)
            for (int i = 1; i <= 20; i++) {
                createProduct("소프트 컬러 볼펜 ver." + i, 1000 + (i * 100), "pen", "ballpoint", 
                        i % 2 == 0, i % 3 == 0, i % 5 == 0,
                        Arrays.asList("#000000", "#FF4500", "#4682B4"),
                        "/images/color_pen.jpg", adminUser);
            }
            System.out.println("========== 문구점 상품 데이터 생성 완료 ==========");
		}

        // 2. 리뷰 데이터 생성
        if (reviewRepository.count() == 0) {
		    createDummyReviews();
        }
		
        // 3. 스타일링 데이터 생성
        if (stylingRepository.count() == 0) {
		    createStylingDummyData();
        }
	}

	private void createDummyUsers() {
        createOrGetDummyUser("user1@test.com", "김문구", "문구덕후", Role.ROLE_USER);
        createOrGetDummyUser("user2@test.com", "이펜슬", "연필수집가", Role.ROLE_USER);
        createOrGetDummyUser("user3@test.com", "박노트", "다이어리매니아", Role.ROLE_USER);
        System.out.println("========== 일반 유저 3명 생성 완료 ==========");
    }

    // 유저 생성 헬퍼 메서드 (비밀번호 암호화 처리)
    private User createOrGetDummyUser(String email, String name, String nickname, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
			User newUser = User.builder()
                    .email(email)
                    .username(name)
                    .nickname(nickname)
                    .password(passwordEncoder.encode("1234")) // ★ 1234로 암호화 저장
					.role(role)
                    .build();
			return userRepository.save(newUser);
		});
    }

	// 상품 생성 헬퍼 메서드 (seller 추가)
	private void createProduct(String name, int price, String category, String subCategory, boolean isNew,
			boolean isBest, boolean isSale, List<String> colors, String imgUrl, User seller) {

		Product product = Product.builder()
                .name(name)
                .price(price)
                .salePrice(isSale ? (int) (price * 0.8) : 0)
				.description("이 상품은 " + name + "입니다. 감성적인 디자인이 특징입니다.")
                .category(category)
                .subCategory(subCategory)
				.stockQuantity(100)
                .isNew(isNew)
                .isBest(isBest)
                .isSale(isSale)
                .colors(colors)
                // .seller(seller) // ★ Product 엔티티에 seller 추가했다면 주석 해제하세요!
				.build();

		ProductImage mainImage = ProductImage.builder().imgName("main.jpg").oriImgName("main.jpg").imgUrl(imgUrl)
				.isRepImg(true).isDetailImg(false).product(product).build();

		ProductImage subImage = ProductImage.builder().imgName("sub.jpg").oriImgName("sub.jpg").imgUrl(imgUrl)
				.isRepImg(false).isDetailImg(false).product(product).build();

		ProductImage detailImage = ProductImage.builder().imgName("detail.jpg").oriImgName("detail.jpg")
				.imgUrl("/images/상세페이지_안내.jpg").isRepImg(false).isDetailImg(true).product(product).build();

		product.getProductImages().add(mainImage);
		product.getProductImages().add(subImage);
		product.getProductImages().add(detailImage);

		productRepository.save(product);
	}

	private void createDummyReviews() {
		List<Product> products = productRepository.findAll();
		if (products.isEmpty()) return;
		Product targetProduct = products.get(0); // 첫 번째 상품

        // 리뷰용 일반 유저 생성
		User user = createOrGetDummyUser("test@test.com", "Reviewer", "다꾸왕", Role.ROLE_USER);

		Review review1 = Review.builder().content("종이가 두꺼워서 만년필로 써도 안 비치네요! 너무 마음에 듭니다.").rating(5).product(targetProduct).user(user).build();
		Review review2 = Review.builder().content("표지 색감이 사진보다 살짝 어두워요. 그래도 예쁩니다.").rating(4).product(targetProduct).user(user).build();
		Review review3 = Review.builder().content("배송도 빠르고 포장도 꼼꼼해요. 다꾸할 생각에 신나네요!").rating(5).product(targetProduct).user(user).build();

		review1.addReviewImage(ReviewImage.builder().imgUrl("https://placehold.co/200").build());
		review1.addReviewImage(ReviewImage.builder().imgUrl("https://placehold.co/200/orange/white").build());

		reviewRepository.save(review1);
		reviewRepository.save(review2);
		reviewRepository.save(review3);
        System.out.println("========== 리뷰 데이터 생성 완료 ==========");
	}
	
	private void createStylingDummyData() {
        // 스타일링용 유저 생성
        User user = createOrGetDummyUser("style@test.com", "Stylist", "데스크테리어장인", Role.ROLE_USER);

        // 1. 다꾸 갤러리
        createStyling(user, "오늘의 다꾸 완성! 빈티지 마테가 다 했네요 ✨ #다이어리꾸미기", "/images/desk1.jpg");

        // 2. 데스크테리어
        createStyling(user, "우드톤으로 맞춘 데스크테리어 🤎 책상에 앉을 맛이 납니다.", "/images/desk2.jpg");

        // 3. 만년필
        createStyling(user, "새로 산 만년필 첫 개시! 사각거리는 소리가 힐링이에요 🖋️", "/images/desk3.jpg");

        // 4. 사무용품
        createStyling(user, "심플한 회사 책상 세팅. 업무 효율이 올라가는 기분!", "/images/desk4.jpg");
        
        System.out.println("========== 다꾸 갤러리 데이터 생성 완료 ==========");
    }
	
	private void createStyling(User user, String content, String imgUrl) {
        Styling styling = Styling.builder()
                .content(content)
                .imageUrl(imgUrl) 
                .user(user)
                .build();
        
        stylingRepository.save(styling);
    }
}