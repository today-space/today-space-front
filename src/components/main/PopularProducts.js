import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ProductItem from './ProductItem';
import './popular.css';

function PopularProducts() {
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/v1/products?topWished=true`)
    .then(response => {
      if (response.data.statusCode === 200) {
        setProductData(response.data.data.content);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const handleEditClick = () => {
    navigate(`/product`);
  };

  return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">인기 상품</h2>
          <button className="section-link" id="addBtn"
                  onClick={handleEditClick}>더보기
          </button>
        </div>
        <div className="grid">
          {productData.map((product, index) => (
              <ProductItem
                  key={index}
                  productId={product.id}
                  imagePath={product.imagePath}
                  altText={product.title}
                  title={product.title}
                  price={product.price}
              />
          ))}
        </div>
      </section>
  );
}

export default PopularProducts;
