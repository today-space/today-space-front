import React from 'react';
import './post.css';

const CommentSection = ({ comments }) => {
  return (
      <div className="right-content">
        <h2>댓글</h2>
        <div className="comments-section">
          {comments.length > 0 ? (
              comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <img src={comment.avatar} alt="사용자 아바타" className="comment-avatar" />
                    <div className="comment-content">
                      <div className="comment-author">{comment.author}</div>
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-actions">
                        <span>답글</span>
                        <span>{comment.time}</span>
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
          <form className="comment-form">
            <input type="text" placeholder="댓글을 입력하세요..." className="comment-input" />
            <button type="submit" className="comment-submit">게시</button>
          </form>
        </div>
      </div>
  );
};

export default CommentSection;
