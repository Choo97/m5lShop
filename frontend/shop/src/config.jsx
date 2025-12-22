import axios from "axios";

const SERVER_IP = "http://16.184.56.172"; 

// 2. 환경(개발 vs 배포)에 따라 자동으로 주소 선택
export const baseUrl = import.meta.env.PROD
  ? `${SERVER_IP}:8090`   // 배포 시: AWS 백엔드
  : "http://localhost:8090";   // 개발 시: 내 컴퓨터 백엔드

export const reactUrl = import.meta.env.PROD
  ? `${SERVER_IP}:5173`   // 배포 시: AWS 프론트엔드
  : "http://localhost:5173";   // 개발 시: 내 컴퓨터 프론트엔드

// 1. Axios 인스턴스 생성 (함수가 아님!)
export const myAxios = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
});

// 2. 요청 인터셉터 (Request Interceptor)
// 요청을 보내기 직전에 실행됩니다.
myAxios.interceptors.request.use(
    (config) => {
        // 저장된 토큰을 가져옵니다.
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            // 백엔드가 "Bearer " 접두사를 기대하므로 붙여서 보냅니다.
            config.headers.Authorization = `Bearer ${token}`;
            
            // 만약 Refresh Token도 헤더로 보내야 한다면 여기서 추가
            // const refreshToken = localStorage.getItem('refreshToken');
            // if (refreshToken) {
            //     config.headers.RefreshToken = `Bearer ${refreshToken}`;
            // }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 응답 인터셉터 (Response Interceptor)
// 응답을 받은 직후에 실행됩니다.
myAxios.interceptors.response.use(
    (response) => {
        // 백엔드에서 헤더에 새로운 토큰을 실어 보냈다면 갱신 (Refresh Logic)
        const newAccessToken = response.headers['authorization'];
        if (newAccessToken) {
            // "Bearer " 제거 후 저장
            const pureToken = newAccessToken.replace("Bearer ", "");
            localStorage.setItem('accessToken', pureToken);
            console.log("토큰이 갱신되었습니다.");
        }
        return response;
    },
    (error) => {
        console.error("Axios Error:", error);
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // 인증 에러 발생 시 로그인 페이지로 강제 이동
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem('accessToken'); // 잘못된 토큰 삭제
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);