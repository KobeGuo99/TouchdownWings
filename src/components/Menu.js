// src/components/Menu.js
import React from "react";
import MenuCategory from "./MenuCategory";
import "./Menu.css";
import JumpToButton from "./JumpToButton";

function Menu() {
  const menuData = [
    {
      title: "Buffalo Wings",
      id: "Buffalo_Wings",
      description:
        "Traditional or Boneless with celery, choice of Ranch or Bluecheese. Add French Fries & drink for $3.79 extra",
      items: [
        { name: "5 pcs", price: { Boneless: "5.59", Traditional: "6.29" } },
        { name: "10 pcs", price: { Boneless: "9.49", Traditional: "11.29" } },
        { name: "20 pcs", price: { Boneless: "18.29", Traditional: "21.99" } },
        { name: "30 pcs", price: { Boneless: "26.39", Traditional: "32.99" } },
        { name: "50 pcs", price: { Boneless: "43.49", Traditional: "54.99" } },
        {
          name: "100 pcs",
          price: { Boneless: "86.99", Traditional: "109.99" },
        },
      ],
    },
    {
      title: "Chicken Tenders",
      id: "Chicken_Tenders",
      description:
        "Served with your choice of Touchdown Wings sauce on it or sauce on the side",
      items: [
        { name: "3 pcs (1 sauce)", price: "6.99" },
        { name: "5 pcs (2 sauces)", price: "10.99" },
        { name: "10 pcs (3 sauces)", price: "20.49" },
      ],
    },
    {
      title: "Sidelines",
      id: "Sidelines",
      items: [
        { name: "Crispy Fries", price: { Small: "2.79", Large: "4.79" } },
        { name: "Cheese Fries", price: { Small: "3.29", Large: "5.79" } },
        { name: "Bacon Cheese Fries", price: { Small: "4.49", Large: "6.79" } },
        { name: "Cole Slaw", price: "1.25" },
        { name: "Hot Chili", price: "2.99" },
        { name: "Corn Dog", price: "2.49" },
        { name: "Texas Toast (2 pcs)", price: "1.89" },
        { name: "Cole Slaw (4 pcs)", price: "1.89" },
      ],
    },
    {
      title: "Fresh Salads",
      id: "Fresh_Salads",
      description:
        "Served with Ranch, Bluecheese, Italian, Thousand Island, or Honey Mustard",
      items: [
        { name: "Side Salad", price: "3.39" },
        { name: "Garden Salad", price: "5.89" },
        { name: "Burnie's Salad", price: "8.69" },
        { name: "Grilled Chicken Salad", price: "8.99" },
        { name: "Buffalo Shrimp Salad", price: "9.49" },
        { name: "Catfish Salad", price: "9.49" },
      ],
    },
  ];

  return (
    <div className="bg-gold text-dark py-5">
      <div className="container text-center">
        <div>
          <h2 className="mb-4">Menu</h2>
          <JumpToButton categories={menuData} />
        </div>

        {menuData.map((category, index) => (
          <MenuCategory
            key={index}
            title={category.title}
            id={category.title.replace(/ /g, "_")}
            items={category.items}
            description={category.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
