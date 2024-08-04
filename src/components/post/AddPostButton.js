import React from 'react';
import './post.css';

const AddPostButton = ({ onClick }) => {
  return (
      <div className="add-post-button-container">
        <button className="add-post-button" onClick={onClick}>게시글 추가하기</button>
      </div>
  );
};

export default AddPostButton;
