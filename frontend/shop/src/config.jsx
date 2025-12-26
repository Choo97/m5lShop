import axios from "axios";

// 배포 환경과 로컬 환경 구분
export const baseUrl = import.meta.env.PROD
  ? "http://16.184.56.172/:8090" // 본인 EC2 IP
  : "http://localhost:8090";

export const reactUrl = import.meta.env.PROD
  ? "http://16.184.56.172/:5173"
  : "http://localhost:5173";

export const myAxios = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
});

// 1. 요청 인터셉터 (AccessToken 싣기)
myAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // ★ AccessToken: Bearer 중복 방지 처리
            config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. 응답 인터셉터 (토큰 만료 처리)
myAxios.interceptors.response.use(
    (response) => response, // 성공하면 그대로 리턴
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, 아직 재시도하지 않은 요청이라면
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지용 플래그

            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                try {
                    // ★ RefreshToken: Bearer 중복 방지 처리
                    const refreshTokenValue = refreshToken.startsWith("Bearer ") ? refreshToken : `Bearer ${refreshToken}`;

                    // 1. 백엔드에 Refresh Token 보내서 새 Access Token 요청
                    const res = await axios.post(`${baseUrl}/api/auth/refresh`, {}, {
                        headers: { 
                            RefreshToken: refreshTokenValue // ★ 수정된 값 사용
                        }
                    });

                    // 2. 새 토큰 저장 (Bearer 제거하고 순수 토큰만 저장 추천)
                    const newAccessToken = res.data.access_token.replace("Bearer ", "");
                    localStorage.setItem('accessToken', newAccessToken);
                    console.log("토큰 갱신 성공!");

                    // 3. 실패했던 원래 요청의 헤더를 새 토큰으로 교체
                    // (여기서도 Bearer를 붙여서 줌)
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // 4. 원래 요청 재시도
                    return myAxios(originalRequest);

                } catch (refreshError) {
                    console.error("토큰 갱신 실패 (Refresh Token 만료):", refreshError);
                    // 갱신 실패하면 로그아웃 처리
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // Refresh Token도 없으면 바로 로그인 페이지로
                alert("로그인이 필요합니다.");
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);