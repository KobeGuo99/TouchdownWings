import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-scroll';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaPepperHot, FaSearch, FaFilter } from 'react-icons/fa';
import styled from '@emotion/styled';
import menuData from './MenuData';
import './ModernMenu.css';

const StyledCard = styled(Card)`
  transition: transform 0.3s ease-in-out;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryNav = styled.div`
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`;

const SearchBar = styled.div`
  position: relative;
  margin: 1rem 0;
  
  input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 2px solid #eee;
    border-radius: 25px;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: #2b54a7;
      outline: none;
      box-shadow: 0 0 0 3px rgba(43, 84, 167, 0.1);
    }
  }
  
  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const ModernMenu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredMenuData = menuData.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.items?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const renderSpiciness = (spiciness) => {
    return Array(spiciness).fill().map((_, i) => (
      <FaPepperHot key={i} className="text-danger" />
    ));
  };

  const renderPrice = (price) => {
    if (typeof price === 'object') {
      return Object.entries(price).map(([type, value]) => (
        <div key={type} className="price-option">
          <Badge bg="secondary" className="me-2">{type}</Badge>
          <span>${value}</span>
        </div>
      ));
    }
    return <span>${price}</span>;
  };

  return (
    <div className="modern-menu" ref={ref}>
      <CategoryNav>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="category-links">
                {menuData.map((category) => (
                  <Link
                    key={category.id}
                    to={category.id}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="category-link"
                    onSetActive={() => setActiveCategory(category.id)}
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </Col>
            <Col md={4}>
              <SearchBar>
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </SearchBar>
            </Col>
          </Row>
        </Container>
      </CategoryNav>

      <Container className="py-5">
        <AnimatePresence>
          {filteredMenuData.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              id={category.id}
            >
              <StyledCard>
                <Card.Header className="bg-primary text-white">
                  <h2 className="h4 mb-0">{category.title}</h2>
                </Card.Header>
                {category.description && (
                  <Card.Body className="border-bottom">
                    <p className="text-muted mb-0">{category.description}</p>
                  </Card.Body>
                )}
                <Card.Body>
                  {category.subcategories ? (
                    // Render subcategories for sauces
                    category.subcategories.map((subcategory, subIndex) => (
                      <div key={subIndex} className="mb-4">
                        <h5 className="h6 mb-3 text-primary">{subcategory.subcategoryTitle}</h5>
                        <Row>
                          {subcategory.items.map((item, itemIndex) => (
                            <Col key={itemIndex} md={6} className="mb-3">
                              <div className="menu-item">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <h5 className="mb-1">{item.name}</h5>
                                    {item.spiciness && (
                                      <div className="spiciness-indicator">
                                        {renderSpiciness(item.spiciness)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ))
                  ) : (
                    // Render regular items with prices
                    <Row>
                      {category.items?.map((item, index) => (
                        <Col key={index} md={6} className="mb-4">
                          <div className="menu-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="mb-1">{item.name}</h5>
                                {item.spiciness && (
                                  <div className="spiciness-indicator">
                                    {renderSpiciness(item.spiciness)}
                                  </div>
                                )}
                                {item.description && (
                                  <p className="text-muted small mb-2">{item.description}</p>
                                )}
                              </div>
                              <div className="price">
                                {renderPrice(item.price)}
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Card.Body>
              </StyledCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default ModernMenu; 