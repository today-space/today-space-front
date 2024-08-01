import axios from "axios";
import {useEffect, useState} from "react";

function ProductDetail(){

  const [ProductData, setProductData] = useState([]);

  const token = localStorage.getItem('accessToken');


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/v1/products/${id}`, {
      headers: {
        Authorization: token,
      },
      withCredentials: true,
    })
    .then(response => {
      if (response.data.statusCode === 200) {
        setProductData(response.data.data.content);

      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [token]);


  return (
      <div>
        안녕
      </div>
  );
}

export default ProductDetail;