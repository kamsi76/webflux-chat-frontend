import axiosInstance from "../../instance/axiosInterceptor";

/**
 * 회원 가입 및 로그인 처리 Service
 */
class AuthService {

    /**
     * 사용자 가입처리를 한다.
     * @param {Object} user 사용자 정보를 담고 있는 Object 
     * @returns 
     */
    async singup( user ) {
        return await axiosInstance.post('/auth/signup', user)
    }

    /**
     * 사용자 로그인 처리 한다.
     * @param {Object} request 로그인 정보 저장 Objcet {username, password} 
     * @returns
     * data: {
	 * 	"token" : "토큰값",
	 * 	"user" : 
	 * 		{
	 * 			"id" : 12345,
	 * 			"username" : "testid",
	 * 			"password" : null,
	 * 			"nickname" : "nickname",
	 * 			"createAt" : 2025-05-02 00:00:00
	 * 		}
	 * },
     * message: 로그인 후 메시지
     */
    async login(request) {
        return await axiosInstance.post('/auth/login', request)
    }
}

export const authService = new AuthService();