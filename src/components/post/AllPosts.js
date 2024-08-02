import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItem from "./PostItem";
import CommentSection from "./CommentSection";
import './post.css';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/posts`, {
        params: { page }
      });
      const data = response.data.data;
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    const halfMaxButtons = Math.floor(maxButtons / 2);

    let startPage = Math.max(1, page - halfMaxButtons);
    let endPage = Math.min(totalPages, page + halfMaxButtons);

    if (endPage - startPage + 1 < maxButtons) {
      const diff = maxButtons - (endPage - startPage + 1);
      startPage = Math.max(1, startPage - diff);
      endPage = Math.min(totalPages, endPage + diff);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
          <button key={i} onClick={() => setPage(i)} className={page === i ? 'active' : ''}>
            {i}
          </button>
      );
    }

    return buttons;
  };

  return (
      <div className="posts-container">
        {posts.map((post) => (
            <div className="post-box" key={post.id}>
              <div className="content-wrapper">
                <PostItem
                    profileImage={post.profileImage || 'https://via.placeholder.com/36'}
                    nickname={post.nickname || '익명'}
                    postImage={post.images[0]?.imagePath || 'https://via.placeholder.com/800x500?text=이미지+없음'}
                    likeCount={post.likeCount}
                    content={post.content}
                    date={new Date(post.updatedAt).toLocaleDateString()}
                    tags={post.hashtags.map(tag => tag.hashtagName)}
                />
                <CommentSection postId={post.id} />
              </div>
            </div>
        ))}
        <div className="pagination">
          {getPaginationButtons()}
        </div>
      </div>
  );
}

export default AllPosts;
