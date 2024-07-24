import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import Socail from "./Social";
import "./auth.css";

function Signup() {

  const [signupInfo, setSignupInfo] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState({
    username: "",
    signup: ""
  });
  const [checkUsername, setCheckUsername] = useState(null);

  const navigate = useNavigate();
  const usernameRegExp = /^[a-z0-9]{4,20}$/;
  const passwordRegExp = /^[A-Za-z0-9!@#$%^&*]{4,20}$/;

  const handleInputValue = (e) => {

    const { name, value } = e.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value
    });

  };

  const handleCheckEnter = (e) => {
    if (e.key === "Enter") {
      handleCheckUsername();
    }
  }

  const handleSignupEnter = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  }

  const handleCheckUsername = () => {

    if (!usernameRegExp.test(signupInfo.username)) {
      return setMessage({
        ...message,
        username: "입력값을 확인해주세요"
      });
    }

    axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/check`, {
      username: signupInfo.username
    }).then( (res) => {
      if (res.data.statusCode === 200) {

        setMessage({
          ...message,
          username: "사용 가능한 아이디입니다"
        });
        setCheckUsername(signupInfo.username);

      }
    }).catch( (err) => {
      if (err.response.data.statusCode === 409) {

        setMessage({
          ...message,
          username: "이미 사용 중인 아이디입니다"
        });
        setCheckUsername(null);

      }
    });

  }

  const handleSignup = () => {

    if (!signupInfo.username || !signupInfo.password) {
      return setMessage({
        ...message,
        signup: "아이디, 비밀번호를 입력해주세요"
      });
    }

    if (checkUsername !== signupInfo.username) {
      return setMessage({
        ...message,
        signup: "아이디 중복확인 검사를 해주세요"
      });
    }

    if (!usernameRegExp.test(signupInfo.username) || !passwordRegExp.test(signupInfo.password)) {
      return setMessage({
        ...message,
        signup: "입력값을 확인해주세요"
      });
    }

    axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/signup`, {
      username: signupInfo.username,
      password: signupInfo.password
    }).then( (res) => {
      if (res.data.statusCode === 201) {
        navigate("/auth/login");
      }
    }).catch( (err) => {
      if (err.response.data.statusCode === 400) {
        setMessage({
          ...message,
          username: "입력값을 확인해주세요"
        });
      }

      if (err.response.data.statusCode === 409) {
        setMessage({
          ...message,
          username: "이미 사용 중인 아이디입니다"
        });
      }
    });

  };

  return (
    <div className="auth-component-container">
      <h2>회원가입</h2>

      <div className="signup-component-container-flex">
        <input
          name="username"
          placeholder="아이디를 입력해주세요"
          onChange={handleInputValue}
          onKeyDown={handleCheckEnter} />
        <button onClick={handleCheckUsername}>중복확인</button>
      </div>

      {message.username 
      ? (message.username === "사용 가능한 아이디입니다" 
        ? <div className="auth-message">{message.username}</div>
        : <div className="auth-err-message">{message.username}</div>)
      : null}
      
      <input
        name="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        onChange={handleInputValue}
        onKeyDown={handleSignupEnter} />

      {message.signup 
      ? <div className="auth-err-message">{message.signup}</div>
      : null}

      <div className="auth-component-container-flex">
        <Link to="/auth/login">로그인</Link>
        <button onClick={handleSignup}>회원가입</button>
      </div>

      <Socail />
    </div>
  );
}

export default Signup;