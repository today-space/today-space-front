import { Link, useLocation } from "react-router-dom";
import "./mypage.css";

function Sidebar() {

  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="sidebar-container">
      <ul>
        <li><Link className={path === "/mypage/post" ? "active" : ""} to="/mypage/post">내 게시물 목록</Link></li>
        <li><Link className={path === "/mypage/product" ? "active" : ""} to="/mypage/product">상품 목록</Link></li>
        <li><Link className={path === "/mypage/review" ? "active" : ""} to="/mypage/review">상점 후기</Link></li>
        <li><Link className={path === "/mypage/wish" ? "active" : ""} to="/mypage/wish">찜한 상품</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;