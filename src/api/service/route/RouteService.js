import axiosInstance from "../../instance/axiosInterceptor";

/**
 * 회원 가입 및 로그인 처리 Service
 */
class RouteService {

    /**
     * 모든 라우트 목록 조회
     * @returns 
     */
    async select() {
        return await axiosInstance.get('/routes')
    }
}

export const routeService = new RouteService();