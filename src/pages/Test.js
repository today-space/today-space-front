import React, { useState, useEffect } from 'react';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Test = () => {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState('1ysy561356'); // 채팅방 ID, 필요에 따라 변경
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const socket = new SockJS('https://today-space.com/v1/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({ Authorization: accessToken }, frame => {
      console.log('Connected: ' + frame);
      
      // 채팅방 구독
      stompClient.subscribe(`/v1/sub/chatroom/${roomId}`, messageOutput => {
        setMessages(prevMessages => [...prevMessages, messageOutput.body]);
      });

      setClient(stompClient);
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (client && message.trim() !== '') {
      client.send(`/v1/pub/chatroom/${roomId}`, {}, JSON.stringify({
        roomId: roomId,
        sender: username, // 실제 사용자의 ID로 대체
        message: message
      }));
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Test;