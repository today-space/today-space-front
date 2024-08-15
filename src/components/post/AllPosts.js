import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItem from "./PostItem";
import CommentSection from "./CommentSection";
import './post.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function AllPosts({ selectedTag, onTagClick }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    console.log('Fetching posts for selectedTag:', selectedTag);
    fetchPosts();
  }, [page, selectedTag]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/posts`, {
        params: { page, hashtag: selectedTag === '전체' ? '' : selectedTag }
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
    const currentGroup = Math.ceil(page / maxButtons);
    const totalGroups = Math.ceil(totalPages / maxButtons);

    const startPage = (currentGroup - 1) * maxButtons + 1;
    const endPage = Math.min(currentGroup * maxButtons, totalPages);

    if (currentGroup > 1) {
      buttons.push(
          <button key="prev-group" onClick={() => setPage(startPage - 1)}>
            &laquo;
          </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
          <button key={i} onClick={() => setPage(i)} className={page === i ? 'active' : ''}>
            {i}
          </button>
      );
    }

    if (currentGroup < totalGroups) {
      buttons.push(
          <button key="next-group" onClick={() => setPage(endPage + 1)}>
            &raquo;
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
                    postId={post.id}
                    onTagClick={onTagClick}
                    selectedTag={selectedTag}
                    images={post.images}  // 이미지 배열을 전달
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
