const menuData = [
  {
    title: "Buffalo Wings",
    id: "Buffalo_Wings",
    description:
      "Traditional or Boneless with celery, choice of Ranch or Blue cheese. Add French Fries & drink for $4.25 extra",
    items: [
      { name: "5 pcs", price: { Boneless: "6.19", Traditional: "6.79" } },
      { name: "10 pcs", price: { Boneless: "9.89", Traditional: "11.89" } },
      { name: "20 pcs", price: { Boneless: "19.69", Traditional: "23.29" } },
      { name: "30 pcs", price: { Boneless: "28.99", Traditional: "34.29" } },
      { name: "50 pcs", price: { Boneless: "47.99", Traditional: "56.69" } },
      {
        name: "100 pcs",
        price: { Boneless: "92.99", Traditional: "109.99" },
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
          { name: "Mango Habanero ", spiciness: 2 },
          { name: "Honey Hot ", spiciness: 1 },
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
      { name: "3 pcs (1 sauce)", price: "7.29" },
      { name: "5 pcs (2 sauces)", price: "11.49" },
      { name: "10 pcs (3 sauces)", price: "21.29" },
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
      { name: "5 pc. Boneless Wings", price: "6.99" },
      { name: "2 pc. Chicken Strips", price: "6.99" },
      { name: "6 pc. Chicken Nuggets", price: "5.99" },
      { name: "1 pc. Corn Dog", price: "5.89" },
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
      { name: "Funnel Cake", price: "2.89" },
      { name: "Cheesecake (with strawberry topping)", price: "3.39" },
      { name: "Chocolate Brownie Bites", price: "4.39" },
      { name: "Fried Cheesecake (with strawberry topping)", price: "5.49" },
    ],
  },
  {
    title: "Butterfly Shrimp",
    id: "Butterfly_Shrimp",
    description: "Served with Cocktail sauce or a sauce of your choice",
    items: [
      { name: "5 pcs", price: "6.29" },
      { name: "10 pcs", price: "10.59" },
      { name: "20 pcs", price: "20.19" },
    ],
  },
  {
    title: "Catfish Filet",
    id: "Catfish_Filet",
    items: [
      { name: "Catfish Nuggets (6 pcs)", price: "6.69" },
      { name: "Small (3 pcs) plus hushpuppies and slaw", price: "8.79" },
      { name: "Regular (5 pcs) plus hushpuppies and slaw", price: "13.29" },
      { name: "Large (7 pcs) plus hushpuppies and slaw", price: "17.99" },
    ],
  },
  {
    title: "Sandwich Combos",
    id: "Sandwich_Combos",
    description: "Combo comes with French Fries and Drink",
    items: [
      {
        name: "Fried Chicken Tender",
        price: { Sandwich: "8.99", Combo: "11.99" },
      },
      { name: "Catfish", price: { Sandwich: "9.29", Combo: "12.29" } },
      { name: "Shrimp", price: { Sandwich: "9.29", Combo: "12.29" } },
      { name: "Philly Cheese", price: { Sandwich: "10.29", Combo: "13.49" } },
      { name: "Chicken Philly", price: { Sandwich: "10.29", Combo: "13.49" } },
      {
        name: "B.B.Q. Pork with Slaw",
        price: { Sandwich: "8.99", Combo: "11.99" },
      },
    ],
  },
  {
    title: "Kick Offs",
    id: "Kick_Offs",
    items: [
      {
        name: "Garbage Fries",
        price: { Small: "6.79", Large: "9.79" },
        description:
          "A generous portion of fries, topped with Backfire Chili, Salsa, Shredded Cheese, Jalapenos, Black Olives, and Sour Cream",
      },
      { name: "Fried Pickle Chips", price: "5.99" },
      { name: "Fried Pickle Spears", price: "5.99" },
      { name: "Mozzarella Cheese Sticks (5 pcs)", price: "5.99" },
      { name: "Cheddar Poppers (5 pcs)", price: "5.99" },
      { name: "Fried Mushrooms (10 pcs)", price: "5.99" },
      { name: "Onion Rings", price: "5.99" },
      { name: "Cheddar Broccoli (5 pcs)", price: "5.99" },
    ],
  },
  {
    title: "Family Meal Deals",
    id: "Family_Meal_Deals",
    items: [
      {
        name: "Family Meal",
        price: "43.99",
        description:
          "10 Wings, 10 Tenders, 2 large orders of fries, and a 2-liter Soda",
      },
      {
        name: "Wings and Shrimp Deal",
        price: "60.99",
        description:
          "30 Wings, 15 Shrimp, 2 large orders of fries, and a 2-liter Soda",
      },
      {
        name: "Catfish Family Meal",
        price: "40.99",
        description:
          "12 Catfish Filets, 12 hushpuppies, 1 large order of fries, and a 2-liter Soda",
      },
      {
        name: "Super Deal",
        price: "86.99",
        description:
          "40 Wings, 15 Tenders, 2 large orders of fries, and a 2-liter Soda",
      },
    ],
  },
  {
    title: "Beverages",
    id: "Beverages",
    items: [
      { name: "Soda or Tea (20 oz)", price: "1.99" },
      { name: "Soda or Tea (32 oz)", price: "2.69" },
      { name: "Bottled Drink", price: "2.25" },
      { name: "Bottled Water", price: "1.25" },
      // { name: "2 Liter", price: "4.79" },
      // { name: "Domestic Beer", price: "2.75" },
      // { name: "Imported Beer", price: "3.75" },
    ],
  },
  {
    title: "Hibachi Entrees",
    id: "Hibachi_Entrees",
    description:
      "with Fried Rice, Zucchini, Onion, and Broccoli. ASK FOR YUMMY SAUCE FOR FRIED RICE",
    items: [
      { name: "Vegetable (Zucchini, Onion, & Broccoli)", price: "9.99" },
      { name: "Chicken", price: "10.79" },
      { name: "Beef (Yakiniku)", price: "11.79" },
      { name: "Shrimp", price: "11.79" },
      { name: "Chicken & Shrimp", price: "12.99" },
      { name: "Chicken & Beef (Yakiniku)", price: "13.49" },
      { name: "Shrimp & Beef (Yakiniku)", price: "13.99" },
      {
        name: "House Special Hibachi (Chicken, Beef, & Shrimp)",
        price: "16.59",
      },
    ],
  },
  {
    title: "Fried Rice",
    id: "Fried_Rice",
    description:
      "with Egg (does not include vegetables) & Yummy Sauce on the side",
    items: [
      { name: "Fried Rice", price: { Small: "4.19", Large: "7.39" } },
      {
        name: "Vegetable Fried Rice",
        price: { Small: "6.49", Large: "10.69" },
      },
      { name: "Chicken Fried Rice", price: { Small: "6.49", Large: "10.69" } },
      { name: "Beef Fried Rice", price: { Small: "6.89", Large: "12.09" } },
      { name: "Shrimp Fried Rice", price: { Small: "6.89", Large: "12.09" } },
      {
        name: "House Special Fried Rice (Chicken, Beef, Shrimp)",
        price: { Small: "8.39", Large: "13.79" },
      },
    ],
  },
  {
    title: "Lo Mein",
    id: "Lo_Mein",
    description: "does not include vegetables",
    items: [
      { name: "Lo Mein", price: { Small: "5.19", Large: "8.39" } },
      { name: "Vegetable Lo Mein", price: { Small: "7.19", Large: "12,09" } },
      { name: "Chicken Lo Mein", price: { Small: "7.19", Large: "12.09" } },
      { name: "Beef Lo Mein", price: { Small: "7.49", Large: "12.79" } },
      { name: "Shrimp Lo Mein", price: { Small: "7.49", Large: "12.79" } },
      {
        name: "House Special Lo Mein (Chicken, Beef, Shrimp)",
        price: { Small: "8.79", Large: "14.39" },
      },
    ],
  },
  {
    title: "Sweet and Sour Chicken",
    id: "Sweet_and_Sour_Chicken",
    description: "with Fried Rice or White Rice",
    items: [{ name: "Sweet & Sour Chicken", price: "12.99" }],
  },
  {
    title: "General Tso's and Sesame Chicken",
    id: "General_Tso's_and_Sesame_Chicken",
    description: "with Fried Rice or White Rice",
    items: [
      {
        name: "General Tso's Chicken (Spicy)",
        price: { Small: "9.65", Large: "13.99" },
      },
      { name: "Sesame Chicken", price: { Small: "9.65", Large: "13.99" } },
    ],
  },
  {
    title: "Side Orders",
    id: "Side_Orders",
    items: [
      { name: "Vegetable", price: "6.25" },
      { name: "Chicken", price: "5.89" },
      { name: "Beef", price: "6.25" },
      { name: "Shrimp", price: "6.25" },
      { name: "Edamame (Soy Bean)", price: "4.79" },
      { name: "Crab Rangoon (6 pcs)", price: "6.49" },
      { name: "Fried Dumpling (8 pcs)", price: "5.89" },
      { name: "Egg Roll (Pork) (1 pc)", price: "1.99" },
      { name: "Egg Roll (Pork) (3 pcs)", price: "5.69" },
      { name: "Spring Roll (Vegetable) (3 pcs)", price: "3.99" },
      { name: "Spring Roll (Vegetable) (6 pcs)", price: "6.99" },
      { name: "Yummy Sauce (1 pint)", price: "3.99" },
      { name: "Yummy Sauce (1 quart)", price: "6.99" },
    ],
  },
];

export default menuData; 