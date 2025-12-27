import React, { useState } from 'react';
import { Container, Input, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { userAtom } from '../atoms'; // 경로는 실제 구조에 맞게 수정
import '../App.css';
import './Login.css';
import { toast } from 'react-toastify';
import { baseUrl } from '../config';

// 소셜 로그인 이미지 (가지고 계신 파일 경로로 수정하세요)
import naverLoginImg from '../images/naver_LoginImage.png'; // 예시 경로
import kakaoLoginImg from '../images/kakao_LoginImage.png'; // 예시 경로

const Login = () => {

  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom); // Jotai 상태 업데이트 함수

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 에러 상태 (이미지처럼 빨간 글씨 표시용)
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(''); // 에러 초기화

    try {
      // 1. 로그인 요청 (필터가 가로챔)
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        username: email, // ★ 백엔드 필터가 username/password 키를 찾을 수 있음 (email을 username에 담아 보냄)
        password: password
      });

      // 2. 로그인 성공 시 처리
      if (response.status === 200) {
        
        // ★ 중요: 필터 방식은 토큰이 '헤더'에 들어있습니다.
        // const jwtToken = response.headers['authorization']; 
        
        // if (jwtToken) {
        //     // "Bearer " 제거 후 저장
        //     const accessToken = jwtToken.replace("Bearer ", "");
        //     localStorage.setItem('accessToken', accessToken);

        //     // 리프레시 토큰이 헤더에 같이 왔다면 저장 (헤더 키 확인 필요)
        //     const refreshToken = response.headers['refreshtoken']; // 백엔드에서 보낸 키값 확인
        //     if(refreshToken) {
        //         localStorage.setItem('refreshToken', refreshToken.replace("Bearer ", ""));
        //     }
        // }

        const { access_token, refresh_token, user } = response.data;
        // ★ 유저 정보는 '바디(data)'에 들어있습니다.
        const userData = response.data.userData;
        console.log("User Data:", userData);
        // console.log("user: ", user);
        // 2. 토큰 정제 (Bearer 제거) 및 각각 저장
        // (값이 없을 수도 있으니 안전하게 처리)
        const newAccessToken = access_token ? access_token.replace("Bearer ", "") : "";
        const newRefreshToken = refresh_token ? refresh_token.replace("Bearer ", "") : "";

        // 3. 각각 따로 저장
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        // Jotai 업데이트
        setUser({
            id: userData.id, // 백엔드에서 id를 보내주는지 확인 필요 (안 보내주면 /api/user/me 호출해야 함)
            name: userData.name,
            email: userData.email,
            nickname: userData.nickname,
            role: userData.roles || 'ROLE_USER', // 백엔드 필드명 확인 (role or roles)
            profileImage: userData.profileImage,
            phone: userData.phone || '',
            zipcode: userData.zipcode || '',
            address: userData.address || '',
            detailAddress: userData.detailAddress || '',
            // 기타 필요한 필드들...
            isLogined: true 
        });

        toast.success("로그인 되었습니다.");
        navigate('/');
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.status === 401) {
        setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setLoginError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSocialLogin = (provider) => {
    // 백엔드의 OAuth2 시작 엔드포인트로 이동 (리다이렉트)
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-container">
      {/* 장식용 도트 (상단 우측) */}
      <div className="dots-decoration dots-top-right"></div>
      
      {/* 장식용 도트 (하단 좌측) */}
      <div className="dots-decoration dots-bottom-left"></div>

      <div className="login-form-wrapper">
        
        {/* 로고 영역 */}
        <div className="mb-4">
          <div className="login-logo">SH</div> {/* 로고 이미지로 대체 가능 */}
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            계정이 없다면? <Link to="/signup" style={{ color: '#448AFF', textDecoration: 'none' }}>회원가입</Link>
          </div>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <Input
              type="email"
              name="username"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`custom-input ${loginError ? 'input-error' : ''}`}
            />
            {/* 에러 메시지가 있을 때만 표시 */}
            {loginError && <div className="error-message">{loginError}</div>}
          </div>

          <div className="mb-3">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-input"
            />
          </div>

          <Button className="btn-login-submit" type="submit">
            로그인
          </Button>
        </form>

        {/* 간편 로그인 (소셜) */}
        <div className="social-divider">
          <span>간편 로그인</span>
        </div>

        <div className="social-btn-container">
          {/* 가지고 계신 네이버 이미지 버튼 */}
          <button className="social-img-btn" onClick={() => handleSocialLogin('naver')}>
             <img src={naverLoginImg} alt="Naver Login" style={{ backgroundColor: '#03C75A' }} /> 
          </button>
          
          {/* 가지고 계신 카카오 이미지 버튼 */}
          <button className="social-img-btn" onClick={() => handleSocialLogin('kakao')}>
             <img src={kakaoLoginImg} alt="Kakao Login" style={{ backgroundColor: '#FEE500' }} />
          </button>
        </div>

        {/* 하단 링크 (아이디/비번 찾기) */}
        <div className="bottom-links">
          <span>아이디를 잊으셨나요? </span>
          <Link to="/find-id" className="bottom-link-item" style={{ color: '#448AFF', textDecoration: 'none' }}>아이디 찾기</Link>
          <br />
          <span>비밀번호를 잊으셨나요? </span>
          <Link to="/find-pw" className="bottom-link-item" style={{ color: '#448AFF', textDecoration: 'none' }}>비밀번호 찾기</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;