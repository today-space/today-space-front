import React from 'react';
import PostItem from './PostItem';
import './popular.css';

function PopularPosts () {
  const postsData = [
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=인테리어+팁',
      altText: '인테리어 팁',
      title: '작은 공간 활용 인테리어 팁',
      views: 1234,
      comments: 56,
    },
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=DIY+프로젝트',
      altText: 'DIY 프로젝트',
      title: '주말 DIY 프로젝트: 원목 선반 만들기',
      views: 987,
      comments: 42,
    },
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=컬러+트렌드',
      altText: '컬러 트렌드',
      title: '2023년 인테리어 컬러 트렌드',
      views: 876,
      comments: 38,
    },
    {
      imgSrc: 'https://via.placeholder.com/300x180?text=식물+인테리어',
      altText: '식물 인테리어',
      title: '초보자를 위한 실내 식물 인테리어',
      views: 765,
      comments: 31,
    },
  ];


  return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">인기 게시글</h2>
          <a href="/post" className="section-link">더보기</a>
        </div>
        <div className="grid">
          {postsData.map((post, index) => (
              <PostItem
                  key={index}
                  postId={post.postId}
                  imgSrc={post.imgSrc}
                  altText={post.altText}
                  title={post.title}
                  views={post.views}
                  comments={post.comments}
              />
          ))}
        </div>
      </section>
  );
}

export default PopularPosts;
