import type { Product } from "@/app/[locale]/dashboard/comptoir/page" 
export const categories = {
  Electronics: {
    subcategories: ["Audio", "Computers", "Accessories", "Gaming", "Smart Home"],
  },
  Beverages: {
    subcategories: ["Tea", "Coffee", "Juice", "Soft Drinks", "Energy Drinks"],
  },
  Sports: {
    subcategories: ["Fitness", "Yoga", "Running", "Cycling", "Swimming"],
  },
  Stationery: {
    subcategories: ["Notebooks", "Pens", "Art Supplies", "Office", "School"],
  },
  Clothing: {
    subcategories: ["Men", "Women", "Kids", "Accessories", "Shoes"],
  },
  Home: {
    subcategories: ["Kitchen", "Bedroom", "Bathroom", "Living Room", "Decor"],
  },
  Beauty: {
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrance", "Tools"],
  },
  Food: {
    subcategories: ["Snacks", "Canned", "Frozen", "Bakery", "Organic"],
  },
}

export const mockProducts: Product[] = [
  // Electronics - Audio
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    barcode: "BAR001",
    category: "Electronics",
    subcategory: "Audio",
    stock: 45,
    image: "/wireless-headphones.png",
  },
  // Beverages - Tea
  {
    id: "2",
    name: "Organic Green Tea - 100 Bags",
    price: 12.99,
    barcode: "BAR002",
    category: "Beverages",
    subcategory: "Tea",
    stock: 120,
    image: "/green-tea-box.png",
  },
  // Sports - Yoga
  {
    id: "3",
    name: "Premium Yoga Mat",
    price: 34.99,
    barcode: "BAR003",
    category: "Sports",
    subcategory: "Yoga",
    stock: 67,
    image: "/rolled-yoga-mat.png",
  },
  // Sports - Fitness
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    barcode: "BAR004",
    category: "Sports",
    subcategory: "Fitness",
    stock: 89,
    image: "/reusable-water-bottle.png",
  },
  // Electronics - Accessories
  {
    id: "5",
    name: "USB-C Fast Charging Cable",
    price: 15.99,
    barcode: "BAR005",
    category: "Electronics",
    subcategory: "Accessories",
    stock: 156,
    image: "/usb-cable.png",
  },
  // Beverages - Coffee
  {
    id: "6",
    name: "Organic Coffee Beans - 1lb",
    price: 18.99,
    barcode: "BAR006",
    category: "Beverages",
    subcategory: "Coffee",
    stock: 78,
    image: "/pile-of-coffee-beans.png",
  },
  // Electronics - Computers
  {
    id: "7",
    name: "Wireless Computer Mouse",
    price: 29.99,
    barcode: "BAR007",
    category: "Electronics",
    subcategory: "Computers",
    stock: 92,
    image: "/computer-mouse.png",
  },
  // Stationery - Notebooks
  {
    id: "8",
    name: "Notebook Set - 3 Pack",
    price: 9.99,
    barcode: "BAR008",
    category: "Stationery",
    subcategory: "Notebooks",
    stock: 145,
    image: "/assorted-notebooks.png",
  },
  // Electronics - Smart Home
  {
    id: "9",
    name: "LED Desk Lamp",
    price: 42.99,
    barcode: "BAR009",
    category: "Electronics",
    subcategory: "Smart Home",
    stock: 34,
    image: "/modern-desk-lamp.png",
  },
  // Sports - Fitness
  {
    id: "10",
    name: "Protein Powder - Chocolate",
    price: 39.99,
    barcode: "BAR010",
    category: "Sports",
    subcategory: "Fitness",
    stock: 56,
    image: "/protein-powder.jpg",
  },
  // Electronics - Computers
  {
    id: "11",
    name: "Mechanical Keyboard",
    price: 89.99,
    barcode: "BAR011",
    category: "Electronics",
    subcategory: "Computers",
    stock: 28,
    image: "/mechanical-keyboard.png",
  },
  // Beverages - Tea
  {
    id: "12",
    name: "Herbal Tea Variety Pack",
    price: 16.99,
    barcode: "BAR012",
    category: "Beverages",
    subcategory: "Tea",
    stock: 103,
    image: "/tea-variety-pack.jpg",
  },
  // Clothing - Men
  {
    id: "13",
    name: "Cotton T-Shirt - Black",
    price: 19.99,
    barcode: "BAR013",
    category: "Clothing",
    subcategory: "Men",
    stock: 200,
  },
  // Home - Kitchen
  {
    id: "14",
    name: "Stainless Steel Cookware Set",
    price: 129.99,
    barcode: "BAR014",
    category: "Home",
    subcategory: "Kitchen",
    stock: 25,
  },
  // Beauty - Skincare
  {
    id: "15",
    name: "Moisturizing Face Cream",
    price: 34.99,
    barcode: "BAR015",
    category: "Beauty",
    subcategory: "Skincare",
    stock: 67,
  },
  // Food - Snacks
  {
    id: "16",
    name: "Mixed Nuts - 500g",
    price: 12.99,
    barcode: "BAR016",
    category: "Food",
    subcategory: "Snacks",
    stock: 150,
  },
]
