import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "../components/common/NotFound";
import Topbar from "../components/common/Topbar";
import AccessDenied from "../components/common/AccessDenied";
import Sidebar from "../components/mypage/Sidebar";
import Info from "../components/mypage/Info";
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
                </div>
              </div>
            </div>
          : params.id === "modify" 
            ? <div>
                <Topbar />
              </div>
            : <NotFound />}
        </>
      : <AccessDenied />}
    </>
  );
}

export default MyPage;