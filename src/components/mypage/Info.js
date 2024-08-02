import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import "./mypage.css";

function Info() {
  
  const [userInfo, setUserInfo] = useState({
    username: null,
    imagePath: "https://today-space.s3.ap-northeast-2.amazonaws.com/null"
  });

  const navigate = useNavigate();

  useEffect( () => {

    const accessToken = localStorage.getItem("accessToken");

    axios.get(`${process.env.REACT_APP_API_URL}/v1/my/profile`, {
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
      if (res.data.statusCode === 200) {
        setUserInfo({
          username: res.data.data.username,
          imagePath: res.data.data.imagePath
        });
      }
    }).catch( (err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            axios.get(`${process.env.REACT_APP_API_URL}/v1/my/profile`, {
              headers: {
                "Authorization": res.headers.authorization
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                setUserInfo({
                  username: res.data.data.username,
                  imagePath: res.data.data.imagePath
                });
              }
            }).catch( (err) => {
              console.log("프로필 조회 실패: ", err);
            });

          }
        }).catch( (err) => {
          console.log("토큰 재발급 실패: ", err);
        });

      }
    });

  }, []);

  const handleNavigateModify = () => {
    navigate("/mypage/modify");
  };

  return (
    <div className="info-container">
      <div className="info-container-user">
        {userInfo.imagePath === "https://today-space.s3.ap-northeast-2.amazonaws.com/null" 
        ? <img src="/defaultProfileImg.png" alt="defaultProfileImg" />
        : <img src={userInfo.imagePath} alt="defaultProfileImg" />}
        <div>{userInfo.username}</div>
      </div>

      <div className="info-container-button">
        <button onClick={handleNavigateModify}>프로필 수정</button>
        <button>채팅</button>
      </div>
    </div>
  );
}

export default Info;