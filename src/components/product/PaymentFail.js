import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentFail = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const productId = Number(localStorage.getItem('productId'));

        let response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/v1/payment/cancel`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              params: {
                productId: productId
              }
            }
        );

        if (response.status === 200) {
          const userConfirmed = window.confirm("결제가 실패되었습니다. 확인을 누르면 쇼핑 페이지로 이동합니다.");
          if (userConfirmed) {
            navigate('/product');
          }
        }
      } catch (error) {
        if (error.response && error.response.data.message === "토큰이 만료되었습니다.") {
          try {

            const refreshResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/v1/auth/token/refresh`,
                {},
                { withCredentials: true }
            );

            if (refreshResponse.data.statusCode === 200) {
              const newAccessToken = refreshResponse.headers.authorization;
              localStorage.setItem("accessToken", newAccessToken);
              
              const productId = Number(localStorage.getItem('productId'));

              const retryResponse = await axios.delete(
                  `${process.env.REACT_APP_API_URL}/v1/payment/cancel`,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': newAccessToken
                    },
                    params: {
                      productId: productId
                    }
                  }
              );

              if (retryResponse.status === 200) {
                const userConfirmed = window.confirm(
                    "결제가 실패되었습니다. 확인을 누르면 쇼핑 페이지로 이동합니다.");
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

    fetchPaymentStatus();
  }, [navigate]);

  return (
      <div>
        <h1>Processing payment...</h1>
      </div>
  );
};

export default PaymentFail;