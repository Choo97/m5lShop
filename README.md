# m5lShop
미니멀리즘 웹쇼핑몰 토이프로젝트

| 구현중인 기능 |
## 백엔드
- 상품카테고리 (ㅇ)
- 로그인 (ㅇ) - 계정통합기능 구현중
- 장바구니 (ㅇ)
- 찜하기
- 결제 (ㅇ)

.
## 프론트엔드
- 메인페이지 (ㅇ)
- 상품페이지 (ㅇ)
- 공지사항페이지
- 커뮤니티페이지
- 장바구니페이지 (ㅇ)
- 결제페이지 (ㅇ)

# 현재 문제점

현재 문제 가끔씩 무슨문제인지 모를 로그인이 풀리는 현상이 있음

# 개발 주의사항

## 엔티티 생성시 Q파일 자동으로 빌드 기능

터미널 실행 후 백엔드 프로잭트에서'./gradlew compileJava -t'  다음 명령어 실행
eclipse - window - Show view - terminal - 터미널아이콘 클릭
cd /Documents/react-workspace/shopProject/backend/shopproj
./gradlew compileJava -t

# 백엔드

엔티티 변경시

벡엔드프로젝트 내에 build 폴더 지우기

그리고 이클립스에서 빌드 클린하기, 그 후 그레들 테스크 > 빌드 > 빌드 하기, 그레이들 리프레시하기
그 후 이클립스 프로젝트 우클릭 후 리프레시 하기
프로젝트 내에 build/generated/.../entity에 QEntity.java생성되면 완료

*만약 생성이 안된다.
프로젝트 우클릭 > properties클릭.
java build path > source > add folder
-- build/generated/querydsl 체크 후 apply / close.
그 후 위 과정 실행.

# 구현중인 기능

리뷰 작성하기(주문 내역페이지에서) 및 리뷰보기(상세페이지에서)