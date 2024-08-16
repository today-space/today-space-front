import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Topbar from "../components/common/Topbar";
import SearchTags from '../components/post/SearchTags';
import AddPostButton from '../components/post/AddPostButton';
import AllPosts from '../components/post/AllPosts';
import './page.css';

function PostMain() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const [selectedTag, setSelectedTag] = useState('전체'); // 초기 상태를 '전체'로 설정
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, [token]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tag = queryParams.get('tag') || '전체';
    setSelectedTag(tag);
  }, [location]);

  const handlePostClick = () => {
    if (isLoggedIn) {
      navigate('/post/create');
    } else {
      alert("로그인 후 재시도해주세요");
    }
  };

  const handleTagClick = (tag) => {
    console.log('Clicked tag:', tag);
    setSelectedTag(tag);
    navigate(`/post?tag=${encodeURIComponent(tag)}`);
  };

  return (
      <div>
        <Topbar />
        <div className="search-tags-wrapper">
          <SearchTags onTagClick={handleTagClick} selectedTag={selectedTag} />
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
