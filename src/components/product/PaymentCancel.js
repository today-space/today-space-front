import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const productId = Number(localStorage.getItem('productId'));

        const response = await axios.delete(
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
          const userConfirmed = window.confirm("결제가 취소되었습니다. 확인을 누르면 쇼핑 페이지로 이동합니다.");
          if (userConfirmed) {
            navigate('/product');
          }
        }
      } catch (error) {
        console.error('Error processing payment:', error);
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

export default PaymentCancel;