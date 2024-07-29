function Goolge() {

  const handleGoogle = () => {
    window.location.href = `${process.env.REACT_APP_GOOGLE_AUTH_URL}?client_id=${process.env.REACT_APP_GOOGLE_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URL}&response_type=code&scope=profile`;
  };

  return (
    <button onClick={handleGoogle}>
      <img src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png" alt="구글 로그인" />
    </button>
  );
}

export default Goolge;