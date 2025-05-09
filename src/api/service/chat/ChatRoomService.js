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
     * 내가 참여한 채팅방 목록을 조회하는 API
     * @returns {Promise<Response<ChatRoom[]>>}
     */
    async selectMyChatRoom() {
        return await axiosInstance.get('/chat/chatroom/my')
    }

    
    /**
     * 새로운 채팅방을 생성하는 API
     * @param {string} name - 생성할 채팅방 이름
     * @returns {Promise<Response<ChatRoom>>}
     */
    async createChatRoom(name) {
        return await axiosInstance.post(`/chat/chatroom?name=${encodeURIComponent(name)}`)
    }

    /**
     * 채팅방에 참여한 참여자 목록 조회 API
     * @param {string} roomId 
     * @returns 
     */
    async selectParticipants(roomId) {
        return await axiosInstance.get(`/chat/chatroom/${roomId}/participants`)
    }

    /**
     * 채팅방에 입장 처리 한다.
     * @param {string} roomId 
     * @returns 
     */
    async enterChatRoom(roomId) {
        return await axiosInstance.post(`/chat/chatroom/${roomId}/enter`)
    }

    /**
     * 채팅방에서 퇴장 처리 한다.
     * @param {string} roomId 
     * @returns 
     */
    async exitChatRoom(roomId) {
        return await axiosInstance.delete(`/chat/chatroom/${roomId}/exit`)
    }

}

export const chatRoomService = new ChatRoomService();