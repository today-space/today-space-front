import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../redux/reducer";
import axios from "axios";
import NotFound from "../components/common/NotFound";

function Oauth() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const code = new URL(document.location.toString()).searchParams.get("code");
  const state = new URL(document.location.toString()).searchParams.get("state");

  useEffect( () => {

    if (params.id === "kakao") {
      if (code) {
        axios.post(`${process.env.REACT_APP_API_URL}/v1/kakao/login`, {
          code: code
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            localStorage.setItem("accessToken", res.data.data.accessToken);
            localStorage.setItem("username", res.data.data.username);
            dispatch(setIsLogin(true));
            navigate("/");

          }
        }).catch( (err) => {
          console.log(err);
        });
      }
    }

    if (params.id === "naver") {
      if (code && state) {
        axios.post(`${process.env.REACT_APP_API_URL}/v1/naver/login`, {
          code: code
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            localStorage.setItem("accessToken", res.data.data.accessToken);
            localStorage.setItem("username", res.data.data.username);
            dispatch(setIsLogin(true));
            navigate("/");

          }
        }).catch( (err) => {
          console.log(err);
        });
      }
    }

    if (params.id === "google") {
      if (code) {
        axios.post(`${process.env.REACT_APP_API_URL}/v1/google/login`, {
          code: code
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            localStorage.setItem("accessToken", res.data.data.accessToken);
            localStorage.setItem("username", res.data.data.username);
            dispatch(setIsLogin(true));
            navigate("/");

          }
        }).catch( (err) => {
          console.log(err);
        });
      }
    }

  });

  return (
    <>
      {params.id === "kakao" || params.id === "naver" || params.id === "google" 
      ? <div>
        
        </div> 
      : <NotFound />}
    </>
  );
}

export default Oauth;