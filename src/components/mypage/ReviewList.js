import { useEffect, useState } from "react";
import axios from "axios";
import Review from "./Review";
import "./mypage.css";

function ReviewList() {
  
  const [data, setData] = useState([]);

  useEffect( () => {

    const accessToken = localStorage.getItem("accessToken");

    axios.get(`${process.env.REACT_APP_API_URL}/v1/my/review`, {
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
      console.log("test : ", res.data.data.content)
      if (res.data.statusCode === 200) {
        setData(res.data.data.content);
      }
    }).catch( (err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            const newAccessToken = res.headers.authorization;

            axios.get(`${process.env.REACT_APP_API_URL}/v1/my/review`, {
              headers: {
                "Authorization": newAccessToken
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                localStorage.setItem("accessToken", newAccessToken);
                setData(res.data.data.content);
              }
            }).catch( (err) => {
              console.log("후기 목록 조회 실패: ", err);
            });

          }
        }).catch( (err) => {
          console.log("토큰 재발급 실패: ", err);
        });

      }
    });

  }, []);
  
  return (
    <div className="mypageList-container">
      {data.map( (el, index) => (
        <Review 
          key={index}
          imagePath={el.imagePath}
          altText={el.imagePath}
          reviewerUsername={el.reviewerUsername}
          content={el.content}
          createdAt={el.createdAt}
        />
      ))}
    </div>
  );
}

export default ReviewList;