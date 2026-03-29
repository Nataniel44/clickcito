// menuBebidas.jsx
export const menuBebidas = {
  sinAlcohol: [
    {
      name: "Agua Mineral 500cc",
      price: 2000,
      image: "/menu/bebidas/aguabotella.jpeg",
      options: [
        { portion: "Con gas", price: 2000 },
        { portion: "Sin gas", price: 2000 },
      ],
    },
    {
      name: "Agua Mineral 1.5L",
      price: 4500,
      image: "/menu/bebidas/aguabotella.jpeg",
      options: [
        { portion: "Con gas", price: 4500 },
        { portion: "Sin gas", price: 4500 },
      ],
    },
    { name: "Aquarius 1.5L", price: 4500, image: "/menu/bebidas/aqua.webp" },
    { name: "Cepita 1.5L", price: 5500, image: "/menu/bebidas/cepita1.png" },
    {
      name: "Gaseosa 500cc",
      price: 3500,
      image: "/menu/bebidas/botellachicoca.webp",
      options: [
        { portion: "Coca Cola", price: 3500 },
        { portion: "Fanta", price: 3500 },
        { portion: "Sprite", price: 3500 },
        { portion: "Paso de los Toros", price: 3500 },
      ],
    },
    {
      name: "Gaseosa 1.5L",
      price: 6000,
      image: "/menu/bebidas/coca1l.jpg",
      options: [
        { portion: "Coca Cola", price: 6000 },
        { portion: "Fanta", price: 6000 },
        { portion: "Sprite", price: 6000 },
      ],
    },
    { name: "Red Bull (lata)", price: 4500, image: "/menu/bebidas/lata-red.jpg" },
    { name: "Speed (lata)", price: 4000, image: "/menu/bebidas/speedlata.jpg" },
    { name: "Jugo de Naranja", price: 3000, image: "/placeholder.png" },
    { name: "Licuados (Frutilla/Durazno/Ananá/Frutos Rojos)", price: 3500, image: "/placeholder.png" },
  ],

  cervezaArtesanal: [
    { name: "Media Pinta", price: 3000, image: "/menu/bebidas/pinta.jpg" },
    { name: "Pinta", price: 4500, image: "/menu/bebidas/pinta.jpg" },
    { name: "Jarra 1.5L", price: 9500, image: "/menu/bebidas/jarra.png" },
  ],

  porrones: [
    { name: "Heineken 330cc", price: 4500, image: "/menu/bebidas/heinekchica.png" },
    { name: "Corona 330cc", price: 4500, image: "/menu/bebidas/coronachi.jpg" },
  ],

  botellas: [
    { name: "Budweiser 1L", price: 5500, image: "/menu/bebidas/nud.jpg" },
    { name: "Brahma 1L", price: 5500, image: "/menu/bebidas/brahamal.webp" },
    { name: "Imperial 1L", price: 6000, image: "/menu/bebidas/golden.webp" },
    { name: "Stella Artois 1L", price: 8500, image: "/menu/bebidas/artois.webp" },
    { name: "Heineken 1L", price: 8500, image: "/menu/bebidas/heineken1l.webp" },
    { name: "Patagonia 730cc", price: 8500, image: "/menu/bebidas/patag.webp" },
    { name: "Corona 710cc", price: 7000, image: "/menu/bebidas/coronacer.webp" },
  ],

  vinos: [
    {
      tipo: "blancos",
      items: [
        { name: "Prófugo Chenin Dulce", price: 11000, image: "/menu/bebidas/chenindulce.jpeg" },
        { name: "Dilema Blanco Dulce", price: 6500, image: "/menu/bebidas/Vino-Dilema-Dulce-Blanco.webp" },
        { name: "Santa Julia Chenin Dulce", price: 12500, image: "/menu/bebidas/santajuliachenindulce.jpeg" },
        { name: "Lola Monetes Dulce Terroir", price: 7500, image: "/menu/bebidas/lolamontess.png" },
        { name: "flia. Gascon Dulce Cosecha", price: 8500, image: "/menu/bebidas/gaconblancodulce.jpeg" },
        { name: "Altos Del Plata chardononnay", price: 12500, image: "/menu/bebidas/altosmal.jpeg" },
        { name: "Casillero Del Diablo chardononnay", price: 14000, image: "/menu/bebidas/casillero.webp" },
        { name: "Trumpeter (consultar variedades)", price: 16500, image: "/menu/bebidas/Trumpeter-Malbec.webp" },
      ],
    },
    {
      tipo: "tintos",
      items: [
        { name: "Lola Montes (Malbec)", price: 6500, image: "/menu/bebidas/lolamontess.png" },
        { name: "Santa Julia Tinto Dulce Natural", price: 12500, image: "/menu/bebidas/santajulia.jpg" },
        { name: "Cordero con Piel de Lobo (Malbec)", price: 7500, image: "/menu/bebidas/pieldelobo.jpeg" },
        { name: "flia. Gascon", price: 10000, image: "/menu/bebidas/gacon.webp" },
        { name: "Altos Del Plata (Malbec)", price: 15000, image: "/menu/bebidas/altosmal.jpeg" },
        { name: "Trumpeter (Malbec)", price: 16500, image: "/menu/bebidas/Trumpeter-Malbec.webp" },
        { name: "Saint Felicien (Malbec)", price: 18000, image: "/menu/bebidas/saint.jpeg" },
        { name: "Nicasia Red Blend (Malbec)", price: 20500, image: "/menu/bebidas/nicasia.jpg" },
        { name: "Luigi Bosca Insignia (Malbec)", price: 23000, image: "/menu/bebidas/luigi.jpg" },
        { name: "Terrazas de los Andes Reserva", price: 23500, image: "/menu/bebidas/terrazas.jpg" },
        { name: "Angélica Zapata (Malbec)", price: 44500, image: "/menu/bebidas/angelica.jpg" },
        { name: "Rutini (Malbec)", price: 50500, image: "/menu/bebidas/rutini.webp" },
      ],
    },
    {
      tipo: "espumantes",
      items: [
        { name: "Mercier", price: 15500, image: "/menu/bebidas/mercier.png" },
        { name: "Sidra 1888 Saenz Briones", price: 12500, image: "/menu/bebidas/1888.jpg" },
        { name: "Chandon Extra Brut", price: 30500, image: "/menu/bebidas/chandon.jpeg" },
        { name: "Baron B. Extra Brut", price: 50500, image: "/menu/bebidas/baronb.webp" },
      ],
    },
  ],
};
