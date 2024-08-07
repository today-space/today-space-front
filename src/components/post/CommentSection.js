import axios from 'axios';
import { useEffect, useState } from 'react';
import './post.css';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, page]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/posts/${postId}/comments`, {
        params: { page }
      });
      const data = response.data.data;
      setComments(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      alert('로그인 후 댓글을 남길 수 있습니다.');
      return;
    }

    try {
      await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/posts/${postId}/comments`,
          { content: newComment },
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          }
      );
      setNewComment('');
      fetchComments(); // Fetch updated comments
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
          <button key={i} onClick={() => setPage(i)} className={page === i ? 'active' : ''}>
            {i}
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
                    ? `https://today-space.s3.ap-northeast-2.amazonaws.com/${comment.profileImage}`
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
              placeholder={token ? "댓글을 입력하세요..." : "로그인 후 댓글을 남길 수 있습니다."}
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!token} // 로그인 안된 상태면 입력 비활성화
          />
          <button type="submit" className="comment-submit" disabled={!token}>게시</button>
        </form>
      </div>
  );
};

export default CommentSection;
