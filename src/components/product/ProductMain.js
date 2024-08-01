import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import "./productmain.css";

const ProductMain = () => {
  const [page, setPage] = useState(1); // 페이지 상태
  const [sortOption, setSortOption] = useState(undefined); // 정렬 옵션 상태
  const [search, setSearch] = useState(undefined); // 검색어 상태
  const [regionOption, setRegionOption] = useState(undefined); // 지역 옵션 상태
  const [products, setProducts] = useState([]); // 제품 목록 상태
  const [totalPages, setTotalPages] = useState(undefined); // 총 페이지 수 상태

  const navigate = useNavigate();


  const fetchProducts = async (page, sortOption, search,
      regionOption) => {
    try {
      const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/products`, {
            params: {
              page: page,
              sort: sortOption,
              search: search,
              region: regionOption
            },
            withCredentials: true
          });
      setProducts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
      console.log('API 응답:', response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };


  useEffect(() => {

    fetchProducts(page, sortOption, search, regionOption);
  }, [page, sortOption, regionOption]);

  const handlePostClick = (id) => {
    navigate(`/products/${id}`);
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 2;
    const halfMaxButtons = Math.floor(maxButtons / 2);

    let startPage = Math.max(1, page - halfMaxButtons);
    let endPage = Math.min(totalPages, page + halfMaxButtons);

    if (endPage - startPage + 1 < maxButtons) {
      const diff = maxButtons - (endPage - startPage + 1);
      startPage = Math.max(1, startPage - diff);
      endPage = Math.min(totalPages, endPage + diff);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
          <button key={i} onClick={() => setPage(i)}
                  className={page === i ? 'active' : ''}>
            {i}
          </button>
      );
    }

    return buttons;
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'recent') {
      setSortOption('updatedAt,desc');
    } else if (value === 'low-price') {
      setSortOption('price,asc');
    } else if (value === 'high-price') {
      setSortOption('price,desc');
    }
  };

  const handleRegionChange = (e) =>{
    const value = e.target.value;
    if (value === 'ALL') {
      setRegionOption('ALL')
    } else if (value === 'GYEONGGI') {
      setRegionOption('GYEONGGI')
    }else if (value === 'GANGWON') {
      setRegionOption('GANGWON')
    }else if (value === 'CHUNGCHEONGBUK') {
      setRegionOption('CHUNGCHEONGBUK')
    }else if (value === 'CHUNGCHEONGNAM') {
      setRegionOption('CHUNGCHEONGNAM')
    }else if (value === 'JEOLLABUK') {
      setRegionOption('JEOLLABUK')
    }else if (value === 'JEOLLANAM') {
      setRegionOption('JEOLLANAM')
    }else if (value === 'GYEONGSANGBUK') {
      setRegionOption('GYEONGSANGBUK')
    }else if (value === 'GYEONGSANGNAM') {
      setRegionOption('GYEONGSANGNAM')
    }else if (value === 'JEJU') {
      setRegionOption('JEJU')
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // 페이지를 1로 설정
    fetchProducts(1, sortOption, search, regionOption); // 검색어를 포함한 검색 요청
  };

  return (
      <div className="container">
        <div className="search-container">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="상품명을 입력하세요"
                name="search"
                value={search}
                onChange={handleSearchChange}
            />
            <button type="submit" className="search-button">검색</button>
          </form>
        </div>
        <div className="filter-container">
          <Link className="post-product-button" to="/">판매글 등록하기</Link>
          <div className="filter-options">
            <select className="filter-select" id="sort-select"
                    onChange={handleSortChange}>
              <option value="recent">최신순</option>
              <option value="low-price">낮은 가격순</option>
              <option value="high-price">높은 가격순</option>
            </select>
            <select className="filter-select" id="region-select"
                    onChange={handleRegionChange}>
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
        </div>
        <div className="grid">
          {products.map(product => (
              <div key={product.id} className="item"
                   onClick={() => handlePostClick(product.id)}>
                <img src={product.imagePath} alt={product.title}/>
                <div className="item-info">
                  <h3>{product.title}</h3>
                  <p className="item-price">{product.price}</p>
                </div>
              </div>
          ))}
        </div>
        <div className="pagination">
          <button>
            {getPaginationButtons()}
          </button>
        </div>
      </div>
  );
}

export default ProductMain;
