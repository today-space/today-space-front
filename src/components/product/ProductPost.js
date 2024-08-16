import { useState, useEffect } from "react";
import AWS from 'aws-sdk';
import axios from "axios";
import "./productpost.css";
import { useNavigate, useParams } from 'react-router-dom';

function ProductPost() {
  const { id } = useParams();
  const [productImage, setProductImage] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    price: '',
    content: '',
    address: 'ALL',
    state: 'ON_SALE'
  });

  // S3 설정
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const uploadToS3 = async (file) => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `product/${Date.now()}_${file.name}`,
      Body: file,
      ACL: 'public-read',
    };

    try {
      const { Location } = await s3.upload(params).promise();
      return Location;
    } catch (error) {
      console.error('S3 업로드 실패:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (id) {
      axios.get(`${process.env.REACT_APP_API_URL}/v1/products/${id}`)
      .then(response => {
        const data = response.data.data;
        setProduct({
          title: data.title,
          price: data.price,
          content: data.content,
          address: data.address,
          state: data.state
        });
        setProductImage(data.imageUrlList.map(img => img.imagePath));
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
    }
  }, [id]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    if (productImage.length + files.length > 5) {
      alert('이미지는 최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    const uploadedImages = [];

    for (let file of files) {
      try {
        const uploadedImageUrl = await uploadToS3(file);
        uploadedImages.push(uploadedImageUrl);
      } catch (error) {
        console.error('S3 업로드 실패:', error);
      }
    }

    setProductImage(prevImages => [...prevImages, ...uploadedImages]);
    setSelectedFiles([]);  // 이미지가 S3에 업로드되면 더 이상 로컬에서 사용할 필요가 없으므로 초기화
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const removeImage = (url) => {
    const updatedImages = productImage.filter(image => image !== url);
    setProductImage(updatedImages);
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      navigate("/product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productImage.length === 0) {
      alert('사진을 최소 1장 이상 업로드해야 합니다.');
      return;
    }

    const updatedProduct = {
      ...product,
      images: productImage, // 업로드된 이미지 URL들만 포함
    };

    const token = localStorage.getItem('accessToken');

    try {
      let response;
      if (id) {
        response = await axios.put(`${process.env.REACT_APP_API_URL}/v1/products/${id}`, updatedProduct, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/products`, updatedProduct, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        alert(id ? '상품 수정 성공' : '상품 등록 성공');
        navigate("/product");
      }
    } catch (error) {
      console.error("상품 제출 중 오류 발생:", error);
    }
  };

  return (
      <div className="productpost-container">
        <h1>{id ? '상품 판매글 수정' : '상품 판매글 등록'}</h1>
        <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">상품명</label>
            <textarea
                type="text"
                id="title"
                name="title"
                value={product.title || ''}
                required
                placeholder="상품명을 입력해주세요"
                onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">가격</label>
            <input
                type="number"
                id="price"
                name="price"
                value={product.price || ''}
                required
                placeholder="가격을 입력해주세요"
                min="0"
                step="100"
                onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">설명</label>
            <textarea
                id="content"
                name="content"
                value={product.content || ''}
                required
                placeholder="상품에 대해 자세히 설명해주세요"
                onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">지역 선택</label>
            <select
                id="address"
                name="address"
                value={product.address || 'ALL'}
                onChange={handleInputChange}
                required
            >
              <option value="ALL">전체 지역</option>
              <option value="SEOUL">서울</option>
              <option value="GYEONGGI">경기</option>
              <option value="GANGWON">강원</option>
              <option value="CHUNGCHEONGBUK">충북</option>
              <option value="CHUNGCHEONGNAM">충남(대전)</option>
              <option value="GYEONGSANGBUK">경북(대구)</option>
              <option value="GYEONGSANGNAM">경남(부산)</option>
              <option value="JEOLLABUK">전북</option>
              <option value="JEOLLANAM">전남</option>
              <option value="JEJU">제주</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="state">상태</label>
            <select
                id="state"
                name="state"
                value={product.state || ''}
                onChange={handleInputChange}
                required
            >
              <option value="ON_SALE">판매중</option>
              <option value="SOLD_OUT">판매종료</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="post-image">이미지</label>
            <div className="image-preview">
              {productImage.map((image, index) => (
                  <div key={index} className="image-container">
                    <img src={image} alt={`preview ${index}`} />
                    {!id && (
                        <button
                            type="button"
                            className="remove-button"
                            onClick={() => removeImage(image)}
                        >
                          X
                        </button>
                    )}
                  </div>
              ))}
            </div>
            {id ? <small>이미지는 수정 불가능합니다.</small> : null}
            {!id && (
                <>
                  <div className="file-input-wrapper">
                    <button
                        type="button"
                        className="btn-file-input"
                        onClick={() => document.getElementById("post-image").click()}
                    >
                      이미지 선택
                    </button>
                    <input
                        type="file"
                        id="post-image"
                        name="post-image"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                  </div>
                  <small>* 최대 5장까지 등록 가능합니다.</small>
                </>
            )}
          </div>
          <div className="form-actions">
            <button
                type="submit"
                className="submit-button"
            >
              {id ? "수정하기" : "등록하기"}
            </button>
            <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </form>
      </div>
  );
}

export default ProductPost;
