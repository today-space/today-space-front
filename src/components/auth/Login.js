import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { setIsLogin } from "../../redux/reducer";
import axios from "axios";
import Socail from "./Social";
import "./auth.css";

function Login() {

  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputValue = (e) => {

    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });

  };

  const handleLoginEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = () => {

    if (!loginInfo.username || !loginInfo.password) {
      return setMessage("아이디, 비밀번호를 확인해주세요");
    }

    axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/login`, {
      username: loginInfo.username,
      password: loginInfo.password
    }, {
      withCredentials: true
    }).then( (res) => {
      if (res.data.statusCode === 200) {

        localStorage.setItem("accessToken", res.headers.authorization);
        dispatch(setIsLogin(true));
        navigate("/");

      }
    }).catch( (err) => {
      if (err.response.data.statusCode === 400) {
        setMessage("아이디, 비밀번호를 확인해주세요");
      }
    });

  };

  return (
    <div className="auth-component-container">
      <h2>로그인</h2>

      <input
        name="username"
        placeholder="아이디를 입력해주세요"
        onChange={handleInputValue}
        onKeyDown={handleLoginEnter} />

      <input
        name="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        onChange={handleInputValue}
        onKeyDown={handleLoginEnter} />

      {message 
      ? <div className="auth-err-message">{message}</div>
      : null}

      <div className="auth-component-container-flex">
        <Link to="/auth/signup">회원가입</Link>
        <button onClick={handleLogin}>로그인</button>
      </div>

      <Socail />
    </div>
  );
}

export default Login;