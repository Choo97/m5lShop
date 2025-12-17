package com.kosta.shop;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.ProductImage;
import com.kosta.shop.entity.Review;
import com.kosta.shop.entity.ReviewImage;
import com.kosta.shop.entity.Role;
import com.kosta.shop.entity.User;
import com.kosta.shop.repository.ProductRepository;
import com.kosta.shop.repository.ReviewRepository;
import com.kosta.shop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInit implements CommandLineRunner {

	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final ReviewRepository reviewRepository;

	@Override
	@Transactional
	public void run(String... args) throws Exception {
		// DB에 상품이 하나라도 있으면 초기화하지 않음 (중복 생성 방지)
		if (productRepository.count() > 0) {
			return;
		}

		System.out.println("========== 테스트용 상품 데이터 생성 시작 (placehold.co) ==========");

		// 1. 아우터 (Outer) 데이터 생성
		createProduct("Minimal Wool Coat", 250000, "outer", "coat", true, true, false,
				Arrays.asList("#000000", "#3E2723"), "https://placehold.co/500x700/333333/ffffff?text=Wool+Coat");

		createProduct("Classic Trench Coat", 189000, "outer", "coat", false, true, false,
				Arrays.asList("#D2B48C", "#000000"), "https://placehold.co/500x700/D2B48C/ffffff?text=Trench+Coat");

		createProduct("Short Padding", 129000, "outer", "padding", true, false, true,
				Arrays.asList("#808080", "#000080"), "https://placehold.co/500x700/808080/ffffff?text=Padding");

		// 2. 상의 (Top) 데이터 생성
		createProduct("Oversized Hoodie", 59000, "top", "hoodie", false, true, false,
				Arrays.asList("#CCCCCC", "#000000", "#000080"),
				"https://placehold.co/500x700/CCCCCC/000000?text=Hoodie");

		createProduct("Basic Long Sleeve", 35000, "top", "long-sleeve", true, false, false,
				Arrays.asList("#FFFFFF", "#000000"), "https://placehold.co/500x700/FFFFFF/000000?text=Long+Sleeve");

		createProduct("Stripe Sweatshirt", 45000, "top", "sweatshirt", false, false, true,
				Arrays.asList("#000080", "#FF0000"), "https://placehold.co/500x700/000080/ffffff?text=Sweatshirt");

		// 3. 하의 (Bottom) 데이터 생성
		createProduct("Wide Denim Jeans", 69000, "bottom", "jeans", true, true, false,
				Arrays.asList("#0000FF", "#87CEEB"), "https://placehold.co/500x700/0000FF/ffffff?text=Denim");

		createProduct("Black Slacks", 49000, "bottom", "slacks", false, true, false, Arrays.asList("#000000"),
				"https://placehold.co/500x700/000000/ffffff?text=Slacks");

		// 4. 대량 데이터 생성 (페이지네이션 테스트용)
		for (int i = 1; i <= 20; i++) {
			createProduct("Basic T-Shirt " + i, 20000 + (i * 1000), "top", "short-sleeve", i % 2 == 0, // 짝수는 New
					i % 3 == 0, // 3의 배수는 Best
					i % 5 == 0, // 5의 배수는 Sale
					Arrays.asList("#FFFFFF", "#000000"),
					"https://placehold.co/500x700/eeeeee/000000?text=T-Shirt+" + i);
		}

		System.out.println("========== 테스트용 상품 데이터 생성 완료 ==========");

		createDummyReviews();
	}

	// 상품 생성 헬퍼 메서드
	private void createProduct(String name, int price, String category, String subCategory, boolean isNew,
			boolean isBest, boolean isSale, List<String> colors, String imgUrl) {

		// 1. 상품 엔티티 생성
		Product product = Product.builder().name(name).price(price).salePrice(isSale ? (int) (price * 0.8) : 0) // 세일이면
																												// 20%
																												// 할인 가격
																												// 자동 설정
				.description("이 상품은 " + name + "입니다. 미니멀한 디자인이 특징입니다.").category(category).subCategory(subCategory)
				.stockQuantity(100).isNew(isNew).isBest(isBest).isSale(isSale).colors(colors) // 색상 리스트
				.build();

		// 2. 대표 이미지 (상단)
		ProductImage mainImage = ProductImage.builder().imgName("main.jpg").oriImgName("main.jpg").imgUrl(imgUrl)
				.isRepImg(true).isDetailImg(false) // ★ false
				.product(product).build();

		// 3. 추가 이미지 (상단)
		ProductImage subImage = ProductImage.builder().imgName("sub.jpg").oriImgName("sub.jpg").imgUrl(imgUrl)
				.isRepImg(false).isDetailImg(false) // ★ false
				.product(product).build();

		// 3. ★ 상세 설명 이미지 (하단에 길게 나올 이미지)
		// 테스트용으로 세로로 긴 이미지를 placeholder로 생성
		ProductImage detailImage = ProductImage.builder().imgName("detail.jpg").oriImgName("detail.jpg")
				.imgUrl("https://placehold.co/800x1200/E3E3E3/000000?text=Detail+Description+Image").isRepImg(false)
				.isDetailImg(true) // ★ true (이게 하단에 나옴)
				.product(product).build();

		// 4. 상품에 이미지 리스트 추가
		product.getProductImages().add(mainImage);
		product.getProductImages().add(subImage);
		product.getProductImages().add(detailImage);

		// 5. DB 저장
		productRepository.save(product);
	}

	private void createDummyReviews() {
		// 리뷰를 달려면 유저와 상품이 있어야 함
		// (간단하게 첫 번째 상품에 리뷰 달기 예시)
		if (reviewRepository.count() > 0)
			return;

		List<Product> products = productRepository.findAll();
		if (products.isEmpty())
			return;
		Product targetProduct = products.get(0); // 첫 번째 상품

		// 임시 유저 생성 (없으면 만들기)
		User user = userRepository.findByEmail("test@test.com").orElseGet(() -> {
			User newUser = User.builder().email("test@test.com").username("Reviewer").nickname("패션왕").password("1234")
					.role(Role.ROLE_USER).build();
			return userRepository.save(newUser);
		});

		Review review1 = Review.builder().content("사진이랑 똑같아요! 마음에 듭니다.").rating(5).product(targetProduct).user(user)
				.build();

		Review review2 = Review.builder().content("사이즈가 생각보다 작네요.").rating(5).product(targetProduct).user(user).build();

		// 2. 이미지가 없는 리뷰 생성
		Review review3 = Review.builder().content("가성비 최고입니다. 추천해요.").rating(3).product(targetProduct).user(user)
				.build();

		review1.addReviewImage(ReviewImage.builder().imgUrl("https://placehold.co/200").build());
		review1.addReviewImage(ReviewImage.builder().imgUrl("https://placehold.co/200/orange/white").build());
		review2.addReviewImage(ReviewImage.builder().imgUrl("https://placehold.co/200").build());
		review2.addReviewImage(ReviewImage.builder().imgUrl("https://placehold.co/200/orange/white").build());

		reviewRepository.save(review1);
		reviewRepository.save(review2);
		reviewRepository.save(review3);

	}
}