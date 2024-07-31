import React, {useEffect, useState} from 'react';
import PostItem from './PostItem';
import './popular.css';
import axios from "axios";

function PopularPosts () {
  const [postData, setPostData] = useState([]);

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

  return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">인기 게시글</h2>
          <a href="/post" className="section-link">더보기</a>
        </div>
        <div className="grid">
          {postData.map((post, index) => (
              <PostItem
                  key={index}
                  postId={post.postId}
                  images={post.images}
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
