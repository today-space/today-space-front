import "./chat.css";

function ChatMessage({ message, sender }) {
  return (
    <div className={`chatmessage ${sender}`}>
      {message}
    </div>
  );
}

export default ChatMessage;