import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setIsLogin } from "../../redux/reducer";
import "./common.css";

function Topbar() {

  const isAuthenticated = useSelector( (state) => state.auth.isLogIn);
  const dispatch = useDispatch();

  const handleLogout = () => {

    const accessToken = localStorage.getItem("accessToken");

    axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/logout`, {}, {
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
      if (res.data.statusCode === 200) {

        localStorage.removeItem('accessToken');
        dispatch(setIsLogin(false));

      }
    }).catch( (err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/logout`, {}, {
              headers: {
                "Authorization": res.headers.authorization
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {

                localStorage.removeItem('accessToken');
                localStorage.removeItem('username');
                dispatch(setIsLogin(false));
        
              }
            }).catch( (err) => {
              console.log("로그아웃 실패: ", err);
            });

          }
        }).catch( (err) => {
          if (err.response.data.statusCode === 401) {

            localStorage.removeItem('accessToken');
            localStorage.removeItem('username');
            dispatch(setIsLogin(false));
            
          }
        });

      } else if (err.response.data.statusCode === 401) {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        dispatch(setIsLogin(false));

      }
    });

  };

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
              {isAuthenticated 
              ? <>
                  <li><Link to="/mypage/post">마이페이지</Link></li>
                  <li><Link to="/" onClick={handleLogout}>로그아웃</Link></li>
                </>
              : <>
                  <li><Link to="/auth/login">로그인</Link></li>
                  <li><Link to="/auth/signup">회원가입</Link></li>
                </>}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Topbar;