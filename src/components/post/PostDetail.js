import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItem from "./PostItem";
import CommentSection from "./CommentSection";
import {useParams} from "react-router-dom";

function PostDetail() {
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/posts/${id}`);
      const data = response.data.data;
      setPosts(data.content);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  };

  return (
      <div className="post-box">
        <div className="content-wrapper">
          <PostItem
              profileImage={posts.profileImage
                  || 'https://via.placeholder.com/36'}
              nickname={posts.nickname || '익명'}
              postImage={posts.images[0]?.imagePath
                  || 'https://via.placeholder.com/800x500?text=이미지+없음'}
              likeCount={posts.likeCount}
              content={posts.content}
              date={new Date(posts.updatedAt).toLocaleDateString()}
              tags={posts.hashtags.map(tag => tag.hashtagName)}
              postId={posts.id}
          />
          <CommentSection postId={posts.id}/>
        </div>
      </div>
  );
}

export default PostDetail;