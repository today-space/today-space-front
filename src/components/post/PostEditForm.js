import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './postEditForm.css';

// 토큰과 관련된 유틸리티 함수
const getAccessToken = () => localStorage.getItem('accessToken');

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/token/refresh`, {}, { withCredentials: true });
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

function PostEditForm() {
  const { postId } = useParams();
  const [postContent, setPostContent] = useState('');
  const [postHashtags, setPostHashtags] = useState([]);
  const [deletedHashtags, setDeletedHashtags] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) {
      setIsLoaded(true);
      return;
    }

    fetchPostData();
  }, [postId]);

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const uploadToS3 = async (file) => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `post/${Date.now()}_${file.name}`,
      Body: file,
      ACL: 'public-read',
    };

    try {
      const { Key } = await s3.upload(params).promise();
      return Key;
    } catch (error) {
      console.error('S3 업로드 실패:', error);
      throw error;
    }
  };

  const fetchPostData = async () => {
    try {
      const response = await requestWithTokenRefresh({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/v1/posts/${postId}`,
      });
      const data = response.data.data;
      setPostContent(data.content);
      setPostHashtags(data.hashtags.map((tag) => `#${tag.hashtagName}`));
      setImages(data.images.map((image) => image.imagePath));
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching post data', error);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));

    if (images.length + newImages.length > 5) {
      alert('이미지는 최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    setImages(prevImages => [...prevImages, ...newImages]);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeImage = (url) => {
    const index = images.indexOf(url);
    if (index > -1) {
      const updatedImages = images.filter((image) => image !== url);
      setImages(updatedImages);

      if (url.startsWith('blob:')) {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      } else {
        setDeletedImages((prevDeletedImages) => [...prevDeletedImages, url]);
      }
    }
  };

  const handleTagInput = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newTag = event.target.value.trim();
      if (newTag && !postHashtags.includes(newTag)) {
        if (postHashtags.length < 5) {
          setPostHashtags([...postHashtags, newTag]);
        } else {
          alert('태그는 최대 5개까지 등록할 수 있습니다.');
        }
      }
      event.target.value = '';
    }
  };

  const removeHashtag = (tag) => {
    setPostHashtags(postHashtags.filter((t) => t !== tag));
    setDeletedHashtags([...deletedHashtags, tag]);
  };

  const handleContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newImageKeys = await Promise.all(
          selectedFiles.map((file) => uploadToS3(file))
      );

      const allImageKeys = [
        ...images.filter((img) => !img.startsWith('blob:')),
        ...newImageKeys,
      ];

      const formData = {
        content: postContent,
        hashtags: postHashtags.map((tag) => tag.replace('#', '')),
        deleteHashtags: deletedHashtags.map((tag) => tag.replace('#', '')),
        images: allImageKeys,
        deleteImageUrls: deletedImages,
        newImages: newImageKeys,
      };

      const method = postId ? 'put' : 'post';
      const url = postId
          ? `${process.env.REACT_APP_API_URL}/v1/posts/${postId}`
          : `${process.env.REACT_APP_API_URL}/v1/posts`;

      const response = await requestWithTokenRefresh({
        method,
        url,
        data: formData,
      });

      if (response.status === 200 || response.status === 201) {
        alert(`게시글이 성공적으로 ${postId ? '수정' : '작성'}되었습니다.`);
        navigate('/post');
      } else {
        alert(`게시글 ${postId ? '수정' : '작성'}에 실패했습니다.`);
      }
    } catch (error) {
      console.error(`Error ${postId ? 'updating' : 'creating'} post`, error);
      alert(`게시글 ${postId ? '수정' : '작성'}에 실패했습니다.`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await requestWithTokenRefresh({
        method: 'DELETE',
        url: `${process.env.REACT_APP_API_URL}/v1/posts/${postId}`,
      });

      if (response.status === 200) {
        alert('게시글이 성공적으로 삭제되었습니다.');
        navigate('/post');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting post', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
      <div className="container">
        <h1>{postId ? '게시글 수정' : '게시글 작성'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="post-image">이미지</label>
            <div className="image-preview">
              {images.map((image, index) => (
                  <div key={index} className="image-container">
                    <img src={image} alt={`preview ${index}`} />
                    <button
                        type="button"
                        className="remove-button"
                        onClick={() => removeImage(image)}
                    >
                      X
                    </button>
                  </div>
              ))}
            </div>
            <div className="file-input-wrapper">
              <button
                  type="button"
                  className="btn-file-input"
                  onClick={() => document.getElementById('post-image').click()}
              >
                이미지 추가/변경
              </button>
              <input
                  type="file"
                  id="post-image"
                  name="post-image"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
              />
            </div>
            <small>* 최대 5장까지 등록 가능합니다.</small>
          </div>

          <div className="form-group">
            <label htmlFor="post-content">내용</label>
            <textarea
                id="post-content"
                name="post-content"
                required
                placeholder="게시글 내용을 작성해주세요"
                value={postContent}
                onChange={handleContentChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-hashtags">태그 (선택)</label>
            <input
                type="text"
                id="post-hashtags"
                name="post-hashtags"
                placeholder="태그를 입력한 후 Enter키를 눌러주세요."
                onKeyPress={handleTagInput}
            />
            <div className="hashtags-preview">
              {postHashtags.map((tag, index) => (
                  <div key={index} className="hashtag">
                    {tag}
                    <button
                        type="button"
                        className="remove-hashtag"
                        onClick={() => removeHashtag(tag)}
                    >
                      x
                    </button>
                  </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {postId ? '수정' : '작성'}
            </button>
            <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/post')}
            >
              취소
            </button>
            {postId && (
                <button
                    type="button"
                    className="delete-button"
                    onClick={handleDelete}
                >
                  삭제
                </button>
            )}
          </div>
        </form>
      </div>
  );
}

export default PostEditForm;
