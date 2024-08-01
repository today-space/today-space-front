function Info() {
  return (
    <div className="info-container">
      <div className="info-container-user">
        <img src="/defaultProfileImg.png" alt="defaultProfileImg" />
        <div>username</div>
      </div>

      <div className="info-container-button">
        <button>프로필 수정</button>
        <button>채팅</button>
      </div>
    </div>
  );
}

export default Info;