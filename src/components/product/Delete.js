import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Delete({ id }){

  const navigate = useNavigate();

  const handleDelete = () => {

    const accessToken = localStorage.getItem('accessToken');

    axios.delete(`${process.env.REACT_APP_API_URL}/v1/products/${id}`, {
      headers: {
        "Authorization": accessToken
      }, withCredentials: true,
    }).then((res) => {
      if (res.data.statusCode === 204) {
        navigate("/product");
        alert("삭제 성공")
        console.log('API 응답:', res.data);
      }
    }).catch((err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then((res) => {
          if (res.data.statusCode === 200) {

            const newAccessToken = res.headers.authorization;

            axios.delete(`${process.env.REACT_APP_API_URL}/v1/products/${id}`, {
                  headers: {
                    "Authorization": newAccessToken
                  },
                  withCredentials: true,
                }).then((res) => {
              if (res.data.statusCode === 204) {
                localStorage.setItem("accessToken", newAccessToken);
                navigate("/product");
                console.log('API 응답:', res.data);
              }
            }).catch((err) => {
              console.log("오류 내용: ", err);
            });

          }
        }).catch((err) => {
          console.log("토큰 재발급 실패: ", err);
        });

      }
    });

  }
  
  return(
      <div>
        <button className="delete-btn" id="deleteBtn" onClick={handleDelete}>삭제</button>
      </div>
  );
}

export default Delete;