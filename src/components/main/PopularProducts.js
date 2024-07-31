import React from 'react';
import ProductItem from './ProductItem';
import './popular.css';

function PopularProducts () {
  const productData = [
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=인테리어+팁',
      altText: 'productData',
      title: '작은 공간 활용 productData 팁',
      views: 1234,
      comments: 56,
    },
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=DIY+프로젝트',
      altText: 'DIY productData',
      title: '주말 DIY 프로젝트: 원목 선반 productData',
      views: 987,
      comments: 42,
    },
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=컬러+트렌드',
      altText: '컬러 productData',
      title: '2023년 인테리어 productData 트렌드',
      views: 876,
      comments: 38,
    },
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=식물+인테리어',
      altText: '식물 productData',
      title: '초보자를 위한 실내 productData 인테리어',
      views: 765,
      comments: 31,
    },
  ];

  return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">인기 상품</h2>
          <a href="/product" className="section-link">더보기</a>
        </div>
        <div className="grid">
          {productData.map((product, index) => (
              <ProductItem
                  key={product.id}
                  imgSrc={product.imgSrc}
                  altText={product.altText}
                  title={product.title}
                  views={product.views}
                  comments={product.comments}
              />
          ))}
        </div>
      </section>
  );
}

export default PopularProducts;
