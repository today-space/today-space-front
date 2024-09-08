import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItem from "./PostItem";
import CommentSection from "./CommentSection";
import Loading from '../common/Loading';
import './post.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 토큰과 관련된 유틸리티 함수
const getAccessToken = () => localStorage.getItem('accessToken');

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/token/refresh`, {}, { withCredentials: true });
    const newAccessToken = response.headers.authorization;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    throw error;
  }
};

const requestWithTokenRefresh = async (config) => {
  const accessToken = getAccessToken();
  config.headers = { ...config.headers, Authorization: accessToken };
  try {
    return await axios(config);
  } catch (error) {
    if (error.response && error.response.data.message === '토큰이 만료되었습니다.') {
      const newAccessToken = await refreshAccessToken();
      config.headers.Authorization = newAccessToken;
      return await axios(config);
    }
    throw error;
  }
};

function AllPosts({ selectedTag, onTagClick }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDelayedLoading, setIsDelayedLoading] = useState(false);

  useEffect(() => {
    console.log('Fetching posts for selectedTag:', selectedTag);
    fetchPosts();
  }, [page, selectedTag]);

  const fetchPosts = async () => {

    const loadingTimeout = setTimeout( () => {
      setIsDelayedLoading(true);
    }, 1000);

    try {
      const response = await requestWithTokenRefresh({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/v1/posts`,
        params: { page, hashtag: selectedTag === '전체' ? '' : selectedTag }
      });
      const data = response.data.data;
      setPosts(data.content);
      setTotalPages(data.totalPages);
      setIsLoading(false);
      clearTimeout(loadingTimeout);
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
    <>
      {isLoading && isDelayedLoading
      ? <Loading />
      : <div className="posts-container">
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
        </div>}
    </>
  );
}

export default AllPosts;
