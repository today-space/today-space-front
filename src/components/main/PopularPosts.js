import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import PostItem from './PostItem';
import './popular.css';
import axios from "axios";

function PopularPosts () {
  const [postData, setPostData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/v1/posts?topLiked=true`)
    .then(response => {
      if (response.data.statusCode === 200) {
        setPostData(response.data.data.content);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const handleEditClick = () => {
    navigate(`/post`);
  };

  return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">인기 게시글</h2>
          <button className="section-link" id="addBtn"
                  onClick={handleEditClick}>더보기
          </button>
        </div>
        <div className="grid">
          {postData.map((post, index) => (
              <PostItem
                  key={index}
                  postId={post.id}
                  images={post.imagePath}
                  altText={post.altText}
                  hashtags={post.hashtags}
                  likeCount={post.likeCount}
              />
          ))}
        </div>
      </section>
  );
}

export default PopularPosts;
