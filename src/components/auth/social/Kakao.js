function Kakao() {

  const handleKakao = () => {
    window.location.href = `${process.env.REACT_APP_KAKAO_AUTH_URL}?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URL}&response_type=code`;
  };

  return (
    <button onClick={handleKakao}>
      <img src="http://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="카카오 로그인" />
    </button>
  );
}

export default Kakao;