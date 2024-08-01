import React from 'react';
import './post.css';

const PostItem = ({ profileImage, nickname, postImage, likeCount, content, date, tags }) => {
  return (
      <div className="left-content">
        <div className="post-header">
          <div className="post-title">
            <img src={profileImage || 'https://via.placeholder.com/36'} alt="프로필 이미지" className="profile-image" />
            {nickname}
          </div>
          <button className="edit-button">편집</button>
        </div>

        <img src={postImage} alt="포스트 이미지" className="post-image" />

        <div className="post-actions">
          <button className="like-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            좋아요 {likeCount}
          </button>
        </div>

        <div className="post-content">
          <p><span className="nickname">{nickname}</span>{content}</p>
        </div>

        <div className="post-date">{date}</div>

        <div className="post-tags">
          {tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
  );
};

export default PostItem;
