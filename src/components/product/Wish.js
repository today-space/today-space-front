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
        // 좋아요가 이미 눌린 상태라면, DELETE 요청
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

      // 상태 업데이트: liked의 값을 반전시켜 UI를 갱신
      setWish(!wish);
    } catch (error) {
      if (error.response.data.statusCode === 400) {
        alert(error.response.data.message);
      }
      console.error('오류', error);
    }
  };

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