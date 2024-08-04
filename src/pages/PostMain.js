import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from "../components/common/Topbar";
import SearchTags from '../components/post/SearchTags';
import AddPostButton from '../components/post/AddPostButton';
import AllPosts from '../components/post/AllPosts';
import './page.css';

function PostMain() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, [token]);

  const handlePostClick = () => {
    if (isLoggedIn) {
      navigate('/post/create');
    } else {
      alert("로그인 후 재시도해주세요");
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  return (
      <div>
        <Topbar />
        <div className="search-tags-wrapper">
          <SearchTags onTagClick={handleTagClick} />
        </div>
        {token && (
            <div className="add-post-button-wrapper">
              <AddPostButton onClick={handlePostClick} />
            </div>
        )}
        <AllPosts selectedTag={selectedTag} onTagClick={handleTagClick} />
      </div>
  );
}

export default PostMain;
