import React, { useState } from 'react';
import { 
  Form, FormGroup, Label, Input, Button, 
  Row, Col, Container 
} from 'reactstrap';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 눈 아이콘
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // 위 CSS 파일
import './Signup.css'; // Signup 전용 CSS

const SignupPage = () => {
  const navigate = useNavigate();

  // Daum 주소 스크립트 URL
  const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const openPostcode = useDaumPostcodePopup(scriptUrl);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: 'male', // 기본값 남성
    birthFront: '', // 생년월일 6자리
    birthBack: '',  // 주민번호 뒷 7자리
    phone: '',
    address: '',
    detailAddress: ''
  });

  // 비밀번호 보이기/숨기기 토글 상태
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // 유효성 검사 상태 (비밀번호 에러 표시용)
  const [passwordError, setPasswordError] = useState(false);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 비밀번호 입력 시 유효성 실시간 체크
    if (name === 'password') {
      validatePassword(value);
    }
  };

  // 비밀번호 정규식 검사 (영문+숫자+특수문자 포함, 10자리 이상)
  const validatePassword = (pw) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/;
    if (!regex.test(pw) && pw.length > 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  // 주소 검색 완료 핸들러 (예제 코드 활용)
  const handleAddressComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    // 주소 상태 업데이트
    setFormData((prev) => ({ ...prev, address: fullAddress }));
  };

  // 주소 찾기 버튼 클릭
  const handleAddressClick = () => {
    openPostcode({ onComplete: handleAddressComplete });
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    // 간단한 유효성 검사
    if (passwordError) return alert('비밀번호 형식을 확인해주세요.');
    if (formData.password !== formData.confirmPassword) return alert('비밀번호가 일치하지 않습니다.');
    if (!formData.email || !formData.name) return alert('필수 정보를 입력해주세요.');

    try {
      // 주민번호 합치기 로직 등은 백엔드 스펙에 맞게 조정
      const submitData = {
        ...formData,
        residentNumber: `${formData.birthFront}-${formData.birthBack}`
      };

      // 백엔드 전송
      // await axios.post('/api/auth/signup', submitData);
      
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>

      <Form>
        {/* 이메일 */}
        <FormGroup>
          <Label className="form-label-custom">이메일</Label>
          <Input 
            type="email" 
            name="email" 
            placeholder="Email" 
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>

        {/* 비밀번호 */}
        <FormGroup>
          <Label className="form-label-custom">비밀번호</Label>
          <Input 
            type="password" 
            name="password" 
            placeholder="Password"
            className={`signup-input ${passwordError ? 'is-invalid' : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          {/* 에러 메시지: 조건이 안 맞으면 항상 표시하거나, 포커스 잃었을 때 표시 */}
          {passwordError && (
            <div className="error-text">
              영문(대소문자) + 숫자 + 특수문자가 각 1회 이상,<br/>
              총합 10자리 이상이어야 합니다.
            </div>
          )}
        </FormGroup>

        {/* 비밀번호 확인 */}
        <FormGroup className="position-relative">
          <Label className="form-label-custom">비밀번호 확인</Label>
          <div className="position-relative">
            <Input 
              type={showConfirmPw ? "text" : "password"}
              name="confirmPassword" 
              placeholder="Password" 
              className="signup-input"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {/* 눈 아이콘 토글 버튼 */}
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={() => setShowConfirmPw(!showConfirmPw)}
            >
              {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </FormGroup>

        {/* 이름 */}
        <FormGroup>
          <Label className="form-label-custom">이름</Label>
          <Input 
            type="text" 
            name="name" 
            placeholder="이름" 
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>

        {/* 성별 */}
        <FormGroup>
          <Label className="form-label-custom">성별</Label>
          <div className="gender-group">
            <Label check>
              <Input 
                type="radio" 
                name="gender" 
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />{' '}
              남성
            </Label>
            <Label check>
              <Input 
                type="radio" 
                name="gender" 
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />{' '}
              여성
            </Label>
          </div>
        </FormGroup>

        {/* 생년월일 / 주민번호 뒷자리 */}
        <FormGroup>
          <Label className="form-label-custom">생년월일</Label>
          <Row className="align-items-center g-2">
            <Col xs={5}>
              <Input 
                type="text" 
                name="birthFront" 
                placeholder="생년월일 6자리" 
                maxLength="6"
                className="signup-input text-center"
                value={formData.birthFront}
                onChange={handleChange}
              />
            </Col>
            <Col xs={1} className="text-center">
              -
            </Col>
            <Col xs={6}>
              <Input 
                type="password" 
                name="birthBack" 
                placeholder="주민번호 뒷 7자리" 
                maxLength="7"
                className="signup-input text-center"
                value={formData.birthBack}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </FormGroup>

        {/* 휴대폰 번호 */}
        <FormGroup>
          <Label className="form-label-custom">휴대폰 번호</Label>
          <Input 
            type="text" 
            name="phone" 
            placeholder="010-****-****" 
            className="signup-input"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormGroup>

        {/* 주소 */}
        <FormGroup>
          <Label className="form-label-custom">주소</Label>
          <Row className="g-2 mb-2">
            <Col xs={8}>
              <Input 
                type="text" 
                name="address" 
                placeholder="주소" 
                readOnly 
                className="signup-input"
                value={formData.address}
              />
            </Col>
            <Col xs={4}>
              <Button 
                className="btn-address-search" 
                onClick={handleAddressClick}
              >
                주소 찾기
              </Button>
            </Col>
          </Row>
          <Input 
            type="text" 
            name="detailAddress" 
            placeholder="상세 주소" 
            className="signup-input"
            value={formData.detailAddress}
            onChange={handleChange}
          />
        </FormGroup>

        {/* 회원가입 버튼 */}
        <Button className="btn-signup-submit" onClick={handleSubmit}>
          회원가입
        </Button>

      </Form>
    </div>
  );
};

export default SignupPage;