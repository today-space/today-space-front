function Review({ imagePath, altText, reviewerUsername, content, createdAt }) {
  return (
    <div className="review-container">
      {imagePath === "https://today-space.s3.ap-northeast-2.amazonaws.com/null" 
      ? <img src="/defaultProfileImg.png" alt={altText} />
      : <img src={imagePath} alt={altText} />}
      <div className="review-container-content">
        <div className="review-container-content-header">
          <span className="review-container-content-header-username">{reviewerUsername}</span>
          <span className="review-container-content-header-date">{createdAt}</span>
        </div>
        <p className="review-container-content-text">{content}</p>
      </div>
    </div>
  );
}

export default Review;