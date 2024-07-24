import { Link } from "react-router-dom"
import Socail from "./Social";
import "./auth.css";

function Signup() {
  return (
    <div className="auth-component-container">
      <h2>회원가입</h2>

      <div className="signup-component-container-flex">
        <input
          name="username"
          placeholder="아이디를 입력해주세요" />
        <button>중복확인</button>
      </div>
      
      <input
        name="password"
        type="password"
        placeholder="비밀번호를 입력해주세요" />

      <div className="auth-component-container-flex">
        <Link to="/auth/login">로그인</Link>
        <button>회원가입</button>
      </div>

      <Socail />
    </div>
  );
}

export default Signup;