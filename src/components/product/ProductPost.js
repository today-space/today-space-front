import {useState} from "react";
import axios from "axios";
import "./productpost.css"

function ProductPost () {
  const [productImage, setProductImage] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [addressOption, setAddressOption] = useState('');
  const [stateOption, setStateOption] = useState('ON_SALE');

  const [data, setData] = useState({
    title: '',
    price: '',
    content: '',
    address: '',
    state: 'ON_SALE'
  });

  const handleFileChange = (e) => {
    const files = e.target.files;
    setProductImage(files);
    setImageCount(files.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      address: value
    });

    if (value === 'ALL') {
      setAddressOption('ALL');
    } else if (value === 'GYEONGGI') {
      setAddressOption('GYEONGGI');
    } else if (value === 'GANGWON') {
      setAddressOption('GANGWON');
    } else if (value === 'CHUNGCHEONGBUK') {
      setAddressOption('CHUNGCHEONGBUK');
    } else if (value === 'CHUNGCHEONGNAM') {
      setAddressOption('CHUNGCHEONGNAM');
    } else if (value === 'JEOLLABUK') {
      setAddressOption('JEOLLABUK');
    } else if (value === 'JEOLLANAM') {
      setAddressOption('JEOLLANAM');
    } else if (value === 'GYEONGSANGBUK') {
      setAddressOption('GYEONGSANGBUK');
    } else if (value === 'GYEONGSANGNAM') {
      setAddressOption('GYEONGSANGNAM');
    } else if (value === 'JEJU') {
      setAddressOption('JEJU');
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      state: value
    });

    if (value === 'ON_SALE') {
      setStateOption('ON_SALE');
    } else if (value === 'SOLD_OUT') {
      setStateOption('SOLD_OUT');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    for (let i = 0; i < productImage.length; i++) {
      formData.append('files', productImage[i]);
    }

    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        },
      });

      if (response.status === 201) {
        alert('상품 판매글 추가 성공');
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error');
      }
    }
  };

  return (
      <div className="container">
        <h1>상품 판매글 등록</h1>
        <form onSubmit={handleSubmit} method="POST"
              encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">상품명</label>
            <input
                type="text"
                id="title"
                name="title"
                value={data.title}
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
                value={data.price}
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
                value={data.content}
                required
                placeholder="상품에 대해 자세히 설명해주세요"
                onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="ADRESS">지역 선택</label>
            <select
                id="ADRESS"
                name="ADRESS"
                value={data.address}
                onChange={handleRegionChange}
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
            <label htmlFor="STATE">상태</label>
            <select
                id="STATE"
                name="STATE"
                value={data.state}
                onChange={handleStateChange}
                required
            >
              <option value="ON_SALE">판매중</option>
              <option value="SOLD_OUT">판매종료</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="product-image">상품이미지</label>
            <div className="file-input-wrapper">
              <button type="button" className="btn-file-input"
                      onClick={() => document.getElementById(
                          'product-image').click()}>
                {imageCount > 0 ? `${imageCount}개의 이미지 선택됨` : '이미지 선택'}
              </button>
              <input
                  type="file"
                  id="product-image"
                  name="product-image"
                  accept="image/*"
                  multiple
                  style={{display: 'none'}}
                  onChange={handleFileChange}
              />
            </div>
            <small>* 최대 5장까지 등록 가능합니다.</small>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">등록하기</button>
            <button type="button" className="cancel-button">취소</button>
          </div>
        </form>
      </div>
  );
}

export default ProductPost;
