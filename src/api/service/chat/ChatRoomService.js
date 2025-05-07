import axiosInstance from "../../instance/axiosInterceptor";

/**
 * 채팅방 관리 Service
 */
class ChatRoomService {

    /**
     * 모든 채팅방 목록을 조회하는 API
     * @returns {Promise<Response<ChatRoom[]>>}
     */
    async selectChatRoom() {
        return await axiosInstance.get('/chat/chatroom')
    }

    
    /**
     * 새로운 채팅방을 생성하는 API
     * @param {string} name - 생성할 채팅방 이름
     * @returns {Promise<Response<ChatRoom>>}
     */
    async createChatRoom(name) {
        return await axiosInstance.post(`/chat/chatroom?name=${encodeURIComponent(name)}`)
    }
}

export const chatRoomService = new ChatRoomService();