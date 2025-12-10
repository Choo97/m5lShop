import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userAtom } from '../atoms';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../config'; // http://localhost:8090


const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    // 1. URL 파라미터에서 'token' 가져오기
    // 예: ?token={"access_token":"Bearer ...", "refresh_token":"..."}
    const tokenString = searchParams.get('token');

    if (tokenString) {
      try {
        // 2. JSON 문자열 파싱
        const tokens = JSON.parse(tokenString);
        
        // 3. "Bearer " 문자열 제거 (필요한 경우)
        // 백엔드에서 "Bearer "를 붙여서 줬다면 제거, 안 붙였다면 그대로 사용
        let accessToken = tokens.access_token;
        if (accessToken && accessToken.startsWith("Bearer ")) {
          accessToken = accessToken.replace("Bearer ", "");
        }
        
        let refreshToken = tokens.refresh_token;
        if (refreshToken && refreshToken.startsWith("Bearer ")) {
          refreshToken = refreshToken.replace("Bearer ", "");
        }

        // 4. 로컬 스토리지에 저장
        localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('refreshToken', refreshToken); // 필요시 저장

        // 5. 사용자 정보 가져오기 (토큰으로 백엔드 요청)
        // (백엔드에 내 정보 조회 API가 /api/user/me 라고 가정)
        axios.get(`${ baseUrl }/api/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then((res) => {
          const userData = res.data;
          
          // 6. Jotai 상태 업데이트 (로그인 처리)
          setUser({
            id: userData.id,
            nickname: userData.nickname,
            email: userData.email,
            role: userData.role,
            profileImage: userData.profileImage,
            isLogined: true
          });

          toast.success("소셜 로그인 성공!");
          navigate('/'); // 메인 페이지로 이동
        })
        .catch((err) => {
          console.error("유저 정보 로드 실패", err);
          toast.error("유저 정보를 불러오지 못했습니다.");
          navigate('/login');
        });

      } catch (e) {
        console.error("토큰 파싱 에러", e);
        toast.error("로그인 처리 중 오류가 발생했습니다.");
        navigate('/login');
      }
    } else {
      toast.error("잘못된 접근입니다. (토큰이 없습니다.)");
      navigate('/login');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">로그인 처리중...</span>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;