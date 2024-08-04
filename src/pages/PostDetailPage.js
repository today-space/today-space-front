import Topbar from "../components/common/Topbar";
import './page.css';
import React from "react";
import PostDetail from "../components/post/PostDetail";


function PostDetailPage() {
  return (
      <div>
        <Topbar/>
        <div className="container">
          <div className="add-post-button-wrapper">
            <PostDetail />
          </div>
        </div>
      </div>
  );
}

export default PostDetailPage;