import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/posts/${postId}/comments`,
          {
            headers: {
              Authorization: token,
            },
          }
      );
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

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

  return (
      <div className="right-content">
        <h2>댓글</h2>
        <div className="comments-section">
          {comments.length > 0 ? (
              comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <img src="https://via.placeholder.com/36" alt="사용자 아바타" className="comment-avatar" />
                    <div className="comment-content">
                      <div className="comment-author">{comment.username}</div>
                      <div className="comment-text">{comment.content}</div>
                      <div className="comment-actions">
                        <span>답글</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        <span className="delete-button">삭제</span>
                      </div>
                    </div>
                  </div>
              ))
          ) : (
              <div className="no-comments">
                댓글이 아직 없습니다.<br />
                <span className="small">댓글을 남겨주세요.</span>
              </div>
          )}
          <form className="comment-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="댓글을 입력하세요..."
                className="comment-input"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="comment-submit">게시</button>
          </form>
        </div>
      </div>
  );
};

export default CommentSection;
