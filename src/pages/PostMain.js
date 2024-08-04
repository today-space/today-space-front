import React from 'react';
import Topbar from "../components/common/Topbar";
import SearchTags from '../components/post/SearchTags';
import AddPostButton from '../components/post/AddPostButton';
import AllPosts from '../components/post/AllPosts'
import './page.css';

function PostMain() {
  const token = localStorage.getItem('accessToken');

  return (
      <div>
        <Topbar />
        <div className="search-tags-wrapper">
          <SearchTags />
        </div>
        {token && (
            <div className="add-post-button-wrapper">
              <AddPostButton />
            </div>
        )}
        <AllPosts />
      </div>
  );
}

export default PostMain;
