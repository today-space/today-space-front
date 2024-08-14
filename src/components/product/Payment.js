import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Payment({productData, id}) {

  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 실행
    localStorage.setItem("productId", id);
  }, []);

  const {setPayUrl,payUrl} = useState('');

  const handlePayment = async () => {

    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/payment/kakao`,
          {
            item_name: productData.title,
            total_amount: productData.price,
            productId: id
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
          });
      console.log(response);

      const userConfirmed = window.confirm("정말로 구매하시겠습니까?");
      if (userConfirmed) {
        window.location.href = response.data.data.next_redirect_pc_url;
      }

    } catch (error) {
      if(error.response.data.statusCode === 409){
        alert(error.response.data.message);
      }
      if (error.response && error.response.data.message === "토큰이 만료되었습니다.") {
        try {
          const refreshResponse = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
            withCredentials: true
          });

          if (refreshResponse.data.statusCode === 200) {
            const newAccessToken = refreshResponse.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            const retryResponse = await axios.post(`${process.env.REACT_APP_API_URL}/v1/payment/kakao`,
                {
                  item_name: productData.title,
                  total_amount: productData.price,
                  productId: id
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': newAccessToken
                  },
                });
            console.log(retryResponse);

            const userConfirmed = window.confirm("정말로 구매하시겠습니까?");
            if (userConfirmed) {
              window.location.href = retryResponse.data.data.next_redirect_pc_url;
            }
          }
        } catch (refreshError) {
          if(refreshError.response.data.statusCode === 409){
            alert(error.response.data.message);
          }
          console.log("토큰 재발급 실패: ", refreshError);
        }
      } else {
        console.log("결제 요청 실패: ", error);
      }
    }
  };




  return(
      <div>
        <small>* 100원 이상부터 결제 가능합니다.</small>
        <button className="btn btn-primary" id="purchaseBtn"
                onClick={handlePayment}>
          {productData.paymentState ? '구매완료' : '구매하기'}
        </button>
      </div>
  );
}

export default Payment;