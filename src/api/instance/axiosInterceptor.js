import axios from "axios";
import CommonError from "../entity/error/CommonError";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * 요청 Interceptor
 * JWT Token을 자동으로 추가 해서 요청한다.
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        // 전체 URL 로그 찍기
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`
        console.log(`[요청 URL]: ${fullUrl}`)
        console.log(`[요청 메서드]: ${config.method?.toUpperCase()}`)

         console.log(token)

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    error => {

        console.log(error.response);
        if (error.response && error.response.data) {
            const { message, status, data } = error.response;

            if (status === 401 || status === 403) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            }

            // CommonError로 변환하고 던진다.
            return Promise.reject(new CommonError({ message, status, data }))
        } else {
            return Promise.reject(new CommonError({
                message: '네트워크 오류가 발생하였습니다.',
                status: 0,
                data: null
            }))
        }
    }
)

export default axiosInstance