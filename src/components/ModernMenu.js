import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link, scroller } from 'react-scroll';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaPepperHot, FaSearch, FaFilter, FaArrowUp } from 'react-icons/fa';
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

const ToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(43, 84, 167, 0.9);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  &:hover {
    background: rgba(43, 84, 167, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 36px;
    height: 36px;
  }
`;

const ModernMenu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const categoryLinksRef = useRef(null);
  const [atScrollStart, setAtScrollStart] = useState(true);
  const [atScrollEnd, setAtScrollEnd] = useState(false);
  const categoryRefs = useRef({});
  const observerRef = useRef(null);
  const [showToTop, setShowToTop] = useState(false);
  const menuSectionRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    setAtScrollStart(scrollLeft <= 2);
    setAtScrollEnd(scrollLeft + clientWidth >= scrollWidth - 2);
    setIsScrolled(scrollLeft + clientWidth >= scrollWidth - 10);
  };

  const handleArrowClick = () => {
    if (categoryLinksRef.current) {
      const container = categoryLinksRef.current;
      const scrollAmount = Math.min(300, container.scrollWidth - container.scrollLeft - container.clientWidth);
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Update active category based on which section is most visible
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: [0, 0.5, 1]
    };

    observerRef.current = new IntersectionObserver((entries) => {
      // Find the entry with the highest intersection ratio
      const mostVisibleEntry = entries.reduce((max, entry) => {
        return entry.intersectionRatio > max.intersectionRatio ? entry : max;
      }, entries[0]);

      if (mostVisibleEntry && mostVisibleEntry.isIntersecting) {
        setActiveCategory(mostVisibleEntry.target.id);
      }
    }, observerOptions);

    // Observe all category sections
    Object.values(categoryRefs.current).forEach(ref => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    scrollToCategory(categoryId);
  };

  const scrollToCategory = (categoryId) => {
    scroller.scrollTo(categoryId, {
      duration: 800,
      smooth: true,
      offset: -100,
      containerId: 'menu-section'
    });
  };

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

  // Handle scroll to show/hide to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (!menuSectionRef.current) return;
      
      const rect = menuSectionRef.current.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom >= 0;
      setShowToTop(isInView);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scroller.scrollTo('menu-section', {
      duration: 800,
      smooth: true,
      offset: 0
    });
  };

  return (
    <div className="modern-menu" id="menu-section" ref={(el) => {
      ref(el);
      menuSectionRef.current = el;
    }}>
      <CategoryNav>
        <Container>
          <Row className="align-items-center g-2">
            <Col md={8} style={{ position: 'relative' }}>
              <div className={`category-links-container ${isScrolled ? 'scrolled' : ''}`}> 
                <div
                  className="category-links"
                  ref={categoryLinksRef}
                  onScroll={handleScroll}
                  tabIndex={0}
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {menuData.map((category) => (
                    <Link
                      key={category.id}
                      to={category.id}
                      spy={false}
                      smooth={true}
                      offset={-100}
                      duration={800}
                      className={`category-link ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
                {!atScrollEnd && (
                  <button
                    className="scroll-arrow"
                    onClick={handleArrowClick}
                    aria-label="Scroll categories right"
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <span className="arrow-icon">→</span>
                  </button>
                )}
              </div>
            </Col>
            <Col md={4}>
              <SearchBar>
                <input
                  type="text"
                  placeholder="Search our menu..."
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
              ref={el => categoryRefs.current[category.id] = el}
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

      <ToTopButton 
        className={showToTop ? 'visible' : ''}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </ToTopButton>
    </div>
  );
};

export default ModernMenu; 