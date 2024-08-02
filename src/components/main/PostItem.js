import React from 'react';
import './popular.css'; // 스타일을 위한 CSS 파일
import { IoMdHeart } from "react-icons/io";

const PostItem = ({ postId, imagePath, altText, hashtags, views, likeCount }) => {
  return (
      <div className="item">
        <img src={imagePath} alt={altText} />
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
