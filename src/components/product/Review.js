import React, { useState } from 'react';
import axios from 'axios';
import "./productpost.css";

function Review({ productData, id }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewContent, setReviewContent] = useState('');

  const handleReview = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/products/${id}/reviews`,
          { content: reviewContent },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          }
      );
      console.log(response);
      setIsReviewing(false);
    } catch (error) {

      if (error.response && error.response.data.message === "토큰이 만료되었습니다.") {
        try {
          const refreshResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/v1/auth/token/refresh`, {}, {
                withCredentials: true,
              });

          if (refreshResponse.data.statusCode === 200) {
            const newAccessToken = refreshResponse.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/v1/products/${id}/reviews`,
                {content: reviewContent},
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': newAccessToken,
                  },
                }
            );
            console.log(response);
            setIsReviewing(false);
          }
        } catch (refreshError) {
          console.log("토큰 재발급 실패: ", refreshError);
        }
      } else {

        console.error('오류', error);
        if (error.response.data.statusCode === 409) {
          alert(error.response.data.message);
        }
      }
    }
  }

  const handleInputChange = (event) => {
    setReviewContent(event.target.value);
  };

  return (
      <div>
        <button
            className="reviewBtn reviewBtn-post"
            onClick={() => setIsReviewing(true)}
        >
          후기 작성
        </button>

        {isReviewing && (
            <div className="modal">
              <div className="modal-content">
            <span className="close" onClick={() => setIsReviewing(false)}>
              &times;
            </span>
                <label htmlFor="content">후기를 작성해주세요</label>
                <div className="textarea-counter-wrapper">
              <textarea
                  id="content"
                  name="content"
                  value={reviewContent}
                  placeholder="후기를 작성해주세요"
                  required
                  onChange={handleInputChange}
              />
                  <div className="textarea-counter">{reviewContent.length}/100</div>
                </div>
                <button className="reviewBtn" onClick={handleReview}>리뷰 제출</button>
              </div>
            </div>
        )}
      </div>
  );
}

export default Review;