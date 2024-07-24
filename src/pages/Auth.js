import { useParams, Link } from "react-router-dom";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import NotFound from "../components/common/NotFound";
import "./page.css";

function Auth() {

  const params = useParams();

  return (
    <>
      {params.id === "login" || params.id === "signup" 
      ? <div className="auth-background">
          <div className="auth-container">
            <div className="auth-container-logo">
              <Link to="/">오늘의 공간</Link>
            </div>

            {params.id === "login" 
            ? <Login />
            : <Signup />}
          </div>
        </div>
      : <NotFound />}
    </>
  );
}

export default Auth;