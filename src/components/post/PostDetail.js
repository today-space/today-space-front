import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import PostDetailItem from './PostDetailItem';
import CommentSection from './CommentSection';
import './post.css';

// 토큰과 관련된 유틸리티 함수
const getAccessToken = () => localStorage.getItem('accessToken');

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, { withCredentials: true });
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

function PostDetail() {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate 추가

  useEffect(() => {
    if (id) {
      requestWithTokenRefresh({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/v1/posts/${id}`,
      })
      .then((res) => {
        if (res.data.statusCode === 200) {
          setPost(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching post data", err);
      });
    }
  }, [id]);

  const handleTagClick = (tag) => {
    navigate(`/post?tag=${encodeURIComponent(tag.hashtagName)}`);
  };

  const images = post.images || [];

  return (
      <div className="container">
        <div className="post-box">
          <div className="content-wrapper">
            <PostDetailItem
                profileImage={post.profileImage ? `${post.profileImage}` : 'https://via.placeholder.com/36'}
                nickname={post.nickname || '익명'}
                likeCount={post.likeCount}
                content={post.content}
                date={new Date(post.updatedAt).toLocaleDateString()}
                tags={post.hashtags}
                postId={post.id}
                onTagClick={handleTagClick}
                images={images}
            />
            <CommentSection postId={post.id} />
          </div>
        </div>
      </div>
  );
}

export default PostDetail;
