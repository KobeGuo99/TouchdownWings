import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import imageData from './imageData.json'; 
import './FoodGallery.css';

const extractNumber = (filename) => {
  const match = filename.match(/\d+/); 
  return match ? parseInt(match[0], 10) : 0;
};

const images = require.context('../assets/food_pics', false, /\.(png|jpe?g|svg)$/)
  .keys()
  .sort((a, b) => extractNumber(a) - extractNumber(b)) // Sort by numerical value
  .map(filename => require(`../assets/food_pics/${filename.replace('./', '')}`));

const FoodGallery = () => {
  return (
    <Container className="mt-4">
        <h1 className='text-center mb-5 fw-bold'>Pictures</h1>
      <Row>
        {images.map((imgSrc, index) => {
          const title = imageData[index]?.title || `Item ${index + 1}`;
          return (
            <Col xs={12} md={6} lg={3} key={index} className="mb-4">
              <img src={imgSrc} alt={title} className="img-fluid food-gallery-image" />
              <h5 className="mt-2 text-center">{title}</h5>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default FoodGallery;




