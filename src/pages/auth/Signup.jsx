import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/service/auth/AuthService";

function Signup() {

    const navigate = useNavigate();

    // 로그인 상태 확인 후 채팅방으로 이동
    localStorage.getItem('token') && navigate("/chatrooms")
        
    const [form, setForm] = useState({ username: '', password: '', nickname: '' })
    const [message, setMessage] = useState(null)

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    /**
     * 회원가입 요청 처리
     * 회원 가입 후 login 페이지로 이동한다.
     */ 
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await authService.singup(form)

            if( response.data.success ) {
                alert('회원가입 성공하였습니다.')
                navigate("/login")
            } else {
                setMessage(response.data.message)
            }

        } catch (error) {
            setMessage(error.response?.data?.message || '오류발생!')
        }
    }


    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">회원가입</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    name="username" 
                    type="text" 
                    placeholder="아이디" 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded" 
                    required />
        
                <input 
                    name="password" 
                    type="password" 
                    placeholder="비밀번호" 
                    onChange={handleChange}
                    className="w-full p-2 border rounded" 
                    required />
                    
                <input 
                    name="nickname" 
                    type="text" 
                    placeholder="별명" 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded" 
                    required />
        
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >가입하기</button>
            </form>
            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
    )
}

export default Signup