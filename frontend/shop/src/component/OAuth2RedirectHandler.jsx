import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userAtom } from '../atoms';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../config';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    // 1. URL 파라미터에서 'token' 가져오기
    const tokenString = searchParams.get('token');

    if (tokenString) {
      try {
        // 2. JSON 문자열 파싱 (여기서 tokens 변수가 생성됨)
        const tokens = JSON.parse(tokenString);

        // 3. Access Token 추출 및 정제 ("Bearer " 제거)
        let accessToken = tokens.access_token;
        while (accessToken && accessToken.startsWith("Bearer ")) {
          accessToken = accessToken.replace("Bearer ", "").trim();
        }

        // 4. Refresh Token 추출 및 정제
        let refreshToken = tokens.refresh_token;
        while (refreshToken && refreshToken.startsWith("Bearer ")) {
          refreshToken = refreshToken.replace("Bearer ", "").trim();
        }

        // 5. 로컬 스토리지에 둘 다 저장 (★ 중요)
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        // 6. 사용자 정보 가져오기 (토큰으로 백엔드 요청)
        axios.get(`${baseUrl}/api/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((res) => {
            const userData = res.data;

            // 7. Jotai 상태 업데이트 (로그인 처리)
            setUser({
              id: userData.id,
              nickname: userData.nickname,
              email: userData.email,
              role: userData.role,
              phone: userData.phone || '',
              zipcode: userData.zipcode || '',
              address: userData.address || '',
              detailAddress: userData.detailAddress || '',
              name: userData.name,
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