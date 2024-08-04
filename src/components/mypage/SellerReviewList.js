import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Review from "./Review";
import "./mypage.css";

function SellerReviewList() {

  const [data, setData] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect( () => {

    axios.get(`${process.env.REACT_APP_API_URL}/v1/users/${id}/reviews`)
    .then( (res) => {
      if (res.data.statusCode === 200) {
        setData(res.data.data.content);
      }
    }).catch( (err) =>{
      if (err.response.data.statusCode === 400) {
        navigate(`/notfound`);
      }
    });

  }, []);

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
    </div>
  );
}

export default SellerReviewList;