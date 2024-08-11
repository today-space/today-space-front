function Goolge() {

  const handleGoogle = () => {
    window.location.href = `${process.env.REACT_APP_GOOGLE_AUTH_URL}?client_id=${process.env.REACT_APP_GOOGLE_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URL}&response_type=code&scope=profile`;
  };

  return (
    <button className="social-google" onClick={handleGoogle}>
      <img src="/googleImg.png" alt="구글 로그인" />
      <span>구글 로그인</span>
    </button>
  );
}

export default Goolge;