import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';

const SearchTags = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTopTags();
  }, []);

  const fetchTopTags = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/hashtags`);
      const data = response.data.data;
      setTags(data);
    } catch (error) {
      console.error('Error fetching top tags', error);
    }
  };

  return (
      <div className="search-tags">
        <div className="search-tags-content">
          {tags.map((tag, index) => (
              <span key={index} className="search-tag" onClick={() => onTagClick(tag)} style={{ cursor: 'pointer' }}>#{tag}</span>
          ))}
        </div>
      </div>
  );
};

export default SearchTags;
