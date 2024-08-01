import React, { useState, useEffect } from 'react';
import './postEditForm.css';

function PostEditForm() {
  const [postContent, setPostContent] = useState('');
  const [postHashtags, setPostHashtags] = useState('');
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fetch the existing post data here and set the state accordingly.
    // For example:
    // fetchPostData().then(data => {
    //   setPostContent(data.content);
    //   setPostHashtags(data.hashtags);
    //   setImages(data.images);
    //   setIsLoaded(true);
    // });

    // Dummy data for demonstration
    setPostContent('기존 게시글 내용');
    setPostHashtags('#기존태그1 #기존태그2');
    setImages(['/path/to/existing/image1.jpg', '/path/to/existing/image2.jpg']);
    setIsLoaded(true);
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const removeImage = (url) => {
    setImages(images.filter(image => image !== url));
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
      <div className="container">
        <h1>게시글 수정</h1>
        <form method="POST" action="submit_post_edit_action" enctype="multipart/form-data">
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
              <input type="file" id="post-image" name="post-image" accept="image/*" multiple onChange={handleFileChange} />
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
            <button type="submit" className="submit-button">수정</button>
            <button type="button" className="cancel-button">취소</button>
            <button type="button" className="delete-button">삭제</button>
          </div>
        </form>
      </div>
  );
}

export default PostEditForm;
