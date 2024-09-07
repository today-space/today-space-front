import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();

    useEffect(() => {
      const fetchPaymentStatus = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const pgToken = new URLSearchParams(window.location.search).get('pg_token');
          const productId = Number(localStorage.getItem('productId'));

          console.log(productId);

          const response = await axios.post(
              `${process.env.REACT_APP_API_URL}/v1/payment/success/kakao`,
              {
                pgToken: pgToken,
                productId: productId,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
              }
          );

          if (response.status === 200) {
            console.log(response);
            const userConfirmed = window.confirm("결제가 완료되었습니다. 확인을 누르면 쇼핑 페이지로 이동합니다.");
            if (userConfirmed) {
              navigate('/product');
            }
          }
        } catch (error) {

          const token = localStorage.getItem('accessToken');
          const pgToken = new URLSearchParams(window.location.search).get('pg_token');
          const productId = Number(localStorage.getItem('productId'));
          
          if (error.response && error.response.data.message === "토큰이 만료되었습니다.") {
            try {
              const refreshResponse = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/token/refresh`, {}, {
                withCredentials: true,
              });

              if (refreshResponse.data.statusCode === 200) {
                const newAccessToken = refreshResponse.headers.authorization;
                localStorage.setItem("accessToken", newAccessToken);

                const retryResponse = await axios.post(
                    `${process.env.REACT_APP_API_URL}/v1/payment/success/kakao`,
                    {
                      pgToken: pgToken,
                      productId: productId,
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': newAccessToken,
                      },
                    }
                );

                if (retryResponse.status === 200) {
                  console.log(retryResponse);
                  const userConfirmed = window.confirm("결제가 완료되었습니다. 확인을 누르면 쇼핑 페이지로 이동합니다.");
                  if (userConfirmed) {
                    navigate('/product');
                  }
                }
              }
            } catch (refreshError) {
              console.log("토큰 재발급 실패: ", refreshError);
            }
          } else {
            console.log("결제 요청 실패: ", error);
          }
        }
      };

      fetchPaymentStatus(); // useEffect 내에서 비동기 함수 호출
    }, [navigate]);

  return (
      <div>
        <h1>Processing payment...</h1>
      </div>
  );
};

export default PaymentSuccess;