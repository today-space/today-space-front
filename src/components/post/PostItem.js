import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './post.css';

const PostItem = ({ profileImage, nickname, postImage, likeCount, content, date, tags, postId, onTagClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const token = localStorage.getItem('accessToken');
  const currentUsername = localStorage.getItem('username'); // localStorage에서 현재 사용자의 username을 가져옴
  const navigate = useNavigate();

  useEffect(() => {
    checkIfLiked();
  }, []);

  const checkIfLiked = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/posts/${postId}/likes`, {
        headers: {
          Authorization: token,
        },
      });
      setIsLiked(response.data.data.isLiked);  // 'data' 속성의 경로가 올바른지 확인
    } catch (error) {
      console.error('Error checking like status', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!token) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/posts/${postId}/likes`, {}, {
        headers: {
          Authorization: token,
        },
      });
      setIsLiked(response.data.data.isLiked);  // 'data' 속성의 경로가 올바른지 확인
      setLikes(response.data.data.likeCount);  // 'data' 속성의 경로가 올바른지 확인
    } catch (error) {
      console.error('Error toggling like', error);
    }
  };

  const handleEditClick = () => {
    navigate(`/post/edit/${postId}`);
  };

  return (
      <div className="left-content">
        <div className="post-header">
          <div className="post-title">
            <img src={profileImage || 'https://via.placeholder.com/36'} alt="프로필 이미지" className="profile-image" />
            {nickname}
          </div>
          {currentUsername === nickname && <button className="edit-button" onClick={handleEditClick}>편집</button>}
        </div>

        <img src={postImage} alt="포스트 이미지" className="post-image" />

        <div className="post-actions">
          <button className="like-button" onClick={handleLikeToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? 'red' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 0L3 6.67a5.5 5.5 0 0 0 0 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            좋아요 {likes}
          </button>
        </div>

        <div className="post-content">
          <p><span className="nickname">{nickname}</span> {content}</p>
        </div>

        <div className="post-date">{date}</div>

        <div className="post-tags">
          {tags.map((tag, index) => (
              <span key={index} className="tag" onClick={() => onTagClick(tag)} style={{ cursor: 'pointer' }}>#{tag}</span>
          ))}
        </div>
      </div>
  );
};

export default PostItem;
