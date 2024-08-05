import Kakao from "./social/Kakao";
import Naver from "./social/Naver";
import Goolge from "./social/Google";
import "./auth.css";

function Socail() {
  return (
    <div className="social-container">
      <Kakao />
      <Naver />
      <Goolge />
    </div>
  );
}

export default Socail;