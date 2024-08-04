import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import PostDetailItem from './PostDetailItem';
import CommentSection from './CommentSection';
import './post.css';

function PostDetail() {
  
  const [post, setPost] = useState([]);
  const { id } = useParams();

  useEffect( () => {

    axios.get(`${process.env.REACT_APP_API_URL}/v1/posts/${id}`)
    .then( (res) => {
      if (res.data.statusCode === 200) {
        console.log("res.data.data : ", res.data.data)
        console.log("test", res.data.data.hashtags)
        res.data.data.hashtags.map( tag => tag.hashtagName);
        setPost(res.data.data);
      }
    }).catch( (err) => {
      console.log("err : ", err);
    });

  }, []);

  const postImage = post.images && post.images.length > 0 ? post.images[0].imagePath : 'https://via.placeholder.com/800x500?text=이미지+없음';

  return (
    <div className="post-box">
      <div className="content-wrapper">
        <PostDetailItem
          profileImage={post.profileImage || 'https://via.placeholder.com/36'}
          nickname={post.nickname || '익명'}
          postImage={postImage}
          likeCount={post.likeCount}
          content={post.content}
          date={new Date(post.updatedAt).toLocaleDateString()}
          tags={post.hashtags}
          postId={post.id}
          onTagClick={null}
        />
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}

export default PostDetail;