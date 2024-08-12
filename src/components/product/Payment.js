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

    try{
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/payment/kakao` 
         ,{
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
      console.log(response);
      if (userConfirmed) {
        window.location.href = response.data.data.next_redirect_pc_url;
      }

    }catch (error) {
      console.error('Error making the request', error); // 에러 메시지 출력
      
      const { statusCode, message } = error.response.data;
      if(statusCode === 400) {
        alert(message);
      }
      if (statusCode === 401) {
        alert(message);
      }
      if (statusCode === 409) {
        alert(message); 
      }
    }
  };
  



  return(
      <div>
        <small>* 100원 이상부터 결제 가능합니다.</small>
        <button className="btn btn-primary" id="purchaseBtn"
                onClick={handlePayment}>구매하기
        </button>
      </div>
  );
}

export default Payment;