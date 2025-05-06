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
        if( token ) {
            config.headers.Authroization = `Bearer ${token}`
        }
        return config
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    error => {
        if( error.response && error.response.data ) {
            const {message, status, data} = error.response.data;
            // CommonError로 변환하고 던진다.
            return Promise.reject(new CommonError({message, status, data}))
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