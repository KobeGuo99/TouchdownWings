
import React from 'react';
import PropTypes from 'prop-types';
import './MenuCategory.css';

function MenuCategory({ id, title, description, items }) {
  const hasMultipleOptions = items.some(item => typeof item.price === 'object');

  return (
    <div className="card mb-4" id={id}>
      <div className="card-header bg-dark text-white">
        {title}
      </div>
      {description && (
        <div className="card-body pb-0">
          <p className="card-text">{description}</p>
        </div>
      )}
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              {hasMultipleOptions ? (
                Object.keys(items[0].price).map(option => (
                  <th key={option} scope="col">{option}</th>
                ))
              ) : (
                <th scope="col">Price</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                {typeof item.price === 'object' ? (
                  Object.values(item.price).map((price, idx) => (
                    <td key={idx}>${price}</td>
                  ))
                ) : (
                  <td>${item.price}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

MenuCategory.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,  
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]).isRequired
    })
  ).isRequired
};

export default MenuCategory;



       
