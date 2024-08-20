import React, {useState} from 'react';
import axios from 'axios';
import "./productdetail.css";

function Wish({id}) {
  const [wish, setWish] = useState(false); // 초기에는 좋아요가 눌리지 않은 상태

  const handleLikeButtonClick = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인 후 찜할 수 있습니다.');
      return;
    }

    try {
      if (wish) {

        await axios.delete(
            `${process.env.REACT_APP_API_URL}/v1/products/${id}/wish`, {
              headers: {
                'Authorization': token,
              },
            });
      } else {

        await axios.post(
            `${process.env.REACT_APP_API_URL}/v1/products/${id}/wish`, {}, {
              headers: {
                'Authorization': token,
              },
            });
      }

      setWish(!wish);
    } catch (error) {

      if (error.response && error.response.data.message === "토큰이 만료되었습니다.") {
        try {
          const refreshResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
                withCredentials: true,
              });

          if (refreshResponse.data.statusCode === 200) {
            const newAccessToken = refreshResponse.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            if (wish) {
              await axios.delete(
                  `${process.env.REACT_APP_API_URL}/v1/products/${id}/wish`, {
                    headers: {
                      'Authorization': token,
                    },
                  });
            } else {
              await axios.post(
                  `${process.env.REACT_APP_API_URL}/v1/products/${id}/wish`, {},
                  {
                    headers: {
                      'Authorization': token,
                    },
                  });
            }
            setWish(!wish);
          }

        } catch (refreshError) {
          console.log("토큰 재발급 실패: ", refreshError);
        }
      } else {
        
        console.error('오류', error);
        if (error.response.data.statusCode === 400) {
          alert(error.response.data.message);
        }
      }
    }
  }

    return (
        <div className="action-buttons">
          <button
              className={`btn ${wish ? 'btn-wished'
                  : 'btn-outline'}`}
              id={`wishlistBtn-${id}`}
              onClick={handleLikeButtonClick}
          >
            {wish ? '찜 삭제' : '찜하기'}
          </button>
        </div>
    );
  }

export default Wish;