import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // X 아이콘 (버전 6이상 필요)
// 만약 fa6 에러가 나면: import { FaTwitter as FaXTwitter } from 'react-icons/fa'; 로 대체하세요.

import '../App.css'; 
import './Footer.css'; // Footer 전용 CSS

const Footer = () => {
  return (
    <footer className="custom-footer">
      <Container>
        
        {/* 1. 소셜 미디어 링크 */}
        <Row>
          <Col>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-icon-link" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-icon-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-icon-link" aria-label="X (Twitter)">
                <FaXTwitter />
              </a>
            </div>
          </Col>
        </Row>

        {/* 2. 회사 정보 (주소, 이메일, 전화번호) */}
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <div className="footer-info-text">
              <span>서울특별시 강남구 테헤란로 123 미니멀빌딩 4층</span>
              <br className="d-block d-md-none" /> {/* 모바일에서는 줄바꿈 */}
              <span className="d-none d-md-inline info-divider">|</span>
              
              <span>contact@minimalshop.com</span>
              <br className="d-block d-md-none" />
              <span className="d-none d-md-inline info-divider">|</span>
              
              <span>Tel. 02-1234-5678</span>
            </div>
          </Col>
        </Row>

        {/* 3. 회사 로고 */}
        <Row>
          <Col>
            <div className="footer-logo-text">
              MINIMAL SHOP
            </div>
            <div style={{ fontSize: '0.7rem', color: '#ccc', marginTop: '5px' }}>
              &copy; 2024 Minimal Shop. All rights reserved.
            </div>
          </Col>
        </Row>

      </Container>
    </footer>
  );
};

export default Footer;