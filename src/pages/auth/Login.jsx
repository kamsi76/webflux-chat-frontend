import { useState } from "react";
import { authService } from "../../api/service/auth/AuthService";

function Login() {
    const [form, setForm] = useState({username: '', password: ''})
    const [message, setMessage] = useState(null)

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await authService.login(form)

            console.log( response?.data )
            if( response.data.success ) {
                const token = response.data.data.token;
                const user = response.data.data.user;

                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                
                setMessage('로그인 성공!!!')
            } else {
                setMessage(response.data.message)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '오류 발생!!')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">로그인</h2>
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
                    
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >로그인</button>
            </form>
            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </div>
    )
}

export default Login