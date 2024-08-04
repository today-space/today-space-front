import "./modal.css";

function CheckModal({ content, handler }) {
  return (
    <div className="check-background">
      <div className="check">
        <div className="check-content">{content}</div>
        <button onClick={handler} type="button">확인</button>
      </div>
    </div>
  );
}

export default CheckModal;