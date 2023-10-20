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
      title: "Sauces",
      id: "Sauces",
      subcategories: [
        {
          subcategoryTitle: "Buffalo Style",
          items: [
            { name: "Mild" },
            { name: "Hot" },
            { name: "X-Hot" },
            { name: "Crazy Hot" },
            { name: "Die Hot" },
            { name: "Buffalo Garlic" },
            { name: "Cajun" },
            { name: "Jamaican Jerk" },
          ],
        },
        {
          subcategoryTitle: "Dry Seasoning",
          items: [
            { name: "Cajun" },
            { name: "B.B.Q. Chipotle" },
            { name: "Lemon Pepper" },
            { name: "Garlic Salt" },
            { name: "Jamaican Jerk" },

          ],
        },
        {
          subcategoryTitle: "B.B.Q. Style",
          items: [
            { name: "B.B.Q." },
            { name: "Honey B.B.Q." },
            { name: "Hot B.B.Q." },
            { name: "B.B.Q. Chipotle" },
            { name: "Honey Gold" },
          ],
        },
        {
          subcategoryTitle: "House Special Style",
          items: [
            { name: "Lemon Pepper" },
            { name: "Sweet & Sour" },
            { name: "Garlic Parmesan" },
            { name: "Honey Mustard" },
            { name: "Golden Garlic" },
            { name: "Teriyaki Sesame" },
            { name: "Asian Fuze" },
            { name: "Cajun Ranch" },
          ],
        },
      ],
    },
    {
      title: "Chicken Tenders",
      id: "Chicken_Tenders",
      description:
        "Served with your choice of sauce on it or sauce on the side",
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
    {
      title: "Kids Meal",
      id: "Kids_Meal",
      description:
        "Under 12 years old - with small French Fries and small drink",
      items: [
        { name: "5 pc. Boneless Wings", price: "6.69" },
        { name: "2 pc. Chicken Strips", price: "6.99" },
        { name: "6 pc. Chicken Nuggets", price: "5.69" },
        { name: "1 pc. Corn Dog", price: "5.69" },
      ],
    },
    {
      title: "Extras",
      id: "Extras",
      items: [
        { name: "Celery (10 pcs)", price: "1.00" },
        { name: "Sauce or Dressing", price: "0.70" },

      ],
    },
    {
      title: "Desserts",
      id: "Desserts",
      items: [
        { name: "Funnel Cake", price: "2.39" },
        { name: "Cheesecake (with strawberry topping)", price: "2.99" },
        { name: "Fried Cheesecake (with strawberry topping)", price: "5.29" },
      ],
    },
    {
      title: "Butterfly Shrimp",
      id: "Butterfly_Shrimp",
      description:
        "Served with Cocktail sauce or a sauce of your choice",
      items: [
        { name: "5 pcs", price: "5.99" },
        { name: "10 pcs", price: "9.99" },
        { name: "20 pcs", price: "18.99" },

      ],
    },
    {
      title: "Catfish Filet",
      id: "Catfish_Filet",
      description:
        "Add French Fries and drink for $3.79 extra",
      items: [
        { name: "Catfish Nuggets (6 pcs)", price: "6.19" },
        { name: "Small (3 pcs) plus hushpuppies and slaw", price: "8.29" },
        { name: "Regular (5 pcs) plus hushpuppies and slaw", price: "12.29" },
        { name: "Large (7 pcs) plus hushpuppies and slaw", price: "16.49" },
      ],
    },
    {
      title: "Sandwich Combos",
      id: "Sandwich_Combos",
      description:
        "Combo comes with French Fries and Drink",
      items: [
        { name: "Fried Chicken Tender", price: { Sandwich: "8.59", Combo: "11.59" } },
        { name: "Catfish", price: { Sandwich: "8.59", Combo: "11.59" } },
        { name: "Shrimp", price: { Sandwich: "8.59", Combo: "11.59" } },
        { name: "Philly Cheese", price: { Sandwich: "8.59", Combo: "11.59" } },
        { name: "Chicken Philly", price: { Sandwich: "8.59", Combo: "11.59" } },
        { name: "B.B.Q. Pork with Slaw", price: { Sandwich: "8.59", Combo: "11.59" } },
      ],
    },
    {
      title: "Kick-Offs",
      id: "Kick_Offs",
      items: [
        { 
          name: "Garbage Fries", 
          price: { Small: "5.59", Large: "9.99" },
          description: "A generous portion of fries, topped with Backfire Chili, Salsa, Shredded Cheese, Jalapenos, Black Olives, and Sour Cream"  
        },
        

      ],
    },
  ];

  return (
    <div className="bg-gold text-dark py-5">
      <div className="container text-center">
        <div className="menu-header">
          <h2 className="mb-4 menu-title">Menu</h2>
          <JumpToButton categories={menuData} />
        </div>

        {menuData.map((category, index) => (
          <MenuCategory
            key={index}
            title={category.title}
            id={category.title.replace(/ /g, "_")}
            items={category.items}
            description={category.description}
            subcategories={category.subcategories}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
