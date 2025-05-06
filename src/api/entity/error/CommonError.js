/**
 * Error 메시지를 통일하기 위한 class
 */
class CommonError extends Error {
    constructor(errorData) {
        super(errorData?.message);    // 부모 Error 생성자 호출
        this.name = 'CommonError';    // 에러 이름 설정
        this.status = errorData?.status;  // HTTP 상태코드 저장
        this.data = errorData?.data;      // 서버가 내려준 데이터 저장
    }
}

export default CommonError