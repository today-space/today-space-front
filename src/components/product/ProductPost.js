import { useState, useEffect } from "react";
import axios from "axios";
import "./productpost.css";
import { useNavigate, useParams } from 'react-router-dom';

function ProductPost() {
  const { id } = useParams();
  const [productImage, setProductImage] = useState([]);
  const [productContent, setproductContent] = useState('');
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    price: '',
    content: '',
    address: 'ALL',
    state: 'ON_SALE'
  });

  useEffect(() => {
    if (id) {
      axios.get(`${process.env.REACT_APP_API_URL}/v1/products/${id}`)
      .then(response => {
        setProduct(response.data.data);
        setProductImage(response.data.data.images || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, [id]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setProductImage(prevImages => [...prevImages, ...newImages]);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeImage = (url) => {
    const index = productImage.indexOf(url);
    if (index > -1) {
      const updatedImages = productImage.filter(image => image !== url);
      setProductImage(updatedImages);
      setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
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

    if (selectedFiles.length > 5) {
      alert("이미지는 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    if (!id && productImage.length === 0) {
      alert("사진을 등록해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('accessToken');

    try {
      let response;
      if (id) {

        response = await axios.put(`${process.env.REACT_APP_API_URL}/v1/products/${id}`, product, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });
      } else {

        response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
          },
        });
      }
      console.log('Response:', response);

      if (response.status === 200 || response.status === 201) {
        
        alert(id ? '상품 수정 성공' : '상품 등록 성공');
        navigate("/product");
      }
    } catch (error) {
      if (error.response && error.response.data.message === "토큰이 만료되었습니다.") {
        try {
          
          const refreshResponse = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
            withCredentials: true
          });

          if (refreshResponse.data.statusCode === 200) {
            
            const newAccessToken = refreshResponse.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            let retryResponse;
            if (id) {
              
              retryResponse = await axios.put(`${process.env.REACT_APP_API_URL}/v1/products/${id}`, product, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': newAccessToken
                },
              });
            } else {
              
              retryResponse = await axios.post(`${process.env.REACT_APP_API_URL}/v1/products`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': newAccessToken
                },
              });
            }

            if (retryResponse.status === 200 || retryResponse.status === 201) {
              
              alert(id ? '상품 수정 성공' : '상품 등록 성공');
              navigate("/product");
            }
          }
        } catch (refreshError) {
          
          console.log("토큰 재발급 실패: ", refreshError);
        }
      }
    }
  };


  return (
      <div className="productpost-container">
        <h1>{id ? '상품 판매글 수정' : '상품 판매글 등록'}</h1>
        <form onSubmit={handleSubmit} method="POST"
              encType="multipart/form-data">
          <div className="form-group">
            <div className="textarea-counter-wrapper">
              <label htmlFor="title">상품명</label>
              <textarea
                  type="text"
                  id="title"
                  name="title"
                  value={product.title || ''}
                  required
                  placeholder={id ? product.title || '상품명을 입력해주세요'
                      : '상품명을 입력해주세요'}
                  onChange={handleInputChange}
              />
              <div className="textarea-counter">{product.title.length}/20</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="price">가격</label>
            <input
                type="number"
                id="price"
                name="price"
                value={product.price || ''}
                required
                placeholder={id ? product.price || '가격을 입력해주세요' : '가격을 입력해주세요'}
                min="0"
                step="100"
                onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">설명</label>
            <div className="textarea-counter-wrapper">
            <textarea
                id="content"
                name="content"
                value={product.content || ''}
                required
                placeholder={id ? product.content || '상품에 대해 자세히 설명해주세요'
                    : '상품에 대해 자세히 설명해주세요'}
                onChange={handleInputChange}
            />
              <div className="textarea-counter">{product.content.length}/200
              </div>
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
              {id ? (
                  <>
                    <div className="image-preview">
                      {productImage.map((image, index) => (
                          <div key={index} className="image-container">
                            <img src={image} alt={`preview ${index}`}/>
                          </div>
                      ))}
                    </div>
                    <small>* 이미지 수정 불가능</small>
                  </>
              ) : (
                  <>
                    <div className="image-preview">
                      {productImage.map((image, index) => (
                          <div key={index} className="image-container">
                            <img src={image} alt={`preview ${index}`}/>
                            <button type="button" className="remove-button"
                                    onClick={() => removeImage(image)}>X
                            </button>
                          </div>
                      ))}
                    </div>
                    <div className="file-input-wrapper">
                      <button type="button" className="btn-file-input"
                              onClick={() => document.getElementById(
                                  'post-image').click()}>
                        이미지 선택
                      </button>
                      <input
                          type="file"
                          id="post-image"
                          name="post-image"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          style={{display: 'none'}}
                      />
                    </div>
                    <small>* 최대 5장까지 등록 가능합니다.</small>
                  </>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">{id ? '수정하기'
                  : '등록하기'}</button>
              <button type="button" className="cancel-button"
                      onClick={handleCancel}>취소
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}

export default ProductPost;