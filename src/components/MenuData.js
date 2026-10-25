// ─────────────────────────────────────────────────────────────
//  MENU — edit prices and items here. Nothing else to touch.
//
//  Structure:
//    group         a heading that covers everything inside it.
//                  Never name a group after one of its own
//                  categories, or the siblings look misfiled.
//    categories[]  each gets its own heading on the page
//      id          used for the jump links; keep it unique,
//                  lowercase, no spaces
//      title       shown on the page
//      note        optional line under the title
//      priceColumns  optional. Use ONLY when items genuinely come
//                  in two versions, e.g. ["Boneless","Traditional"]
//                  or ["Small","Large"]. Then give each item two
//                  prices. An item with a single price still works
//                  and will span the column.
//      items[]     { name, prices: ["0.00"], description?, heat? }
//      sauceGroups[]  used by the Sauces category instead of items
//
//  Prices are plain strings without the dollar sign: "6.19"
//  heat is 1-6 and draws the little red meter.
// ─────────────────────────────────────────────────────────────

const menu = [
  {
    group: "Wings & Sauces",
    categories: [
      {
        id: "wings",
        title: "Buffalo Wings",
        note: "Traditional or boneless, with celery and your choice of ranch or blue cheese. Add fries and a drink for $4.25.",
        priceColumns: ["Boneless", "Traditional"],
        items: [
          { name: "5 pcs", prices: ["6.19", "6.79"] },
          { name: "10 pcs", prices: ["9.89", "11.89"] },
          { name: "20 pcs", prices: ["19.69", "23.29"] },
          { name: "30 pcs", prices: ["28.99", "34.49"] },
          { name: "50 pcs", prices: ["47.99", "56.99"] },
          { name: "100 pcs", prices: ["92.99", "109.99"] },
        ],
      },
      {
        id: "sauces",
        title: "Sauces",
        note: "Every wing order comes with a sauce. Heat runs one to six.",
        sauceGroups: [
          {
            title: "Buffalo Style",
            sauces: [
              { name: "Mild" },
              { name: "Hot", heat: 1 },
              { name: "X-Hot", heat: 2 },
              { name: "Crazy Hot", heat: 3 },
              { name: "Die Hot", heat: 6 },
              { name: "Buffalo Garlic", heat: 1 },
              { name: "Cajun", heat: 1 },
              { name: "Jamaican Jerk", heat: 1 },
              { name: "Mango Habanero", heat: 2 },
              { name: "Honey Hot", heat: 1 },
            ],
          },
          {
            title: "Dry Seasoning",
            sauces: [
              { name: "Cajun" },
              { name: "B.B.Q. Chipotle" },
              { name: "Lemon Pepper" },
              { name: "Garlic Salt" },
              { name: "Jamaican Jerk" },
            ],
          },
          {
            title: "B.B.Q. Style",
            sauces: [
              { name: "Honey B.B.Q." },
              { name: "Hot B.B.Q.", heat: 1 },
              { name: "B.B.Q. Chipotle" },
              { name: "Honey Gold" },
            ],
          },
          {
            title: "House Special",
            sauces: [
              { name: "Lemon Pepper" },
              { name: "Sweet & Sour" },
              { name: "Garlic Parmesan" },
              { name: "Honey Mustard" },
              { name: "Golden Garlic" },
              { name: "Teriyaki Sesame" },
              { name: "Asian Fuze", heat: 1 },
              { name: "Cajun Ranch" },
            ],
          },
        ],
      },
    ],
  },

  {
    group: "Starters & Sides",
    categories: [
      {
        id: "kickoffs",
        title: "Kick Offs",
        priceColumns: ["Small", "Large"],
        items: [
          {
            name: "Garbage Fries",
            prices: ["6.99", "9.99"],
            description:
              "Fries loaded with Backfire chili, salsa, shredded cheese, jalapeños, black olives and sour cream",
          },
          { name: "Fried Pickle Chips", prices: ["6.59"] },
          { name: "Fried Pickle Spears", prices: ["6.59"] },
          { name: "Mozzarella Cheese Sticks (5 pcs)", prices: ["6.59"] },
          { name: "Cheddar Poppers (5 pcs)", prices: ["6.59"] },
          { name: "Fried Mushrooms (10 pcs)", prices: ["6.59"] },
          { name: "Onion Rings", prices: ["6.59"] },
          { name: "Cheddar Broccoli (5 pcs)", prices: ["6.59"] },
        ],
      },
      {
        id: "sidelines",
        title: "Sidelines",
        priceColumns: ["Small", "Large"],
        items: [
          { name: "Crispy Fries", prices: ["3.69", "5.89"] },
          { name: "Cheese Fries", prices: ["4.69", "6.89"] },
          { name: "Bacon Cheese Fries", prices: ["5.69", "7.89"] },
          { name: "Cole Slaw", prices: ["1.35"] },
          { name: "Hot Chili", prices: ["3.99"] },
          { name: "Corn Dog", prices: ["2.49"] },
          { name: "Texas Toast (2 pcs)", prices: ["1.89"] },
          { name: "Hushpuppy (4 pcs)", prices: ["1.89"] },
        ],
      },
      {
        id: "extras",
        title: "Extras",
        items: [
          { name: "Celery (10 pcs)", prices: ["1.00"] },
          { name: "Sauce or Dressing", prices: ["0.70"] },
        ],
      },
    ],
  },

  {
    group: "Chicken & Seafood",
    categories: [
      {
        id: "tenders",
        title: "Chicken Tenders",
        note: "Served with sauce on it or on the side.",
        items: [
          { name: "3 pcs (1 sauce)", prices: ["7.29"] },
          { name: "5 pcs (2 sauces)", prices: ["11.49"] },
          { name: "10 pcs (3 sauces)", prices: ["21.99"] },
        ],
      },
      {
        id: "shrimp",
        title: "Butterfly Shrimp",
        note: "Served with cocktail sauce or a sauce of your choice.",
        items: [
          { name: "5 pcs", prices: ["6.29"] },
          { name: "10 pcs", prices: ["10.99"] },
          { name: "20 pcs", prices: ["20.99"] },
        ],
      },
      {
        id: "catfish",
        title: "Catfish Filet",
        items: [
          { name: "Catfish Nuggets (6 pcs)", prices: ["6.89"] },
          {
            name: "Small (3 pcs)",
            prices: ["8.99"],
            description: "Plus hushpuppies and slaw",
          },
          {
            name: "Regular (5 pcs)",
            prices: ["13.49"],
            description: "Plus hushpuppies and slaw",
          },
          {
            name: "Large (7 pcs)",
            prices: ["17.99"],
            description: "Plus hushpuppies and slaw",
          },
        ],
      },
    ],
  },

  {
    group: "Sandwiches & Salads",
    categories: [
      {
        id: "sandwiches",
        title: "Sandwich Combos",
        note: "Combo comes with fries and a drink.",
        priceColumns: ["Sandwich", "Combo"],
        items: [
          { name: "Fried Chicken Tender", prices: ["9.29", "12.29"] },
          { name: "Catfish", prices: ["9.99", "12.99"] },
          { name: "Shrimp", prices: ["9.99", "12.99"] },
          { name: "Philly Cheese", prices: ["13.29", "16.29"] },
          { name: "Chicken Philly", prices: ["13.29", "16.29"] },
          { name: "B.B.Q. Pork with Slaw", prices: ["9.99", "12.99"] },
        ],
      },
      {
        id: "salads",
        title: "Fresh Salads",
        note: "Served with ranch, blue cheese, Italian, thousand island or honey mustard.",
        items: [
          { name: "Side Salad", prices: ["3.99"] },
          { name: "Garden Salad", prices: ["6.69"] },
          { name: "Burnie's Salad", prices: ["10.99"] },
          { name: "Grilled Chicken Salad", prices: ["9.99"] },
          { name: "Buffalo Shrimp Salad", prices: ["9.99"] },
          { name: "Catfish Salad", prices: ["9.99"] },
        ],
      },
    ],
  },

  {
    group: "Meal Deals",
    categories: [
      {
        id: "kids",
        title: "Kids Meal",
        note: "Under 12. Comes with small fries and a small drink.",
        items: [
          { name: "5 pc. Boneless Wings", prices: ["6.99"] },
          { name: "2 pc. Chicken Strips", prices: ["6.99"] },
          { name: "6 pc. Chicken Nuggets", prices: ["5.99"] },
          { name: "1 pc. Corn Dog", prices: ["5.89"] },
        ],
      },
      {
        id: "family",
        title: "Family Meal Deals",
        items: [
          {
            name: "Family Meal",
            prices: ["43.99"],
            description: "10 wings, 10 tenders, 2 large fries and a 2-liter soda",
          },
          {
            name: "Wings and Shrimp Deal",
            prices: ["60.99"],
            description: "30 wings, 15 shrimp, 2 large fries and a 2-liter soda",
          },
          {
            name: "Catfish Family Meal",
            prices: ["40.99"],
            description:
              "12 catfish filets, 12 hushpuppies, 1 large fries and a 2-liter soda",
          },
          {
            name: "Super Deal",
            prices: ["86.99"],
            description: "40 wings, 15 tenders, 2 large fries and a 2-liter soda",
          },
        ],
      },
    ],
  },

  {
    group: "Hibachi & Chinese",
    categories: [
      {
        id: "hibachi",
        title: "Hibachi Entrees",
        note: "With fried rice, zucchini, onion and broccoli. Ask for yummy sauce for the fried rice.",
        items: [
          {
            name: "Vegetable",
            prices: ["10.59"],
            description: "Zucchini, onion and broccoli",
          },
          { name: "Chicken", prices: ["11.59"] },
          { name: "Beef (Yakiniku)", prices: ["12.89"] },
          { name: "Shrimp", prices: ["12.89"] },
          { name: "Chicken & Shrimp", prices: ["13.99"] },
          { name: "Chicken & Beef (Yakiniku)", prices: ["14.39"] },
          { name: "Shrimp & Beef (Yakiniku)", prices: ["14.99"] },
          {
            name: "House Special Hibachi",
            prices: ["17.69"],
            description: "Chicken, beef and shrimp",
          },
        ],
      },
      {
        id: "friedrice",
        title: "Fried Rice",
        note: "With egg, yummy sauce on the side. Does not include vegetables.",
        priceColumns: ["Small", "Large"],
        items: [
          { name: "Fried Rice", prices: ["4.49", "7.69"] },
          { name: "Vegetable Fried Rice", prices: ["6.89", "11.09"] },
          { name: "Chicken Fried Rice", prices: ["6.89", "11.09"] },
          { name: "Beef Fried Rice", prices: ["7.59", "12.79"] },
          { name: "Shrimp Fried Rice", prices: ["7.59", "12.79"] },
          {
            name: "House Special Fried Rice",
            prices: ["8.99", "14.59"],
            description: "Chicken, beef and shrimp",
          },
        ],
      },
      {
        id: "lomein",
        title: "Lo Mein",
        note: "Does not include vegetables.",
        priceColumns: ["Small", "Large"],
        items: [
          { name: "Lo Mein", prices: ["5.79", "9.09"] },
          { name: "Vegetable Lo Mein", prices: ["7.79", "12.79"] },
          { name: "Chicken Lo Mein", prices: ["7.79", "12.79"] },
          { name: "Beef Lo Mein", prices: ["8.29", "13.59"] },
          { name: "Shrimp Lo Mein", prices: ["8.29", "13.59"] },
          {
            name: "House Special Lo Mein",
            prices: ["9.59", "15.29"],
            description: "Chicken, beef and shrimp",
          },
        ],
      },
      {
        id: "tso",
        title: "General Tso's & Sesame",
        note: "With fried rice or white rice.",
        priceColumns: ["Small", "Large"],
        items: [
          { name: "General Tso's Chicken", prices: ["10.29", "14.89"], heat: 1 },
          { name: "Sesame Chicken", prices: ["10.29", "14.89"] },
        ],
      },
      {
        id: "sweetsour",
        title: "Sweet & Sour Chicken",
        note: "With fried rice or white rice.",
        items: [{ name: "Sweet & Sour Chicken", prices: ["14.09"] }],
      },
      {
        id: "sideorders",
        title: "Side Orders",
        items: [
          { name: "Vegetable", prices: ["6.65"] },
          { name: "Chicken", prices: ["6.19"] },
          { name: "Beef", prices: ["7.09"] },
          { name: "Shrimp", prices: ["7.09"] },
          { name: "Edamame (Soy Bean)", prices: ["5.29"] },
          { name: "Crab Rangoon (6 pcs)", prices: ["6.79"] },
          { name: "Fried Dumpling (8 pcs)", prices: ["6.19"] },
          { name: "Egg Roll (Pork) (1 pc)", prices: ["2.09"] },
          { name: "Egg Roll (Pork) (3 pcs)", prices: ["5.79"] },
          { name: "Spring Roll (Vegetable) (3 pcs)", prices: ["4.09"] },
          { name: "Spring Roll (Vegetable) (6 pcs)", prices: ["7.09"] },
          { name: "Yummy Sauce (1 pint)", prices: ["4.09"] },
          { name: "Yummy Sauce (1 quart)", prices: ["7.09"] },
        ],
      },
    ],
  },

  {
    group: "Sweets & Drinks",
    categories: [
      {
        id: "desserts",
        title: "Desserts",
        items: [
          { name: "Funnel Cake", prices: ["3.19"] },
          {
            name: "Cheesecake",
            prices: ["3.79"],
            description: "With strawberry topping",
          },
          { name: "Chocolate Brownie Bites", prices: ["4.69"] },
          {
            name: "Fried Cheesecake",
            prices: ["5.99"],
            description: "With strawberry topping",
          },
        ],
      },
      {
        id: "drinks",
        title: "Beverages",
        items: [
          { name: "Soda or Tea (20 oz)", prices: ["2.19"] },
          { name: "Soda or Tea (32 oz)", prices: ["2.99"] },
          { name: "Bottled Drink", prices: ["2.25"] },
          { name: "Bottled Water", prices: ["1.25"] },
        ],
      },
    ],
  },
];

export default menu;
