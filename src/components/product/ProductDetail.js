import axios from "axios";
import {useEffect, useState} from "react";
import {useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './productdetail.css'
import Wish from './Wish'
import Delete from './Delete'
import Payment from './Payment'
import Review from './Review'

function ProductDetail(){

  const [productData, setProductData] = useState(null);
  const [isCheck, setIsCheck] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector( (state) => state.auth.isLogIn);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/v1/products/${id}`, {
      withCredentials: true,
    })
    .then(response => {
      if (response.data.statusCode === 200) {
        setProductData(response.data.data);
        console.log(localStorage.getItem("username"));
        console.log(response.data.data.userName);
        if (localStorage.getItem("username") === response.data.data.userName) {

          setIsCheck(true);
        }
        console.log('API 응답:', response.data);
      }
    })
    .catch(error => {

      console.error('Error fetching data:', error);
    });
  }, [id]);

  useEffect(() => {

    console.log('isCheck 상태가 변경되었습니다:', isCheck);
  }, [isCheck]);

  const handleNavigate = () => {
    navigate(`/review/${productData.userName}`);
  };

  if (!productData) {
    return <p>Loading...</p>;
  }

  const handleEditClick = () => {

    navigate(`/productpost/${id}`);
  };

  const handlePayment= () => {

    const userConfirmed = window.confirm("정말로 구매하시겠습니까?");
    if (userConfirmed) {
      alert("개발중입니다");
    }
  };

  const handleChats= () => {

    if (!isAuthenticated) {
      return alert("로그인 후 이용가능합니다.");
    }

    const accessToken = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");

    if (username === productData.userName) {
      return alert("자신의 상품에는 채팅을 할 수 없습니다.")
    }

    axios.post(`${process.env.REACT_APP_API_URL}/v1/chatroom`, {
      productId: productData.id,
      seller: productData.userId
    }, {
      withCredentials: true,
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
      if (res.data.statusCode === 200) {
        navigate(`/chat`);
      }
    }).catch( (err) => {
      console.log("err", err)
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            const newAccessToken = res.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            axios.post(`${process.env.REACT_APP_API_URL}/v1/chatroom`, {
              productId: productData.id,
              seller: productData.userId
            }, {
              headers: {
                "Authorization": newAccessToken
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                navigate(`/chat`);
              }
            }).catch( (err) => {
              console.log("채팅방 입장 실패: ", err);
            });

          }
        }).catch( (err) => {
          console.log("토큰 재발급 실패: ", err);
        });

      }
    });

  };

  return (
      <div className="container">
        <div className="product-images">
          {productData.imageUrlList && productData.imageUrlList.length > 0 ? (
              productData.imageUrlList.map((image, index) => (
                  <img
                      key={image.id}
                      src={image.imagePath}
                      alt={`Product image ${index + 1}`}
                      className="main-image"
                      id={`mainImage-${index}`}
                  />
              ))
          ) : (
              <p>No images available</p>
          )}
        </div>
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{productData.title}</h1>
            <div className="edit-delete">
              {isCheck ?
                  <>
                    <button className="edit-btn" id="editBtn"
                            onClick={handleEditClick}>편집
                    </button>
                    <Delete id={id}/>
                  </>
                  : null}
            </div>
          </div>
        </div>
        <div className="seller-info">
          {productData.userImagePath
              ? <img src={`https://today-space.s3.ap-northeast-2.amazonaws.com/${productData.userImagePath}`} alt="판매자 프로필"
                     className="seller-avatar" onClick={handleNavigate} />
              : <img src="/defaultProfileImg.png" alt="판매자 프로필"
                     className="seller-avatar" onClick={handleNavigate} />}
          <div className="seller-details" onClick={handleNavigate}>
            <span className="seller-name">{productData.userName}</span>
            <span className="seller-meta">{new Date(
                productData.upDateAt).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="product-description">
          {productData.content}
        </p>
        <p className="product-price">{productData.price}</p>
        <div>
          {productData.paymentState && localStorage.getItem("username") === productData.paymentUser ? (
              <Review productData={productData} id={id} />
          ) : (
              <Payment productData={productData} id={id} />
          )}
        </div>
        <div className="action-buttons">
          <Wish id={id}/>
          <button className="btn btn-secondary" id="chatBtn" onClick={handleChats}>채팅하기</button>
        </div>
      </div>
  );
}

export default ProductDetail;