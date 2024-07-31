import React from 'react';
import './popular.css'; // 스타일을 위한 CSS 파일

const PostItem = ({ imgSrc, altText, title, views, comments }) => {
  return (
      <div className="item">
        <img src={imgSrc} alt={altText} />
        <div className="item-info">
          <h3>{title}</h3>
          <p>조회수: {views} | 댓글: {comments}</p>
        </div>
      </div>
  );
};

export default PostItem;
