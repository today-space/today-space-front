import { useEffect, useState } from "react";
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from "axios";
import ChatMessage from "./ChatMessage";
import "./chat.css";

function ChatMain() {

  const [chatRoom, setChatRoom] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [chatRoomUsername, setChatRoomUsername] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  
  useEffect( () => {

    axios.get(`${process.env.REACT_APP_API_URL}/v1/chatroom`, {
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
      if (res.data.statusCode === 200) {
        setChatRoom(res.data.data);
      }
    }).catch( (err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            const newAccessToken = res.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            axios.get(`${process.env.REACT_APP_API_URL}/v1/chatroom`, {
              headers: {
                "Authorization": accessToken
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                setChatRoom(res.data.data);
              }
            }).catch( (err) => {
              console.log("채팅방 목록 조회 실패: ", err);
            });

          }
        }).catch( (err) => {
          console.log("토큰 재발급 실패: ", err);
        });

      }
    });

  }, []);

  useEffect( () => {

    if (!chatRoomId) {
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/v1/chatroom/${chatRoomId}/message`, {
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
      if (res.data.statusCode === 200) {
        setMessageList(res.data.data);
      }
    }).catch( (err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            const newAccessToken = res.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            axios.get(`${process.env.REACT_APP_API_URL}/v1/chatroom/${chatRoomId}/message`, {
              headers: {
                "Authorization": accessToken
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                setMessageList(res.data.data);
              }
            }).catch( (err) => {
              console.log("채팅방 채팅 메세지 조회 실패: ", err);
            });

          }
        }).catch( (err) => {
          console.log("토큰 재발급 실패: ", err);
        });

      }
    });

  }, [chatRoomId]);

  const handleChatRoomClick = (roomId, username) => {
    setChatRoomId(roomId);
    setChatRoomUsername(username);
  }

  return (
    <div className="chatmain-container">
      <div className="chatroomlist-container">
        {chatRoom.map( (el, index) => (
          <div className="chatroomlist-item" key={index} onClick={() => handleChatRoomClick(el.roomId, el.username)}>
            {el.profileImage === "https://today-space.s3.ap-northeast-2.amazonaws.com/null" 
            ? <img src="/defaultProfileImg.png" alt="defaultProfileImg" />
            : <img src={el.profileImage} alt={`${el.name}의 프로필 이미지`} />}
            <div>
              <div className="chatroomlist-item-name">{el.username}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chatmessage-container">
        {chatRoomId 
        ? <>
            <div className="chatmessage-header">{chatRoomUsername}</div>
            
            <div className="chatmessage-main">
              {messageList.map( (el, index) => {

                let sender = "chatmessage-other"

                if (el.sender === localStorage.getItem("username")) {
                  sender = "chatmessage-me";
                }

                return <ChatMessage 
                          key={index}
                          message={el.message}
                          sender={sender}
                        />
              })}
            </div>

            <div className="chatmessage-input">
              <input
                type="text"
                placeholder="메시지를 입력하세요."
              />

              <button>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </div>
          </>
        : <div className="chatmessage-container-no-select">
            <div>💬</div>
            <h2>채팅방을 선택해주세요.</h2>
            <p>왼쪽 채팅방 목록에서 채팅하실 채팅방을 선택해주세요.</p>
          </div>}
      </div>
    </div>
    
  );
}

export default ChatMain;