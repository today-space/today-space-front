function Naver() {

  const handleNaver = () => {
    window.location.href = `${process.env.REACT_APP_NAVER_AUTH_URL}?response_type=code&client_id=${process.env.REACT_APP_NAVER_REST_API_KEY}&state=${process.env.REACT_APP_NAVER_STATE}&redirect_uri=${process.env.REACT_APP_NAVER_REDIRECT_URL}`;
  };

  return (
    <button onClick={handleNaver}>
      <img src="https://d1nuzc1w51n1es.cloudfront.net/6e4f331986317290b3ee.png" alt="네이버 로그인" />
    </button>
  );
}

export default Naver;