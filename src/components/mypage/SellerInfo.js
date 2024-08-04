import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./mypage.css";

function SellerInfo() {
  
  const [userInfo, setUserInfo] = useState({
    username: null,
    imagePath: "https://today-space.s3.ap-northeast-2.amazonaws.com/null"
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect( () => {

    axios.get(`${process.env.REACT_APP_API_URL}/v1/users/${id}`)
    .then( (res) => {
      if (res.data.statusCode === 200) {
        setUserInfo({
          username: res.data.data.username,
          imagePath: res.data.data.imagePath
        });
      }
    }).catch( (err) => {
      if (err.response.data.statusCode === 400) {
        navigate(`/notfound`);
      }
    });

  }, []);
  
  return (
    <div className="info-container">
      <div className="info-container-user">
        {userInfo.imagePath === "https://today-space.s3.ap-northeast-2.amazonaws.com/null" 
        ? <img src="/defaultProfileImg.png" alt="defaultProfileImg" />
        : <img src={userInfo.imagePath} alt="defaultProfileImg" />}
        <div>{userInfo.username}</div>
      </div>
    </div>
  );
}

export default SellerInfo;