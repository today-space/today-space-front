import { Link } from "react-router-dom";
import "./common.css";

function Topbar() {
  return (
    <header className="Topbar-header">
      <div className="Topbar-container">
        <div className="Topbar-menu">
          <Link to="/" className="Topbar-menu-logo">오늘의 공간</Link>
          
          <nav>
            <ul>
              <li><Link to="/post">커뮤니티</Link></li>
              <li><Link to="/product">쇼핑</Link></li>
            </ul>
          </nav>
        </div>

        <div className="Topbar-menu">
          <nav>
            <ul>
              <li><Link to="/auth/login">로그인</Link></li>
              <li><Link to="/auth/signup">회원가입</Link></li>
              {/* <li><Link to="/mypage/mypost">마이페이지</Link></li>
              <li><Link to="/">로그아웃</Link></li> */}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Topbar;