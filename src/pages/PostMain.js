import React, { useState } from 'react';
import Topbar from "../components/common/Topbar";
import SearchTags from '../components/post/SearchTags';
import AddPostButton from '../components/post/AddPostButton';
import AllPosts from '../components/post/AllPosts';
import './page.css';

function PostMain() {
  const token = localStorage.getItem('accessToken');
  const [selectedTag, setSelectedTag] = useState('');

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
              <AddPostButton />
            </div>
        )}
        <AllPosts selectedTag={selectedTag} onTagClick={handleTagClick} />
      </div>
  );
}

export default PostMain;
