import axios from "axios";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import './productdetail.css'
import Wish from './Wish'
import Delete from './Delete'

function ProductDetail(){

  const [productData, setProductData] = useState(null);
  const [isCheck, setIsCheck] = useState(false);
  const { id } = useParams();

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

  if (!productData) {
    return <p>Loading...</p>;
  }


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
                  <button className="edit-btn" id="editBtn">편집</button>
                  <Delete id={id}/>
                  </>
                : null}
            </div>
          </div>
        </div>
        <div className="seller-info">
          <img src="" alt="판매자 프로필"
               className="seller-avatar"/>
          <div className="seller-details">
            <span className="seller-name">{productData.userName}</span>
            <span className="seller-meta">{new Date(
                productData.upDateAt).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="product-description">
          {productData.content}
        </p>
        <p className="product-price">{productData.price}</p>
        <button className="btn btn-primary" id="purchaseBtn">구매하기</button>

        <div className="action-buttons">
          <Wish id={id} />
          <button className="btn btn-secondary" id="chatBtn">채팅하기</button>
        </div>
      </div>
  );
    }

export default ProductDetail;