import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Review from "./Review";
import Pagination from "../common/Pagination";
import "./mypage.css";

function ReviewList() {
  
  const [data, setData] = useState([]);
  const [pageable, setPageable] = useState({
    itemsPerPage: 8,
    pagePerDisplay: 5,
    totalItems: null, 
    totalPages: null
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect( () => {
    requestAxios(parseInt(searchParams.get("page")) || 1);
  }, []);

  const requestAxios = (page) => {

    const accessToken = localStorage.getItem("accessToken");

    axios.get(`${process.env.REACT_APP_API_URL}/v1/my/review?page=${page}`, {
      headers: {
        "Authorization": accessToken
      }
    }).then( (res) => {
      if (res.data.statusCode === 200) {
        setData(res.data.data.content);
        setPageable({
          itemsPerPage: res.data.data.size,
          pagePerDisplay: 5,
          totalItems: res.data.data.totalElements, 
          totalPages: res.data.data.totalPages
        });
      }
    }).catch( (err) => {
      if (err.response.data.message === "토큰이 만료되었습니다.") {

        axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refresh`, {}, {
          withCredentials: true
        }).then( (res) => {
          if (res.data.statusCode === 200) {

            const newAccessToken = res.headers.authorization;
            localStorage.setItem("accessToken", newAccessToken);

            axios.get(`${process.env.REACT_APP_API_URL}/v1/my/review?page=${page}`, {
              headers: {
                "Authorization": newAccessToken
              }
            }).then( (res) => {
              if (res.data.statusCode === 200) {
                setData(res.data.data.content);
                setPageable({
                  itemsPerPage: res.data.data.size,
                  pagePerDisplay: 5,
                  totalItems: res.data.data.totalElements, 
                  totalPages: res.data.data.totalPages
                });
              }
            }).catch( (err) => {
              console.log("후기 목록 조회 실패: ", err);
            });

          }
        }).catch( (err) => {
          console.log("토큰 재발급 실패: ", err);
        });

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
            URL={`/mypage/review`}
            onChangePage={requestAxios}
          />
        </> 
      : null}
    </div>
  );
}

export default ReviewList;