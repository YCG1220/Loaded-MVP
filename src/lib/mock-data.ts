import { Category, MenuItem, ModifierGroup } from "../types/menu";

export const categories: Category[] = [
  { id: "fries", name: "Loaded Fries", description: "Signature fry builds", sortOrder: 1 },
  { id: "sandwiches", name: "Stacks & Sandwiches", description: "Smashed, sauced, stacked", sortOrder: 2 },
  { id: "shakes", name: "ThickShakes", description: "Hand-spun shakes", sortOrder: 3 },
  { id: "sides", name: "Sides", description: "Wings, tots, rings", sortOrder: 4 },
];

const fryToppings: ModifierGroup = {
  id: "fry-toppings",
  name: "Top it off",
  minSelect: 0,
  maxSelect: 3,
  isRequired: false,
  options: [
    { id: "bacon", name: "Candied Bacon", priceDelta: 1.5, calories: 120, grams: 28 },
    { id: "onion", name: "Crispy Onions", priceDelta: 0.75, calories: 60, grams: 18 },
    { id: "jalapeno", name: "Pickled Jalapeños", priceDelta: 0.5, calories: 10, grams: 12 },
  ],
};

const proteinChoice: ModifierGroup = {
  id: "protein",
  name: "Choose your protein",
  minSelect: 1,
  maxSelect: 1,
  isRequired: true,
  options: [
    { id: "beef", name: "Double smashed beef", priceDelta: 0, calories: 520, grams: 170, isDefault: true },
    { id: "chicken", name: "Crispy chicken", priceDelta: 0, calories: 430, grams: 160 },
    { id: "plant", name: "Impossible patty", priceDelta: 1, calories: 410, grams: 150 },
  ],
};

export const menuItems: MenuItem[] = [
  {
    id: "truffle-fries",
    name: "Truffle Freak Fries",
    description: "Black truffle aioli, parmesan snow, scallion crunch",
    price: 9.5,
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    calories: 780,
    categoryId: "fries",
    modifierGroups: [fryToppings],
  },
  {
    id: "buffalo-fries",
    name: "Buffalo Street Fries",
    description: "Buffalo queso, blue cheese crumble, celery slaw",
    price: 8.75,
    imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
    calories: 720,
    categoryId: "fries",
    modifierGroups: [fryToppings],
  },
  {
    id: "freak-burger",
    name: "Freak Flag Burger",
    description: "Double smashed beef, fry sauce, charred onions",
    price: 11.5,
    imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b",
    calories: 980,
    categoryId: "sandwiches",
    modifierGroups: [proteinChoice],
  },
  {
    id: "shake",
    name: "Loaded Chocolate ThickShake",
    description: "12oz hand-spun shake with fudge swirl",
    price: 5.5,
    imageUrl: "https://images.unsplash.com/photo-1580915411954-282cb1c789c2",
    calories: 520,
    categoryId: "shakes",
  },
];
