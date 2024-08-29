import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Review from "./Review";
import Pagination from "../common/Pagination";
import "./mypage.css";

function SellerReviewList() {

  const [data, setData] = useState([]);
  const [pageable, setPageable] = useState({
    itemsPerPage: 8,
    pagePerDisplay: 5,
    totalItems: null, 
    totalPages: null
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect( () => {
    requestAxios(parseInt(searchParams.get("page")) || 1);
  }, []);

  const requestAxios = (page) => {

    axios.get(`${process.env.REACT_APP_API_URL}/v1/users/${id}/reviews?page=${page}`)
    .then( (res) => {
      if (res.data.statusCode === 200) {
        setData(res.data.data.content);
        setPageable({
          itemsPerPage: res.data.data.size,
          pagePerDisplay: 5,
          totalItems: res.data.data.totalElements, 
          totalPages: res.data.data.totalPages
        });
      }
    }).catch( (err) =>{
      if (err.response.data.statusCode === 400) {
        navigate(`/notfound`);
      }
    });

  };

  return (
    <div className="mypageList-container">
      {data.map( (el, index) => (
        <Review 
          key={index}
          imagePath={el.imagePath}
          altText={el.imagePath}
          reviewerUsername={el.reviewerUsername}
          content={el.content}
          createdAt={el.createdAt}
        />
      ))}

      {data.size !== 0 
      ? <>
          <Pagination
            itemsPerPage={pageable.itemsPerPage}
            pagePerDisplay={pageable.pagePerDisplay}
            totalItems={pageable.totalItems}
            totalPages={pageable.totalPages}
            URL={`/review/${id}`}
            onChangePage={requestAxios}
          />
        </> 
      : null}
    </div>
  );
}

export default SellerReviewList;