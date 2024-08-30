import "./common.css";

function Loading() {

  const loading = "/loading.gif";

  return (
    <div className="loading-container">
      <img src={loading} alt="img" />
    </div>
  );
}

export default Loading;