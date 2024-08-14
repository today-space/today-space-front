import React from 'react';
import { useNavigate } from "react-router-dom";
import './popular.css'; // 스타일을 위한 CSS 파일

const ProductItem = ({ productId, imagePath, altText, title, price, className}) => {
  
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product/${productId}`);
  };
  
  return (
      <div className={className} onClick={handleNavigate}>
        <img src={imagePath} alt={altText} />
        <div className="item-info">
          <h3 className="product-title">{title}</h3>
          <p className="product-price">{price.toLocaleString()}원</p>
        </div>
      </div>
  );
};

export default ProductItem;
