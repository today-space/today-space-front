import Topbar from "../components/common/Topbar";
import SellerInfo from "../components/mypage/SellerInfo";
import SellerReviewList from "../components/mypage/SellerReviewList";
import Sidebar from "../components/mypage/Sidebar";

function Review() {
  return (
    <div>
      <Topbar />
      <div className="mypage-container">
        <Sidebar />
        <div className="mypage-main-container">
          <SellerInfo />
          <SellerReviewList />
        </div>
      </div>
    </div>
  );
}

export default Review;