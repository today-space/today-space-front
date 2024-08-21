import { useEffect, useState } from 'react';
import axios from 'axios';
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

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, page]);

  const fetchComments = async () => {
    try {
      const response = await requestWithTokenRefresh({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/v1/posts/${postId}/comments`,
        params: { page }
      });
      const data = response.data.data;
      setComments(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('댓글 불러오기 오류:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!getAccessToken()) {
      alert('로그인 후 댓글을 남길 수 있습니다.');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await requestWithTokenRefresh({
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL}/v1/posts/${postId}/comments`,
        data: { content: newComment },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('댓글 추가 오류:', error);
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
      <div className="right-content">
        <h2>댓글</h2>
        <div className="comments-section">
          {comments.length > 0 ? (
              comments.map((comment, index) => {
                const profileImageUrl = comment.profileImage
                    ? `${comment.profileImage}`
                    : 'https://via.placeholder.com/36';

                return (
                    <div key={index} className="comment">
                      <img src={profileImageUrl} alt="사용자 아바타" className="comment-avatar" />
                      <div className="comment-content">
                        <div className="comment-author">{comment.username}</div>
                        <div className="comment-text">{comment.content}</div>
                        <div className="comment-actions">
                          <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                );
              })
          ) : (
              <div className="no-comments">
                댓글이 아직 없습니다.<br />
                <span className="small">댓글을 남겨주세요.</span>
              </div>
          )}
        </div>
        <div className="pagination">
          {getPaginationButtons()}
        </div>
        <form className="comment-form" onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder={getAccessToken() ? "댓글을 입력하세요..." : "로그인 후 댓글을 남길 수 있습니다."}
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!getAccessToken()}
          />
          <button
              type="submit"
              className="comment-submit"
          >
            게시
          </button>
        </form>
      </div>
  );
};

export default CommentSection;
