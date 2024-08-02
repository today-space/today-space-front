import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import "./common.css";

function AccessDenied() {
  return (
    <div>
      <div className="notfound-icon">
        <FontAwesomeIcon className="icon-size-150" icon={faCircle} />
        <FontAwesomeIcon className="icon-size-100 notfound-icon-center" icon={faExclamation} />
      </div>
      <h2 className="notfound-title">접근 불가능한 페이지입니다</h2>
      <p className="notfound-content">해당 페이지는 로그인 후 이용하실 수 있습니다<br />로그인 후 이용해주세요</p>
      <Link to ="/">
        <button className="notfound-btn">홈으로</button>
      </Link> 
    </div>
  );
}

export default AccessDenied;