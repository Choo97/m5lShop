-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.11.1-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 shop.cart 구조 내보내기
CREATE TABLE IF NOT EXISTS  cart  (
   num  int(6) NOT NULL AUTO_INCREMENT,
   userid  varchar(10) DEFAULT NULL,
   gCode  varchar(20) NOT NULL,
   gName  varchar(50) NOT NULL,
   gPrice  int(6) NOT NULL,
   gSize  char(1) NOT NULL,
   gColor  varchar(10) NOT NULL,
   gAmount  int(2) NOT NULL,
   gImage  varchar(20) NOT NULL,
  PRIMARY KEY ( num ),
  KEY  cart_userid_fk  ( userid ),
  KEY  cart_gCode_fk  ( gCode ),
  CONSTRAINT  cart_gCode_fk  FOREIGN KEY ( gCode ) REFERENCES  goods  ( gCode ) ON DELETE CASCADE,
  CONSTRAINT  cart_userid_fk  FOREIGN KEY ( userid ) REFERENCES  member  ( userid ) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 shop.cart:~2 rows (대략적) 내보내기
/*!40000 ALTER TABLE  cart  DISABLE KEYS */;
INSERT INTO  cart  ( num ,  userid ,  gCode ,  gName ,  gPrice ,  gSize ,  gColor ,  gAmount ,  gImage ) VALUES
	(12, 'hong', 'T10', '홀 포켓 보이 프렌드 셔츠', 27800, 'M', 'black', 1, 'top10');
/*!40000 ALTER TABLE  cart  ENABLE KEYS */;

-- 테이블 shop.goods 구조 내보내기
CREATE TABLE IF NOT EXISTS  goods  (
   gCode  varchar(20) NOT NULL,
   gCategory  varchar(20) NOT NULL,
   gName  varchar(50) NOT NULL,
   gContent  varchar(4000) NOT NULL,
   gPrice  int(6) NOT NULL,
   gImage  varchar(20) NOT NULL,
  PRIMARY KEY ( gCode )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 shop.goods:~48 rows (대략적) 내보내기
/*!40000 ALTER TABLE  goods  DISABLE KEYS */;
INSERT INTO  goods  ( gCode ,  gCategory ,  gName ,  gContent ,  gPrice ,  gImage ) VALUES
	('B1', 'bottom', '제나 레이스 스커트', '페미닌한 레이스 자수가 멋스러운 스커트', 9800, 'bottom1'),
	('B10', 'bottom', '아만다 핀턱 플레어 스커트', '자연스러운 주름이 매력적인 플레어 스커트', 11800, 'bottom10'),
	('B11', 'bottom', '플리츠 스커트 레깅스', '페미닌한 무드의 플리츠 주름 레깅스', 11800, 'bottom11'),
	('B12', 'bottom', '레이스 미디 스커트', '여성스러운 레이스 미디 스커트', 11800, 'bottom12'),
	('B2', 'bottom', '레이스 프린지 스커트', '시크하면서 트렌디한 무드의 레이스 스커트', 9800, 'bottom2'),
	('B3', 'bottom', '벨라 와이드 팬츠', '신축성 있는 소재의 와이드 핏 팬츠', 9800, 'bottom3'),
	('B4', 'bottom', '사브리나 H라인 스커트', '심플한 디자인에 H라인 미니 스커트', 9800, 'bottom4'),
	('B5', 'bottom', '베일리 롱 스커트', '데일리로 입기 좋은 베이직 디자인 롱 스커트', 9800, 'bottom5'),
	('B6', 'bottom', '컴포터블 미니 플레어 스커트', '속바지 안감이 붙어있는 베이직한 스타일의 플레어 스커트', 9800, 'bottom7'),
	('B7', 'bottom', '페일 컬러 후드 트레이닝 세트', '간편하게 입기 좋은 트레이닝 세트', 9800, 'bottom7'),
	('B8', 'bottom', '멜리사 패턴 미디 스커트', '상큼한 패턴이 돋보이는 미디 플레어 스커트', 10800, 'bottom8'),
	('B9', 'bottom', '베키 플리츠 미니 스커트', '귀엽고 사랑스러운 라인에 플리츠 미니 스커트', 11800, 'bottom9'),
	('D1', 'dress', '인디안 무드 엔틱 니들 드레스', '더블 태슬 끈과 풍성한 퍼프 슬리브 원피스', 37800, 'dress1'),
	('D10', 'dress', '벨 슬리브 스트라이프 세트', '사랑스러운 무드의 피나포어 원피스 세트', 20400, 'dress10'),
	('D11', 'dress', '엘리자베스 버스티아 드레스 세트', '골지 소재의 원피스에 데님 뷔스티에 세트', 19800, 'dress11'),
	('D12', 'dress', '퓨어 스트라이프 플레어 드레스', '청순하면서 여성스러운 스타일의 스트라이프 원피스', 19800, 'dress12'),
	('D2', 'dress', '소피아 벨트 니트 드레스', '모던하면서 페미닌한 디자인의 니트 원피스', 36800, 'dress2'),
	('D3', 'dress', '스타키아 스타일 플레어 데님 드레스', '플레어 라인으로 귀엽게 퍼지는 스타일의 데님 원피스', 34800, 'dress3'),
	('D4', 'dress', '엘레강스 골드 버튼 드레스', '골드 버튼 장식이 포인트인 플레어 미디 드레스', 33800, 'dress4'),
	('D5', 'dress', '블랙 리본 레이스 드레스', '러블리한 소매 프릴이 돋보여요!!', 24800, 'dress5'),
	('D6', 'dress', '메쉬 트위스트 롱 드레스', '스페셜한 원피스!', 24800, 'dress6'),
	('D7', 'dress', '폼폼 블라우스 체크 드레스', '귀여운 폼폼이 장식의 블라우스와 체크 원피스', 23800, 'dress7'),
	('D8', 'dress', '페미닌 플렛 벨트 드레스', '가오리핏으로 더욱 여성스러워 보이는 원피스', 23800, 'dress8'),
	('D9', 'dress', '러블리 레이스 리본 세트', '여성스러운 디자인의 세트 상품', 20800, 'dress9'),
	('O1', 'outer', '더블 버튼 블레이져', '고급스러운 느낌의 보카이 블레이져 자켓', 52800, 'outer1'),
	('O10', 'outer', '미키 마우스 소프트 베이직 코튼 가디건', '미키자수가 새겨져 있는 루즈핏 가디건', 30800, 'outer10'),
	('O11', 'outer', '스테이크 스킨 지포 라이더 자켓', '엣지있는 뱀피무늬의 라이더 자켓', 29800, 'outer11'),
	('O12', 'outer', '탑 건 롱 항공 점퍼', '레터링자수와 패치가 트렌디한 롱 항공점퍼', 29800, 'outer12'),
	('O2', 'outer', '히든 버튼 베이직 울코트', '부드러운 소재의 베이직 스타일 울코트', 52800, 'outer2'),
	('O3', 'outer', '린넨 트렌치 자켓', '클래식한 핏의 트렌치 자켓', 51800, 'outer3'),
	('O4', 'outer', '타미 베이직 자켓', '모던한 스타일에 베이직한 라인의 자켓', 48800, 'outer4'),
	('O5', 'outer', '파스텔 톤 오버 핏 코트', '부드러운 소재와 파스텔톤의 투버튼 코트', 45800, 'outer5'),
	('O6', 'outer', '티디 원 버튼 롱 블레이져', '화사한 컬러감이 돋보이는 모던하고 심플한 디자인', 41800, 'outer6'),
	('O7', 'outer', '트렌치 무드 하프 자켓', '클래식한 트렌치 무드의 하프 자켓', 39800, 'outer7'),
	('O8', 'outer', '고져스 트렌치 코트', '고급스러운 컬러감과 디자인의 트렌치 코트', 39800, 'outer8'),
	('O9', 'outer', '에밀리 루즈 핏 자켓', '오버 사이즈의 루즈핏 점퍼', 31800, 'outer9'),
	('T1', 'top', '앨리스 데님 탑', '빈티지한 느낌의 데님 프릴 슬리브스 탑', 12100, 'top1'),
	('T10', 'top', '홀 포켓 보이 프렌드 셔츠', '루즈한 핏으로 편안하게 입기 좋아요', 27800, 'top10'),
	('T11', 'top', '프린지 레이스 레이어드 블라우스', '어느 옷이든 매치하면 페미닌룩 완성', 26800, 'top11'),
	('T12', 'top', '레이스 엣지 트렌더 블라우스', '카라와 숄더라인에 레이스 디자인으로 포인트를 준 쉬폰 블라우스', 26800, 'top12'),
	('T2', 'top', '슬리브 러플 블라우스', '여성스러운 러플과 리본끈 디테일이 사랑스러운 룩', 12100, 'top2'),
	('T3', 'top', '안야 러블리 도트 튜닉', '귀엽고 걸리쉬한 도트 패턴의 튜닉', 12800, 'top3'),
	('T4', 'top', '니키타 펀칭 니트 탑', '베이직한 디자인에 펀칭으로 디테일을 준 니트탑', 8800, 'top4'),
	('T5', 'top', '펀칭 스트라이프 레이어드 탑', '펀칭과 스트라이프 패턴의 시스루 레이어드 탑', 11800, 'top5'),
	('T6', 'top', '클로에 슬리프 러플 크롭 탑', '러블리한 디자인의 소매 프릴 포인트', 9800, 'top6'),
	('T7', 'top', '올리비아 언발란스 니트 탑', '가볍고 내츄럴한 니트 소재의 브이넥 니트 탑', 9800, 'top7'),
	('T8', 'top', '백 리본 블록 체크 블라우스', '귀여운 프릴 디자인의 블록 체크 블라우스', 12800, 'top8'),
	('T9', 'top', '백 레이스 리본 니들 워크 니트', '뒷 면 리본 자수로 여성스러워요~~', 29800, 'top9');
/*!40000 ALTER TABLE  goods  ENABLE KEYS */;

-- 테이블 shop.gorder 구조 내보내기
CREATE TABLE IF NOT EXISTS  gorder  (
   num  int(11) NOT NULL AUTO_INCREMENT,
   userid  varchar(10) DEFAULT NULL,
   gCode  varchar(20) NOT NULL,
   gName  varchar(50) NOT NULL,
   gPrice  int(6) NOT NULL,
   gSize  char(1) NOT NULL,
   gColor  varchar(10) NOT NULL,
   gAmount  int(2) NOT NULL,
   gImage  varchar(20) NOT NULL,
   orderinfo_num  int(11) DEFAULT NULL,
  PRIMARY KEY ( num ),
  KEY  orderinfo_num  ( orderinfo_num ),
  CONSTRAINT  gorder_ibfk_1  FOREIGN KEY ( orderinfo_num ) REFERENCES  orderinfo  ( num )
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 shop.gorder:~12 rows (대략적) 내보내기
/*!40000 ALTER TABLE  gorder  DISABLE KEYS */;
INSERT INTO  gorder  ( num ,  userid ,  gCode ,  gName ,  gPrice ,  gSize ,  gColor ,  gAmount ,  gImage ,  orderinfo_num ) VALUES
	(1, 'hong', 'T11', '프린지 레이스 레이어드 블라우스', 26800, 'L', 'navy', 1, 'top11', 3),
	(2, 'hong', 'T11', '프린지 레이스 레이어드 블라우스', 26800, 'L', 'white', 1, 'top11', 4),
	(3, 'hong', 'T12', '레이스 엣지 트렌더 블라우스', 26800, 'L', 'navy', 1, 'top12', 5),
	(4, 'hong', 'T12', '레이스 엣지 트렌더 블라우스', 26800, 'L', 'navy', 1, 'top12', 6),
	(5, 'hong', 'T11', '프린지 레이스 레이어드 블라우스', 26800, 'M', 'navy', 1, 'top11', 7),
	(6, 'hong', 'T11', '프린지 레이스 레이어드 블라우스', 26800, 'L', 'black', 3, 'top11', 8),
	(7, 'hong', 'T10', '홀 포켓 보이 프렌드 셔츠', 27800, 'M', 'navy', 2, 'top10', 9),
	(8, 'hong', 'T2', '슬리브 러플 블라우스', 12100, 'L', 'black', 1, 'top2', 9),
	(9, 'hong', 'T7', '올리비아 언발란스 니트 탑', 9800, 'M', 'black', 1, 'top7', 10),
	(10, 'hong', 'T10', '홀 포켓 보이 프렌드 셔츠', 27800, 'M', 'black', 1, 'top10', 11),
	(11, 'hong', 'T1', '앨리스 데님 탑', 12100, 'M', 'black', 1, 'top1', 11),
	(12, 'hong', 'B1', '제나 레이스 스커트', 9800, 'L', 'navy', 1, 'bottom1', 12);
/*!40000 ALTER TABLE  gorder  ENABLE KEYS */;

-- 테이블 shop.member 구조 내보내기
CREATE TABLE IF NOT EXISTS  member  (
   userid  varchar(10) NOT NULL,
   passwd  varchar(10) NOT NULL,
   username  varchar(10) NOT NULL,
   post  varchar(6) NOT NULL,
   addr1  varchar(500) NOT NULL,
   addr2  varchar(500) NOT NULL,
   phone1  varchar(3) NOT NULL,
   phone2  varchar(4) NOT NULL,
   phone3  varchar(4) NOT NULL,
   email1  varchar(20) NOT NULL,
   email2  varchar(20) NOT NULL,
  PRIMARY KEY ( userid )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 shop.member:~3 rows (대략적) 내보내기
/*!40000 ALTER TABLE  member  DISABLE KEYS */;
INSERT INTO  member  ( userid ,  passwd ,  username ,  post ,  addr1 ,  addr2 ,  phone1 ,  phone2 ,  phone3 ,  email1 ,  email2 ) VALUES
	('hong', '1234', '홍길동', '08505', '서울 금천구 디지털로 103', '코스타2', '010', '1234', '5678', 'hong', 'naver.com'),
	('oxywom', '1234', '홍길동', '08500', '서울 금천구 가마산로 70', '호서대빌딩', '010', '1234', '1234', 'kosta', 'daum.net'),
	('song', '1234', '송길동', '04044', '서울 마포구 독막로3길 13', '', '010', '1234', '1234', 'song', 'gmail.com');
/*!40000 ALTER TABLE  member  ENABLE KEYS */;

-- 테이블 shop.orderinfo 구조 내보내기
CREATE TABLE IF NOT EXISTS  orderinfo  (
   num  int(6) NOT NULL AUTO_INCREMENT,
   userid  varchar(10) DEFAULT NULL,
   orderName  varchar(10) NOT NULL,
   post  varchar(5) NOT NULL,
   addr1  varchar(500) NOT NULL,
   addr2  varchar(500) NOT NULL,
   phone  varchar(13) NOT NULL,
   payMethod  varchar(20) NOT NULL,
   orderDay  date DEFAULT curdate(),
  PRIMARY KEY ( num ),
  KEY  orderInfo_userid_fk  ( userid ),
  CONSTRAINT  orderInfo_userid_fk  FOREIGN KEY ( userid ) REFERENCES  member  ( userid ) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 shop.orderinfo:~9 rows (대략적) 내보내기
/*!40000 ALTER TABLE  orderinfo  DISABLE KEYS */;
INSERT INTO  orderinfo  ( num ,  userid ,  orderName ,  post ,  addr1 ,  addr2 ,  phone ,  payMethod ,  orderDay ) VALUES
	(3, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(4, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(5, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(6, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(7, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(8, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(9, NULL, '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(10, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(11, 'hong', '홍길동', '08590', '서울 금천구 가산디지털1로 70', '코스타', '010-1234-5678', '신용카드', '2024-04-22'),
	(12, 'hong', '홍길동', '08505', '서울 금천구 디지털로 103', '코스타2', '010-1234-5678', '신용카드', '2024-10-07');
/*!40000 ALTER TABLE  orderinfo  ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
