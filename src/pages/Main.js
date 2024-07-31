import Topbar from "../components/common/Topbar";
import PopularPosts from '../components/main/PopularPosts';
import PopularProducts from '../components/main/PopularProducts';
import './page.css'; // 스타일을 위한 CSS 파일

function Main() {
  return (
      <div>
        <Topbar/>
        <div className="container">
          <PopularPosts/>
          <PopularProducts/>
        </div>
      </div>
  );
}

export default Main;