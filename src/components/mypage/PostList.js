import { useEffect, useState } from "react";
import axios from "axios";
import PostItem from "../main/PostItem";
import "./mypage.css";

function PostList() {
  
  const [data, setData] = useState([]);

  useEffect( () => {

    const accessToken = localStorage.getItem("accessToken");
    
    axios.get(`${process.env.REACT_APP_API_URL}/v1/my/posts`, {
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
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

            axios.get(`${process.env.REACT_APP_API_URL}/v1/my/posts`, {
              headers: {
                "Authorization": newAccessToken
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                localStorage.setItem("accessToken", newAccessToken);
                setData(res.data.data.content);
              }
            }).catch( (err) => {
              console.log("게시물 목록 조회 실패: ", err);
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
      <div className="mypageList-container-grid">
        {data.map( (el, index) => (
          <PostItem 
            key={index}
            postId={el.id}
            imagePath={el.imagePath}
            altText={el.imagePath}
            hashtags={el.hashtags}
            likeCount={el.likeCount}
          />
        ))}
      </div>
    </div>
  );
}

export default PostList;