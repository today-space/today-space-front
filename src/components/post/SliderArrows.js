import React from 'react';

export function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
      <div
          className={className}
          style={{ ...style, display: 'block', left: '10px', zIndex: 1 }}
          onClick={onClick}
      />
  );
}

export function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
      <div
          className={className}
          style={{ ...style, display: 'block', right: '10px', zIndex: 1 }}
          onClick={onClick}
      />
  );
}
