function Kakao() {

  const handleKakao = () => {
    window.location.href = `${process.env.REACT_APP_KAKAO_AUTH_URL}?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URL}&response_type=code`;
  };

  return (
    <button className="social-kakao" onClick={handleKakao}>
      <img src="/kakaoImg.png" alt="카카오 로그인" />
      <span>카카오 로그인</span>
    </button>
  );
}

export default Kakao;