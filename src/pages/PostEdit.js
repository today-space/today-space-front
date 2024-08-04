import React from 'react';
import Topbar from "../components/common/Topbar";
import './page.css';
import PostEditForm from "../components/post/PostEditForm";

function PostEdit() {
  return (
      <div>
        <Topbar/>
        <div className="post-edit-container">
          <PostEditForm/>
        </div>
      </div>
  );
}

export default PostEdit;
