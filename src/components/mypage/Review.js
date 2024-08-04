function Review({ imagePath, altText, reviewerUsername, content, createdAt }) {
  return (
    <div className="review-container">
      <img src={imagePath} alt={altText} />
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