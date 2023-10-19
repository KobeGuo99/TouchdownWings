// src/components/JumpToButton.js
import React, { useState } from 'react';
import './JumpToButton.css';

function JumpToButton({ categories }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const jumpToCategory = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <div className="jump-to-button">
      <button onClick={toggleMenu}>Jump To</button>
      {isOpen && (
        <div className="jump-to-menu">
          {categories.map((category, index) => (
            <button key={index} onClick={() => jumpToCategory(category.id)}>  
              {category.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default JumpToButton;

