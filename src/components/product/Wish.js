import axios from "axios";
import './productdetail.css'
import React, {useState} from 'react';

function Wish({id}) {

  const [isWished, setIsWished] = useState(false);

  const handleWish = () => {

    const accessToken = localStorage.getItem('accessToken');

    axios.post(`${process.env.REACT_APP_API_URL}/v1/products/${id}/wish`, {}, {
      headers: {
        "Authorization": accessToken
      }, withCredentials: true,
    }).then((res) => {
      if (res.data.statusCode === 200) {
        setIsWished(!isWished);
        if (isWished === false) {
          alert('찜하기 성공');
        } else {
          alert('취소 성공');
        }

        console.log('API 응답:', res.data);
      }
    }).catch((err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then((res) => {
          if (res.data.statusCode === 200) {

            const newAccessToken = res.headers.authorization;

            axios.post(
                `${process.env.REACT_APP_API_URL}/v1/products/${id}/wish`, {}, {
                  headers: {
                    "Authorization": newAccessToken
                  },
                  withCredentials: true,
                }).then((res) => {
              if (res.data.statusCode === 200) {
                localStorage.setItem("accessToken", newAccessToken);
                setIsWished(!isWished);
                console.log('API 응답:', res.data);
              }
            }).catch((err) => {
              console.log("오류 내용: ", err);
            });

          }
        }).catch((err) => {
          console.log("토큰 재발급 실패: ", err);
        });

      }
    });

  }

  return (
      <div className="action-buttons">
        <button
            className={`btn ${isWished ? 'btn-wished'
                : 'btn-outline'}`} // 상태에 따라 클래스 변경
            id={`wishlistBtn-${id}`} // ID가 고유하도록 설정
            onClick={handleWish}
        >
          {isWished ? '취소하기' : '찜하기'}
        </button>
      </div>
  );
}

export default Wish;