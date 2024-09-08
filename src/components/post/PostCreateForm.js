import React, { useState } from 'react';
import AWS from 'aws-sdk';
import axios from 'axios';
import './postCreateForm.css'; // 스타일을 위한 CSS 파일
import { useNavigate } from 'react-router-dom';

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

function PostCreateForm() {
  const [postContent, setPostContent] = useState('');
  const [postHashtags, setPostHashtags] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageError, setImageError] = useState('');
  const navigate = useNavigate();

  // S3 설정
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
      const { Location } = await s3.upload(params).promise();
      return Location;
    } catch (error) {
      console.error('S3 업로드 실패:', error);
      throw error;
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

  const handleContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const removeImage = (url) => {
    const index = images.indexOf(url);
    if (index > -1) {
      const updatedImages = images.filter(image => image !== url);
      setImages(updatedImages);
      setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
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
    setPostHashtags(postHashtags.filter(t => t !== tag));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setImageError('이미지를 최소 1장 이상 업로드해야 합니다.');
      return;
    }

    if (selectedFiles.length > 5) {
      setImageError('이미지는 최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    try {
      // S3에 이미지 업로드 및 URL 획득
      const imageUrls = await Promise.all(
          selectedFiles.map(file => uploadToS3(file))
      );

      const formData = {
        content: postContent,
        hashtags: postHashtags.map(tag => tag.replace('#', '')),
        images: imageUrls,
      };

      const token = getAccessToken();

      const makePostRequest = async (token) => {
        return await requestWithTokenRefresh({
          method: 'POST',
          url: `${process.env.REACT_APP_API_URL}/v1/posts`,
          data: formData,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });
      };

      let response = await makePostRequest(token);

      if (response.status === 201) {
        alert("게시글이 성공적으로 등록되었습니다.");
        navigate("/post");
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  return (
      <div className="container">
        <h1>게시글 등록</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="post-image">이미지</label>
            <div className="image-preview">
              {images.map((image, index) => (
                  <div key={index} className="image-container">
                    <img src={image} alt={`preview ${index}`} />
                    <button type="button" className="remove-button" onClick={() => removeImage(image)}>X</button>
                  </div>
              ))}
            </div>
            <div className="file-input-wrapper">
              <button type="button" className="btn-file-input" onClick={() => document.getElementById('post-image').click()}>
                이미지 선택
              </button>
              <input type="file" id="post-image" name="post-image" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            {imageError && <div className="error-message">{imageError}</div>} {/* 오류 메시지 출력 */}
            <small>* 최대 5장까지 등록 가능합니다.</small>
          </div>

          <div className="form-group">
            <label htmlFor="post-content">내용</label>
            <div className="textarea-counter-wrapper">
            <textarea
                id="post-content"
                name="post-content"
                required
                placeholder="게시글 내용을 자세히 작성해주세요"
                value={postContent}
                onChange={handleContentChange}
            />
              <div className="textarea-counter">{postContent.length}/2000</div>
            </div>
            <small className="tag-help">
              게시글에 대해 자세히 설명해주세요.<br />
              전화번호, SNS 계정 등 개인정보 입력은 금지될 수 있어요.
            </small>
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
                    <button type="button" className="remove-hashtag" onClick={() => removeHashtag(tag)}>x</button>
                  </div>
              ))}
            </div>
            <small className="tag-help">
              태그를 입력해 주세요. (최대 5개)
              <ul>
                <li>게시글을 잘 나타내는 다양한 태그를 입력해보세요.</li>
                <li>적절한 태그를 사용하면 게시글 노출 기회가 늘어납니다.</li>
              </ul>
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">등록하기</button>
            <button type="button" className="cancel-button" onClick={() => navigate("/post")}>취소</button>
          </div>
        </form>
      </div>
  );
}

export default PostCreateForm;
