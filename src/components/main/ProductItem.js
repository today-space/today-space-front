import React from 'react';
import './popular.css'; // 스타일을 위한 CSS 파일

const ProductItem = ({ imagePath, altText, title, price }) => {
  return (
      <div className="item">
        <img src={imagePath} alt={altText} />
        <div className="item-info">
          <h3 className="product-title">{title}</h3>
          <p className="product-price">{price.toLocaleString()}원</p>
        </div>
      </div>
  );
};

export default ProductItem;
