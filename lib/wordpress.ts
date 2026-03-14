// Datos locales para reemplazar WordPress

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: {
    url: string;
    alt: string;
  };
  categories: number[];
}

export interface Category {
  id: number;
  category_name: string;
  slug: string;
  products: Product[];
}

export interface Restaurant {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  featured_media_url?: string;
  acf: {
    primary_color?: string;
    phone?: string;
    address?: string;
    whatsapp?: string;
  };
  menu_categories?: Category[];
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    slug: "elysrestobar",
    title: { rendered: "Elys Restobar" },
    featured_media_url: "/logoelys.png",
    acf: {
      primary_color: "#FF6B35",
      phone: "+54 3755 246464",
      address: "Av. Libertad 123, Posadas",
      whatsapp: "+54 3755 246464"
    },
    menu_categories: [
      {
        id: 101,
        category_name: "Entradas",
        slug: "entradas",
        products: [
          {
            id: 1,
            name: "Papas Bravas",
            description: "Papas crocantes con salsa picante y alioli.",
            price: "4500",
            image: { url: "/menu/papasbravaspic.jpg", alt: "Papas bravas" },
            categories: [101]
          },
          {
            id: 2,
            name: "Rabas",
            description: "Rabas doradas con limon y salsa tartara.",
            price: "8200",
            image: { url: "/menu/rabas.jpg", alt: "Rabas" },
            categories: [101]
          }
        ]
      },
      {
        id: 102,
        category_name: "Hamburguesas",
        slug: "hamburguesas",
        products: [
          {
            id: 3,
            name: "Cheeseburger",
            description: "Carne 160g, cheddar, pepinillos y salsa de la casa.",
            price: "9000",
            image: { url: "/menu/cheesebur.jpeg", alt: "Cheeseburger" },
            categories: [102]
          },
          {
            id: 4,
            name: "Crispy Onion",
            description: "Carne 160g, cheddar, cebolla crispy y BBQ.",
            price: "9800",
            image: { url: "/menu/crispyonion.jpeg", alt: "Crispy Onion" },
            categories: [102]
          }
        ]
      },
      {
        id: 103,
        category_name: "Pizzas",
        slug: "pizzas",
        products: [
          {
            id: 5,
            name: "Muzzarella",
            description: "Muzzarella clasica con tomate y oregano.",
            price: "11000",
            image: { url: "/menu/muzzas.jpg", alt: "Pizza muzzarella" },
            categories: [103]
          },
          {
            id: 6,
            name: "Especial",
            description: "Jamon, morron y aceitunas.",
            price: "12500",
            image: { url: "/menu/pizzaesp.jpg", alt: "Pizza especial" },
            categories: [103]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "pizzeria-don-pepe",
    title: { rendered: "Pizzeria Don Pepe" },
    featured_media_url: "/promo3.png",
    acf: {
      primary_color: "#D7263D",
      phone: "+54 3755 111222",
      address: "Av. Mitre 456, Posadas",
      whatsapp: "+54 3755 111222"
    },
    menu_categories: [
      {
        id: 201,
        category_name: "Pizzetas",
        slug: "pizzetas",
        products: [
          {
            id: 7,
            name: "Pizzeta Napolitana",
            description: "Tomate, ajo, perejil y muzzarella.",
            price: "7200",
            image: { url: "/menu/pizzetas.png", alt: "Pizzeta napolitana" },
            categories: [201]
          },
          {
            id: 8,
            name: "Pizzeta Huevo",
            description: "Muzzarella, huevo, jamon y oregano.",
            price: "7600",
            image: { url: "/menu/pizzahue.jpg", alt: "Pizzeta huevo" },
            categories: [201]
          }
        ]
      },
      {
        id: 202,
        category_name: "Empanadas",
        slug: "empanadas",
        products: [
          {
            id: 9,
            name: "Empanadas Criollas",
            description: "Carne cortada a cuchillo, cebolla y especias.",
            price: "1500",
            image: { url: "/menu/empanadas.jpg", alt: "Empanadas criollas" },
            categories: [202]
          },
          {
            id: 10,
            name: "Empanada de Jamon y Queso",
            description: "Jamon cocido, muzzarella y toque de oregano.",
            price: "1500",
            image: { url: "/menu/empanada.JPG", alt: "Empanada de jamón y queso" },
            categories: [202]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    slug: "cafe-central",
    title: { rendered: "Cafe Central" },
    featured_media_url: "/promo1.png",
    acf: {
      primary_color: "#2E86AB",
      phone: "+54 3755 333444",
      address: "San Martín 789, Posadas",
      whatsapp: "+54 3755 333444"
    },
    menu_categories: [
      {
        id: 301,
        category_name: "Desayunos",
        slug: "desayunos",
        products: [
          {
            id: 11,
            name: "Cafe con Leche",
            description: "Cafe suave con leche espumada.",
            price: "2200",
            image: { url: "/menu/entr.jpg", alt: "Café con leche" },
            categories: [301]
          },
          {
            id: 12,
            name: "Medialunas",
            description: "Medialunas de manteca recien horneadas.",
            price: "1800",
            image: { url: "/menu/m.jpg", alt: "Medialunas" },
            categories: [301]
          }
        ]
      },
      {
        id: 302,
        category_name: "Sandwiches",
        slug: "sandwiches",
        products: [
          {
            id: 13,
            name: "Sandwich de Pollo",
            description: "Pollo grillado, tomate y mayonesa casera.",
            price: "6500",
            image: { url: "/menu/pechu.png", alt: "Sándwich de pollo" },
            categories: [302]
          },
          {
            id: 14,
            name: "Lomo Completo",
            description: "Lomo, lechuga, tomate, huevo y papas.",
            price: "9800",
            image: { url: "/menu/lomopapa.jpeg", alt: "Lomo completo" },
            categories: [302]
          }
        ]
      }
    ]
  }
];

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const normalized = slug.trim().toLowerCase();
  const restaurant = restaurants.find((r) => r.slug.toLowerCase() === normalized);
  return restaurant ?? null;
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  return restaurants;
}
