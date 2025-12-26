import React, { useState } from 'react';
import {
  Form, FormGroup, Label, Input, Button,
  Row, Col, Container, FormFeedback, InputGroup
} from 'reactstrap';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../config'; // axios 대신 myAxios 사용 권장
import '../App.css';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const openPostcode = useDaumPostcodePopup(scriptUrl);

  // 폼 상태 관리 (닉네임, 우편번호 추가됨)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '', // ★ 추가
    gender: 'male',
    birthFront: '',
    birthBack: '',
    phone: '',
    zipcode: '',  // ★ 추가
    address: '',
    detailAddress: ''
  });

  // 에러 메시지 상태 관리
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // 정규식 정의
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // 영문 대문자, 소문자, 숫자, 특수문자 중 3가지 이상 조합 + 8자 이상
  const passwordRegex = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])|(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])).{8,}$/;

  // 실시간 유효성 검사 함수
  const validate = (name, value) => {
    let tempErrors = { ...errors };

    if (name === 'email') {
      tempErrors.email = (value && !emailRegex.test(value))
        ? "이메일 형식이 올바르지 않습니다." : "";
    }

    if (name === 'password') {
      tempErrors.password = (value && !passwordRegex.test(value))
        ? "최소 8자 이상, 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합이여야 합니다." : "";
    }

    if (name === 'confirmPassword') {
      tempErrors.confirmPassword = (value !== formData.password)
        ? "비밀번호가 일치하지 않습니다." : "";
    }
    // 비밀번호가 바뀌었을 때 확인창도 다시 검사
    if (name === 'password' && formData.confirmPassword) {
      tempErrors.confirmPassword = (formData.confirmPassword !== value)
        ? "비밀번호가 일치하지 않습니다." : "";
    }

    setErrors(tempErrors);
  };

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  // 주소 검색 완료
  const handleAddressComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    setFormData((prev) => ({
      ...prev,
      zipcode: data.zonecode, // 우편번호 저장
      address: fullAddress
    }));
  };

  // 이메일 중복 확인 (ID 확인)
  const handleEmailCheck = () => {
    if (!formData.email || errors.email) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }
    // 백엔드 중복 확인 API 호출
    myAxios.post(`/api/auth/doubleUserId`, { email: formData.email })
      .then(res => {
        if (res.data === true) alert("이미 가입된 이메일입니다.");
        else alert("사용 가능한 이메일입니다.");
      })
      .catch(() => alert("중복 확인 중 오류가 발생했습니다."));
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    // 최종 유효성 검사
    if (errors.email || errors.password || errors.confirmPassword) {
      return alert('입력 정보를 다시 확인해주세요.');
    }
    if (!formData.email || !formData.name || !formData.nickname) {
      return alert('필수 정보를 모두 입력해주세요.');
    }

    try {
      const submitData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname,
        phone: formData.phone,
        gender: formData.gender,
        rrn: `${formData.birthFront}-${formData.birthBack}`,
        zipcode: formData.zipcode,
        address: formData.address,
        detailAddress: formData.detailAddress,
        role: 'ROLE_USER'
      };

      await myAxios.post('/api/auth/join', submitData);

      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-container py-5">
      <Container style={{ maxWidth: '1000px' }}>
        <h2 className="signup-title text-center fw-bold mb-5">회원가입</h2>

        <Form className="bg-white p-4 p-md-5 border rounded shadow-sm">

          {/* 1행: 이메일(ID) & 이름 */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold small">이메일 (아이디)</Label>
                <InputGroup>
                  <Input
                    type="email" name="email" placeholder="example@email.com"
                    value={formData.email} onChange={handleChange}
                    invalid={errors.email !== ''}
                    valid={formData.email !== '' && errors.email === ''}
                  />
                  <Button color="dark" outline onClick={handleEmailCheck}>중복확인</Button>
                  <FormFeedback>{errors.email}</FormFeedback>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold small">이름 (실명)</Label>
                <Input
                  type="text" name="name" placeholder="홍길동"
                  value={formData.name} onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* 2행: 닉네임 & 휴대폰 */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold small">닉네임</Label>
                <Input
                  type="text" name="nickname" placeholder="사이트에서 사용할 별명"
                  value={formData.nickname} onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold small">휴대폰 번호</Label>
                <Input
                  type="text" name="phone" placeholder="010-0000-0000"
                  value={formData.phone} onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* 3행: 비밀번호 & 비밀번호 확인 */}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold small">비밀번호</Label>
                <Input
                  type="password" name="password"
                  placeholder="영문 대문자, 소문자, 숫자, 특수문자 중 3가지 이상 조합 + 8자 이상"
                  value={formData.password} onChange={handleChange}
                  invalid={errors.password !== ''}
                  valid={formData.password !== '' && errors.password === ''}
                />
                <FormFeedback>{errors.password}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="position-relative">
                <Label className="fw-bold small">비밀번호 확인</Label>
                <div className="position-relative">
                  <Input
                    type={showConfirmPw ? "text" : "password"} name="confirmPassword"
                    placeholder="비밀번호 재입력"
                    value={formData.confirmPassword} onChange={handleChange}
                    invalid={errors.confirmPassword !== ''}
                    valid={formData.confirmPassword !== '' && errors.confirmPassword === ''}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: '#666'
                    }}
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                  >
                    {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <FormFeedback>{errors.confirmPassword}</FormFeedback>
                </div>
              </FormGroup>
            </Col>
          </Row>

          {/* 4행: 성별 & 생년월일 */}
          <Row className="align-items-center mb-2">
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold small d-block">성별</Label>
                <div className="d-flex gap-4">
                  <Label check>
                    <Input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> 남성
                  </Label>
                  <Label check>
                    <Input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> 여성
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold small">주민등록번호</Label>
                <div className="d-flex align-items-center">
                  <Input
                    type="text" name="birthFront" placeholder="생년월일(6자리)" maxLength="6"
                    className="text-center" value={formData.birthFront} onChange={handleChange}
                  />
                  <span className="mx-2">-</span>
                  <Input
                    type="password" name="birthBack" placeholder="뒤 7자리" maxLength="7"
                    className="text-center" value={formData.birthBack} onChange={handleChange}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>

          {/* 5행: 주소 (전체 너비) */}
          <FormGroup>
            <Label className="fw-bold small">주소</Label>
            <div className="d-flex gap-2 mb-2">
              <Input type="text" name="zipcode" value={formData.zipcode} placeholder="우편번호" readOnly style={{ width: '120px' }} />
              <Button color="secondary" onClick={() => openPostcode({ onComplete: handleAddressComplete })}>주소 찾기</Button>
            </div>
            <Input type="text" name="address" value={formData.address} readOnly className="mb-2" placeholder="기본 주소" />
            <Input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleChange} placeholder="상세 주소를 입력하세요" />
          </FormGroup>

          {/* 가입 버튼 */}
          <Button className="mt-4" color="dark" size="lg" block onClick={handleSubmit} style={{ width: '100%' }}>
            회원가입
          </Button>

        </Form>
      </Container>
    </div>
  );
};

export default Signup;