import React, { useState } from 'react';
import axios from 'axios';
import './postCreateForm.css'; // 스타일을 위한 CSS 파일
import { useNavigate } from 'react-router-dom';

function PostCreateForm() {
  const [postContent, setPostContent] = useState('');
  const [postHashtags, setPostHashtags] = useState('');
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length > 5) {
      alert("이미지는 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify({
      content: postContent,
      hashtags: postHashtags.split(' ')
    })], { type: 'application/json' }));

    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('accessToken');

    const makePostRequest = async (token) => {
      return await axios.post(`${process.env.REACT_APP_API_URL}/v1/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        },
      });
    };

    try {
      let response = await makePostRequest(token);

      if (response.status === 201) {
        alert("게시글이 성공적으로 등록되었습니다.");
        navigate("/post");
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error('Initial post request error:', error);
      if (error.response && error.response.status === 401) {
        try {
          const refreshResponse = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
            withCredentials: true
          });

          if (refreshResponse.status === 200) {
            const newAccessToken = refreshResponse.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            // 재발급 받은 토큰으로 다시 요청
            const retryResponse = await makePostRequest(newAccessToken);

            if (retryResponse.status === 201) {
              alert("게시글이 성공적으로 등록되었습니다.");
              navigate("/posts");
            } else {
              alert("게시글 등록에 실패했습니다.");
            }
          } else {
            alert("로그인이 필요합니다.");
            navigate("/login");
          }
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);
          alert("로그인이 필요합니다.");
          navigate("/login");
        }
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    }
  };

  return (
      <div className="container">
        <h1>게시글 등록</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                placeholder="#태그입력"
                value={postHashtags}
                onChange={(e) => setPostHashtags(e.target.value)}
            />
            <small className="tag-help">
              태그를 입력해 주세요. (최대 5개)
              <ul>
                <li>태그는 띄어쓰기로 구분되며 최대 9글자까지 입력할 수 있어요.</li>
                <li>게시글을 잘 나타내는 다양한 태그를 입력해보세요.</li>
                <li>적절한 태그를 사용하면 게시글 노출 기회가 늘어납니다.</li>
                <li>부적절한 태그 사용 시 제재를 받을 수 있어요.</li>
              </ul>
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">등록하기</button>
            <button type="button" className="cancel-button">취소</button>
          </div>
        </form>
      </div>
  );
}

export default PostCreateForm;
