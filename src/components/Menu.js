import React from "react";
import MenuCategory from "./MenuCategory";
import "./Menu.css";
import JumpToButton from "./JumpToButton";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

function Menu() {
  const menuData = [
    {
      title: "Buffalo Wings",
      id: "Buffalo_Wings",
      description:
        "Traditional or Boneless with celery, choice of Ranch or Blue cheese. Add French Fries & drink for $3.79 extra",
      items: [
        { name: "5 pcs", price: { Boneless: "5.99", Traditional: "6.49" } },
        { name: "10 pcs", price: { Boneless: "9.79", Traditional: "11.59" } },
        { name: "20 pcs", price: { Boneless: "18.99", Traditional: "22.59" } },
        { name: "30 pcs", price: { Boneless: "27.99", Traditional: "33.59" } },
        { name: "50 pcs", price: { Boneless: "45.99", Traditional: "55.99" } },
        {
          name: "100 pcs",
          price: { Boneless: "90.99", Traditional: "109.99" },
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
            { name: "Mild " },
            { name: "Hot ", spiciness: 1 },
            { name: "X-Hot ", spiciness: 2 },
            { name: "Crazy Hot ", spiciness: 3 },
            { name: "Die Hot ", spiciness: 6 },
            { name: "Buffalo Garlic ", spiciness: 1 },
            { name: "Cajun ", spiciness: 1 },
            { name: "Jamaican Jerk ", spiciness: 1 },
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
            { name: "Hot B.B.Q. ", spiciness: 1 },
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
            { name: "Asian Fuze ", spiciness: 1 },
            { name: "Cajun Ranch" },
            { name: "Mango Habanero ", spiciness: 2 },
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
        { name: "Crispy Fries", price: { Small: "3.29", Large: "5.29" } },
        { name: "Cheese Fries", price: { Small: "3.79", Large: "6.29" } },
        { name: "Bacon Cheese Fries", price: { Small: "4.99", Large: "7.29" } },
        { name: "Cole Slaw", price: "1.35" },
        { name: "Hot Chili", price: "2.99" },
        { name: "Corn Dog", price: "2.49" },
        { name: "Texas Toast (2 pcs)", price: "1.89" },
        { name: "Hushpuppy (4 pcs)", price: "1.89" },
      ],
    },
    {
      title: "Fresh Salads",
      id: "Fresh_Salads",
      description:
        "Served with Ranch, Blue cheese, Italian, Thousand Island, or Honey Mustard",
      items: [
        { name: "Side Salad", price: "3.69" },
        { name: "Garden Salad", price: "6.29" },
        { name: "Burnie's Salad", price: "8.99" },
        { name: "Grilled Chicken Salad", price: "9.49" },
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
        { name: "Funnel Cake", price: "2.49" },
        { name: "Cheesecake (with strawberry topping)", price: "2.99" },
        { name: "Chocolate Brownie Bites", price: "4.25" },
        { name: "Fried Cheesecake (with strawberry topping)", price: "5.29" },
      ],
    },
    {
      title: "Butterfly Shrimp",
      id: "Butterfly_Shrimp",
      description: "Served with Cocktail sauce or a sauce of your choice",
      items: [
        { name: "5 pcs", price: "5.99" },
        { name: "10 pcs", price: "10.49" },
        { name: "20 pcs", price: "19.99" },
      ],
    },
    {
      title: "Catfish Filet",
      id: "Catfish_Filet",
      description: "Add French Fries and drink for $3.79 extra",
      items: [
        { name: "Catfish Nuggets (6 pcs)", price: "6.29" },
        { name: "Small (3 pcs) plus hushpuppies and slaw", price: "8.49" },
        { name: "Regular (5 pcs) plus hushpuppies and slaw", price: "12.49" },
        { name: "Large (7 pcs) plus hushpuppies and slaw", price: "16.99" },
      ],
    },
    {
      title: "Sandwich Combos",
      id: "Sandwich_Combos",
      description: "Combo comes with French Fries and Drink",
      items: [
        {
          name: "Fried Chicken Tender",
          price: { Sandwich: "8.59", Combo: "11.59" },
        },
        { name: "Catfish", price: { Sandwich: "8.59", Combo: "11.59" } },
        { name: "Shrimp", price: { Sandwich: "8.59", Combo: "11.59" } },
        { name: "Philly Cheese", price: { Sandwich: "9.49", Combo: "12.49" } },
        { name: "Chicken Philly", price: { Sandwich: "9.49", Combo: "12.49" } },
        {
          name: "B.B.Q. Pork with Slaw",
          price: { Sandwich: "8.59", Combo: "11.59" },
        },
      ],
    },
    {
      title: "Kick Offs",
      id: "Kick_Offs",
      items: [
        {
          name: "Garbage Fries",
          price: { Small: "6.49", Large: "9.49" },
          description:
            "A generous portion of fries, topped with Backfire Chili, Salsa, Shredded Cheese, Jalapenos, Black Olives, and Sour Cream",
        },
        { name: "Fried Pickle Chips", price: "5.99" },
        { name: "Fried Pickle Spears", price: "5.99" },
        { name: "Mozzarella Cheese Sticks (5 pcs)", price: "5.49" },
        { name: "Cheddar Poppers (5 pcs)", price: "5.49" },
        { name: "Fried Mushrooms (10 pcs)", price: "5.69" },
        { name: "Onion Rings", price: "5.99" },
        { name: "Cheddar Broccoli (5 pcs)", price: "5.69" },
      ],
    },
    {
      title: "Family Meal Deals",
      id: "Family_Meal_Deals",
      items: [
        {
          name: "Family Meal",
          price: "37.99",
          description:
            "10 Wings, 10 Tenders, 2 large orders of fries, and a 2-liter Soda",
        },
        {
          name: "Wings and Shrimp Deal",
          price: "55.99",
          description:
            "30 Wings, 15 Shrimp, 2 large orders of fries, and a 2-liter Soda",
        },
        {
          name: "Catfish Family Meal",
          price: "39.99",
          description:
            "12 Catfish Filets, 12 hushpuppies, 1 large order of fries, and a 2-liter Soda",
        },
        {
          name: "Super Deal",
          price: "79.99",
          description:
            "40 Wings, 15 Tenders, 2 large orders of fries, and a 2-liter Soda",
        },
      ],
    },
    {
      title: "Beverages",
      id: "Beverages",
      items: [
        { name: "Soda or Tea (20 oz)", price: "1.89" },
        { name: "Soda or Tea (32 oz)", price: "2.59" },
        { name: "Bottled Drink", price: "2.25" },
        { name: "Bottled Water", price: "1.25" },
        { name: "2 Liter", price: "4.79" },
        { name: "Domestic Beer", price: "2.75" },
        { name: "Imported Beer", price: "3.75" },
      ],
    },
    {
      title: "Hibachi Entrees",
      id: "Hibachi_Entrees",
      description:
        "with Fried Rice, Zucchini, Onion, and Broccoli. ASK FOR YUMMY SAUCE FOR FRIED RICE",
      items: [
        { name: "Vegetable (Zucchini, Onion, & Broccoli)", price: "9.69" },
        { name: "Chicken", price: "10.29" },
        { name: "Beef (Yakiniku)", price: "11.29" },
        { name: "Shrimp", price: "11.29" },
        { name: "Chicken & Shrimp", price: "12.29" },
        { name: "Chicken & Beef (Yakiniku)", price: "12.59" },
        { name: "Shrimp & Beef (Yakiniku)", price: "13.29" },
        {
          name: "House Special Hibachi (Chicken, Beef, & Shrimp)",
          price: "15.49",
        },
      ],
    },
    {
      title: "Fried Rice",
      id: "Fried_Rice",
      description:
        "with Egg (does not include vegetables) & Yummy Sauce on the side",
      items: [
        { name: "Fried Rice", price: { Small: "3.79", Large: "6.99" } },
        {
          name: "Vegetable Fried Rice",
          price: { Small: "5.99", Large: "9.99" },
        },
        { name: "Chicken Fried Rice", price: { Small: "5.99", Large: "9.99" } },
        { name: "Beef Fried Rice", price: { Small: "6.39", Large: "11.29" } },
        { name: "Shrimp Fried Rice", price: { Small: "6.39", Large: "11.29" } },
        {
          name: "House Special Fried Rice (Chicken, Beef, Shrimp)",
          price: { Small: "7.89", Large: "12.99" },
        },
      ],
    },
    {
      title: "Lo Mein",
      id: "Lo_Mein",
      description: "does not include vegetables",
      items: [
        { name: "Lo Mein", price: { Small: "4.99", Large: "7.99" } },
        { name: "Vegetable Lo Mein", price: { Small: "6.69", Large: "11.29" } },
        { name: "Chicken Lo Mein", price: { Small: "6.69", Large: "11.29" } },
        { name: "Beef Lo Mein", price: { Small: "6.99", Large: "11.99" } },
        { name: "Shrimp Lo Mein", price: { Small: "6.99", Large: "11.99" } },
        {
          name: "House Special Lo Mein (Chicken, Beef, Shrimp)",
          price: { Small: "8.29", Large: "13.59" },
        },
      ],
    },
    {
      title: "Sweet and Sour Chicken",
      id: "Sweet_and_Sour_Chicken",
      description: "with Fried Rice or White Rice",
      items: [{ name: "Sweet & Sour Chicken", price: "12.49" }],
    },
    {
      title: "General Tso's and Sesame Chicken",
      id: "General_Tso's_and_Sesame_Chicken",
      description: "with Fried Rice or White Rice",
      items: [
        {
          name: "General Tso's Chicken (Spicy)",
          price: { Small: "9.29", Large: "13.49" },
        },
        { name: "Sesame Chicken", price: { Small: "9.29", Large: "13.49" } },
      ],
    },
    {
      title: "Side Orders",
      id: "Side_Orders",
      items: [
        { name: "Vegetable", price: "5.99" },
        { name: "Chicken", price: "5.29" },
        { name: "Beef", price: "5.99" },
        { name: "Shrimp", price: "5.99" },
        { name: "Edamame (Soy Bean)", price: "4.59" },
        { name: "Crab Rangoon (6 pcs)", price: "6.29" },
        { name: "Fried Dumpling (8 pcs)", price: "5.69" },
        { name: "Egg Roll (Pork) (1 pc)", price: "1.99" },
        { name: "Egg Roll (Pork) (3 pcs)", price: "5.59" },
        { name: "Spring Roll (Vegetable) (3 pcs)", price: "3.99" },
        { name: "Spring Roll (Vegetable) (6 pcs)", price: "6.99" },
        { name: "Yummy Sauce (1 pint)", price: "3.75" },
        { name: "Yummy Sauce (1 quart)", price: "6.99" },
      ],
    },
  ];

  return (
    <div className="bg-gold text-dark py-5">
      <div className="container text-center">
        <div className="menu-header d-flex justify-content-center align-items-center">
          <h2 className="mb-4 menu-title">Menu</h2>
          <JumpToButton categories={menuData} />
        </div>

        {menuData.map((category, index) => (
          <MenuCategory
            key={index}
            title={category.title}
            id={category.id}
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
