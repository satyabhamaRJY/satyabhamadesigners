export interface Product {
  id: string;
  name: string;
  category: string; // e.g., 'readymade-salwar-suits', 'sarees'
  price: number;
  compareAtPrice?: number;
  images: string[];
  fabric: string;
  color: string;
  work: string;
  occasion: string;
  rating: number;
  reviews: number;
  isBestseller?: boolean;
}

export const catalog: Product[] = [
  {
    id: "rss-001",
    name: "Midnight Blue Georgette Zardosi Suit",
    category: "readymade-salwar-suits",
    price: 189,
    compareAtPrice: 249,
    images: [
      "/premium-hero.png",
      "/clean-bg.jpg"
    ],
    fabric: "Georgette",
    color: "Blue",
    work: "Zardosi",
    occasion: "Party Wear",
    rating: 4.8,
    reviews: 24,
    isBestseller: true
  },
  {
    id: "rss-002",
    name: "Ruby Red Silk Bridal Salwar",
    category: "readymade-salwar-suits",
    price: 350,
    compareAtPrice: 400,
    images: [
      "/clean-bg.jpg",
      "/img1.png"
    ],
    fabric: "Silk",
    color: "Red",
    work: "Gota Patti",
    occasion: "Bridal",
    rating: 5.0,
    reviews: 12,
  },
  {
    id: "rss-003",
    name: "Emerald Chiffon Festive Suit",
    category: "readymade-salwar-suits",
    price: 120,
    images: [
      "/img1.png",
      "/premium-hero.png"
    ],
    fabric: "Chiffon",
    color: "Green",
    work: "Thread Work",
    occasion: "Festive",
    rating: 4.5,
    reviews: 8
  },
  {
    id: "rss-004",
    name: "Golden Organza Sharara Set",
    category: "readymade-salwar-suits",
    price: 210,
    compareAtPrice: 280,
    images: [
      "/premium-hero.png",
      "/img1.png"
    ],
    fabric: "Organza",
    color: "Gold",
    work: "Sequins",
    occasion: "Haldi",
    rating: 4.9,
    reviews: 45,
    isBestseller: true
  },
  {
    id: "rss-005",
    name: "Blush Pink Net Sangeet Suit",
    category: "readymade-salwar-suits",
    price: 165,
    compareAtPrice: 199,
    images: [
      "/clean-bg.jpg",
      "/premium-hero.png"
    ],
    fabric: "Net",
    color: "Pink",
    work: "Mirror Work",
    occasion: "Sangeet",
    rating: 4.2,
    reviews: 18
  },
  {
    id: "rss-006",
    name: "Classic Black Velvet Suit",
    category: "readymade-salwar-suits",
    price: 280,
    images: [
      "/img1.png",
      "/clean-bg.jpg"
    ],
    fabric: "Velvet",
    color: "Black",
    work: "Stonework",
    occasion: "Reception",
    rating: 4.7,
    reviews: 31
  }
];

export const getFilters = (category: string) => {
  const products = catalog.filter(p => p.category === category);
  
  return {
    fabrics: Array.from(new Set(products.map(p => p.fabric))),
    colors: Array.from(new Set(products.map(p => p.color))),
    works: Array.from(new Set(products.map(p => p.work))),
    occasions: Array.from(new Set(products.map(p => p.occasion))),
  };
};
