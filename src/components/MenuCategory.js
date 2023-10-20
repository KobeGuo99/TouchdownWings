import React from "react";
import PropTypes from "prop-types";
import "./MenuCategory.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function MenuCategory({ id, title, description, items, subcategories }) {
  const hasMultipleOptions =
    items && items.some((item) => typeof item.price === "object");

    const renderPepperIcons = (spiciness) => {
      const peppers = [];
      for (let i = 0; i < spiciness; i++) {
        peppers.push(<FontAwesomeIcon icon={["fas", "pepper-hot"]} key={i} />);
      } 
      return peppers;
  };
  

  return (
    <div className="card mb-4" id={id}>
      <div className="card-header bg-dark text-white">{title}</div>
      {description && (
        <div className="card-body pb-0">
          <p className="card-text">{description}</p>
        </div>
      )}
      {items && (
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                {hasMultipleOptions ? (
                  Object.keys(items[0].price).map((option) => (
                    <th key={option} scope="col">
                      {option}
                    </th>
                  ))
                ) : (
                  <th scope="col">Price</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.name}
                    {item.spiciness && renderPepperIcons(item.spiciness)}
                    {item.description && (
                      <div className="item-description">{item.description}</div>
                    )}
                  </td>
                  {typeof item.price === "object" ? (
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
      )}

      {subcategories &&
        subcategories.map((subcategory, index) => (
          <div key={index} className="card-body pb-0">
            <h5 className="card-title">{subcategory.subcategoryTitle}</h5>
            <ul className="list-unstyled">
              {subcategory.items.map((item, index) => (
                <li key={index}>
                  {item.name}
                  {item.spiciness && renderPepperIcons(item.spiciness)}
                </li>
              ))}
            </ul>
          </div>
        ))}
        
    </div>
  );
}

MenuCategory.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
    })
  ).isRequired,
};

export default MenuCategory;
