import { Link } from "react-router-dom"
import Socail from "./Social";
import "./auth.css";

function Login() {
  return (
    <div className="auth-component-container">
      <h2>로그인</h2>

      <input
        name="username"
        placeholder="아이디를 입력해주세요" />

      <input
        name="password"
        type="password"
        placeholder="비밀번호를 입력해주세요" />

      <div className="auth-component-container-flex">
        <Link to="/auth/signup">회원가입</Link>
        <button>로그인</button>
      </div>

      <Socail />
    </div>
  );
}

export default Login;