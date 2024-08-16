import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import PostDetailItem from './PostDetailItem';
import CommentSection from './CommentSection';
import './post.css';

function PostDetail() {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate 추가

  useEffect(() => {
    if (id) {
      axios.get(`${process.env.REACT_APP_API_URL}/v1/posts/${id}`)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setPost(res.data.data);
        }
      }).catch((err) => {
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
