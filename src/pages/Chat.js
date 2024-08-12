import { useSelector } from "react-redux";
import Topbar from "../components/common/Topbar";
import AccessDenied from "../components/common/AccessDenied";
import ChatMain from "../components/chat/ChatMain";

function Chat() {
  
  const isAuthenticated = useSelector( (state) => state.auth.isLogIn);
  
  return (
    <>
      {isAuthenticated 
      ? <div>
          <Topbar />
          <ChatMain />
        </div>
      : <AccessDenied />}
    </>
  );
}

export default Chat;