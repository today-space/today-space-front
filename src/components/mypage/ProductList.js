import { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "../main/ProductItem";
import "./mypage.css";

function ProductList() {

  const [data, setData] = useState([]);

  useEffect( () => {

    const accessToken = localStorage.getItem("accessToken");

    axios.get(`${process.env.REACT_APP_API_URL}/v1/my/products`, {
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

            axios.get(`${process.env.REACT_APP_API_URL}/v1/my/products`, {
              headers: {
                "Authorization": res.headers.authorization
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                setData(res.data.data.content);
              }
            }).catch( (err) => {
              console.log("상품 목록 조회 실패: ", err);
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
          <ProductItem 
            key={index}
            productId={el.id}
            imagePath={el.imagePath}
            altText={el.imagePath}
            title={el.title}
            price={el.price}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;