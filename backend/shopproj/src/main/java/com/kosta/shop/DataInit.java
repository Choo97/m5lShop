package com.kosta.shop;

import com.kosta.shop.entity.Product;
import com.kosta.shop.entity.ProductImage;
import com.kosta.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInit implements CommandLineRunner {

    private final ProductRepository productRepository;

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
                Arrays.asList("#000000", "#3E2723"), 
                "https://placehold.co/500x700/333333/ffffff?text=Wool+Coat");

        createProduct("Classic Trench Coat", 189000, "outer", "coat", false, true, false,
                Arrays.asList("#D2B48C", "#000000"),
                "https://placehold.co/500x700/D2B48C/ffffff?text=Trench+Coat");

        createProduct("Short Padding", 129000, "outer", "padding", true, false, true,
                Arrays.asList("#808080", "#000080"),
                "https://placehold.co/500x700/808080/ffffff?text=Padding");

        // 2. 상의 (Top) 데이터 생성
        createProduct("Oversized Hoodie", 59000, "top", "hoodie", false, true, false,
                Arrays.asList("#CCCCCC", "#000000", "#000080"),
                "https://placehold.co/500x700/CCCCCC/000000?text=Hoodie");

        createProduct("Basic Long Sleeve", 35000, "top", "long-sleeve", true, false, false,
                Arrays.asList("#FFFFFF", "#000000"),
                "https://placehold.co/500x700/FFFFFF/000000?text=Long+Sleeve");

        createProduct("Stripe Sweatshirt", 45000, "top", "sweatshirt", false, false, true,
                Arrays.asList("#000080", "#FF0000"),
                "https://placehold.co/500x700/000080/ffffff?text=Sweatshirt");

        // 3. 하의 (Bottom) 데이터 생성
        createProduct("Wide Denim Jeans", 69000, "bottom", "jeans", true, true, false,
                Arrays.asList("#0000FF", "#87CEEB"),
                "https://placehold.co/500x700/0000FF/ffffff?text=Denim");

        createProduct("Black Slacks", 49000, "bottom", "slacks", false, true, false,
                Arrays.asList("#000000"),
                "https://placehold.co/500x700/000000/ffffff?text=Slacks");

        // 4. 대량 데이터 생성 (페이지네이션 테스트용)
        for (int i = 1; i <= 20; i++) {
            createProduct("Basic T-Shirt " + i, 20000 + (i * 1000), "top", "short-sleeve", 
                    i % 2 == 0, // 짝수는 New
                    i % 3 == 0, // 3의 배수는 Best
                    i % 5 == 0, // 5의 배수는 Sale
                    Arrays.asList("#FFFFFF", "#000000"),
                    "https://placehold.co/500x700/eeeeee/000000?text=T-Shirt+" + i);
        }

        System.out.println("========== 테스트용 상품 데이터 생성 완료 ==========");
    }

    // 상품 생성 헬퍼 메서드
    private void createProduct(String name, int price, String category, String subCategory,
                               boolean isNew, boolean isBest, boolean isSale,
                               List<String> colors, String imgUrl) {

        // 1. 상품 엔티티 생성
        Product product = Product.builder()
                .name(name)
                .price(price)
                .salePrice(isSale ? (int)(price * 0.8) : 0) // 세일이면 20% 할인 가격 자동 설정
                .description("이 상품은 " + name + "입니다. 미니멀한 디자인이 특징입니다.")
                .category(category)
                .subCategory(subCategory)
                .stockQuantity(100)
                .isNew(isNew)
                .isBest(isBest)
                .isSale(isSale)
                .colors(colors) // 색상 리스트
                .build();

        // 2. 이미지 엔티티 생성 (대표 이미지)
        ProductImage mainImage = ProductImage.builder()
                .imgName("sample.jpg")
                .oriImgName("sample.jpg")
                .imgUrl(imgUrl) 
                .isRepImg(true) // 대표 이미지 설정
                .product(product) // 연관관계 설정
                .build();

        // 3. 이미지 엔티티 생성 (상세 이미지 - 예시로 1개 더 추가)
        ProductImage detailImage = ProductImage.builder()
                .imgName("detail.jpg")
                .oriImgName("detail.jpg")
                .imgUrl(imgUrl) // 상세도 같은 이미지로 임시 설정
                .isRepImg(false)
                .product(product)
                .build();

        // 4. 상품에 이미지 리스트 추가
        product.getProductImages().add(mainImage);
        product.getProductImages().add(detailImage);

        // 5. DB 저장
        productRepository.save(product);
    }
}