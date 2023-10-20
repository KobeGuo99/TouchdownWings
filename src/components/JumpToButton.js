import React from 'react';
import './JumpToButton.css';

function JumpToButton({ categories }) {

  const jumpToCategory = (event) => {
    const id = event.target.value;
    if (id) {
      const element = document.getElementById(id);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    event.target.value = '';
  };

  return (
    <div className="jump-to-button">
      <select onChange={jumpToCategory} className="jump-to-select">
        <option value="">Select</option>
        {categories.map((category, index) => (
          <option key={index} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default JumpToButton;

