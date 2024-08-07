import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './postEditForm.css';

function PostEditForm() {
  const { postId } = useParams();
  const [postContent, setPostContent] = useState('');
  const [postHashtags, setPostHashtags] = useState([]);
  const [deletedHashtags, setDeletedHashtags] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) {
      console.error('Post ID is undefined');
      return;
    }

    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    const token = localStorage.getItem('accessToken');  // 토큰 가져오기
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/posts/${postId}`, {
        headers: {
          'Authorization': token  // Authorization 헤더 추가
        }
      });
      const data = response.data.data;
      console.log(data);  // 데이터 확인을 위한 로그 출력

      setPostContent(data.content);
      setPostHashtags(data.hashtags.map(tag => `#${tag.hashtagName}`));
      setImages(data.images.map(image => image.imagePath));
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching post data', error);
    }
  };

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

  const handleTagInput = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newTag = event.target.value.trim();
      if (newTag && !postHashtags.includes(newTag)) {
        setPostHashtags([...postHashtags, newTag]);
      }
      event.target.value = '';
    }
  };

  const removeHashtag = (tag) => {
    setPostHashtags(postHashtags.filter(t => t !== tag));
    setDeletedHashtags([...deletedHashtags, tag]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify({
      content: postContent,
      hashtags: postHashtags.map(tag => tag.replace('#', '')),
      deleteHashtags: deletedHashtags.map(tag => tag.replace('#', '')),
    })], { type: 'application/json' }));

    selectedFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/v1/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token,
        },
      });

      if (response.status === 200) {
        alert("게시글이 성공적으로 수정되었습니다.");
        navigate("/post");
      } else {
        alert("게시글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error('Error updating post', error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('accessToken');  // 토큰 가져오기

    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/v1/posts/${postId}`, {
        headers: {
          'Authorization': token  // Authorization 헤더 추가
        },
      });

      if (response.status === 200) {
        alert("게시글이 성공적으로 삭제되었습니다.");
        navigate("/post");
      } else {
        alert("게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error('Error deleting post', error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
      <div className="container">
        <h1>게시글 수정</h1>
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
                이미지 추가/변경
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
              <ul>
                <li>게시글을 잘 나타내는 다양한 태그를 입력해보세요.</li>
                <li>적절한 태그를 사용하면 게시글 노출 기회가 늘어납니다.</li>
                <li>부적절한 태그 사용 시 제재를 받을 수 있어요.</li>
              </ul>
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">수정</button>
            <button type="button" className="cancel-button" onClick={() => navigate("/post")}>취소</button>
            <button type="button" className="delete-button" onClick={handleDelete}>삭제</button>
          </div>
        </form>
      </div>
  );
}

export default PostEditForm;
