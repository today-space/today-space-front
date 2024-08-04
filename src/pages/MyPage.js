import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "../components/common/NotFound";
import Topbar from "../components/common/Topbar";
import AccessDenied from "../components/common/AccessDenied";
import Sidebar from "../components/mypage/Sidebar";
import Info from "../components/mypage/Info";
import PostList from "../components/mypage/PostList";
import ProductList from "../components/mypage/ProductList";
import WishList from "../components/mypage/WishList";
import ReviewList from "../components/mypage/ReviewList";
import Profile from "../components/mypage/Profile";
import "./page.css";

function MyPage() {
  
  const isAuthenticated = useSelector( (state) => state.auth.isLogIn);
  const params = useParams();

  return (
    <>
      {isAuthenticated 
      ? <>
          {params.id === "post" || params.id === "product" || params.id === "review" || params.id === "wish"
          ? <div>
              <Topbar />
              <div className="mypage-container">
                <Sidebar />
                <div className="mypage-main-container">
                  <Info />
                  {params.id === "post" 
                  ? <PostList />
                  : params.id === "product" 
                    ? <ProductList />
                    : params.id === "wish" 
                      ? <WishList />
                      : <ReviewList />}
                </div>
              </div>
            </div>
          : params.id === "modify" 
            ? <div>
                <Topbar />
                <Profile />
              </div>
            : <NotFound />}
        </>
      : <AccessDenied />}
    </>
  );
}

export default MyPage;