import React from 'react';
import { useNavigate } from "react-router-dom";
import './popular.css'; // 스타일을 위한 CSS 파일
import { IoMdHeart } from "react-icons/io";

const PostItem = ({ postId, imagePath, altText, hashtags, likeCount }) => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/post/${postId}`);
  };

  return (
      <div className="item" onClick={handleNavigate}>
        <img src={imagePath} alt={altText || 'Post Image'} />
        <div className="item-info">
          <div className="hashtags">
            {hashtags.map((hashtag, index) => (
                <span key={index} className="hashtag">{`#${hashtag.hashtagName}`}</span>
            ))}
          </div>
          <div className="likes">
            <IoMdHeart className="heart-icon"/> {likeCount}
          </div>
        </div>
      </div>
  );
};

export default PostItem;
