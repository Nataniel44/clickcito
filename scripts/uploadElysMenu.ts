import * as admin from 'firebase-admin';
import * as fs from 'fs';

try {
    const serviceAccountPath = './serviceAccountKey.json';
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (error) {
    console.error("Error al inicializar Firebase Admin:", error);
    process.exit(1);
}

const db = admin.firestore();

// ========================
// 1. DATA (Extracted from JSX files)
// ========================

const menuComidas = {
    entradas: [
        {
            subcategoria: "Papas", items: [
                { name: "Clásicas o Rústicas", image: "/menu/pacl.png", price: 9000 },
                { name: "Gratinadas con queso", options: [{ portion: "Cheddar", price: 10000 }, { portion: "Muzzarella", price: 10000 }], image: "/menu/papgratinque.jpg", price: 10000 },
                { name: "Panceta, cheddar y verdeo", image: "/menu/papaschedarverd.jpg", price: 11000 },
                { name: "Bravas (picantes)", image: "/menu/papasbravaspic.jpg", price: 10000 }
            ]
        },
        {
            subcategoria: "Otros", items: [
                { name: "Mandiocas fritas", image: "/menu/man.png", price: 9000 },
                { name: "Tequeños con dip", image: "/menu/taque.jpg", price: 11500 },
                { name: "Rabas con aderezo", image: "/menu/rabas.jpg", price: 17000 },
                { name: "Camarones crujientes", image: "/menu/camacru.jpg", price: 22000 },
                { name: "Mozzarella sticks", image: "/menu/fing.png", price: 11500 },
                { name: "Chicken fingers con dip", image: "/menu/muzzas.jpg", price: 12000 },
                { name: "Provoleta a la Napolitana", image: "/menu/prov.jpg", price: 13000 }
            ]
        }
    ],
    especialidades: [
        { name: "Picaña", image: "/menu/pic.jpg", options: [{ portion: "Para 2 personas", price: 25500 }, { portion: "Para 4 personas", price: 43000 }], guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"] },
        { name: "Entraña", image: "/menu/entr.jpg", options: [{ portion: "Para 2 personas", price: 25500 }, { portion: "Para 4 personas", price: 43000 }], guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"] },
        { name: "Lomo", image: "/menu/pic.jpg", options: [{ portion: "Para 2 personas", price: 25500 }, { portion: "Para 4 personas", price: 43000 }], guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"] },
        { name: "T-Bone", image: "/menu/tbone.jpg", options: [{ portion: "Para 2 personas", price: 25500 }, { portion: "Para 4 personas", price: 43000 }], guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"] },
        { name: "Bife de Chorizo", image: "/menu/bif.jpeg", options: [{ portion: "Para 2 personas", price: 25500 }, { portion: "Para 4 personas", price: 43000 }], guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"] }
    ],
    ensaladas: [
        { name: "Completa", image: "/menu/compl.png", desc: "Zanahoria, Tomate, Huevo Duro, Choclo", price: 11000 },
        { name: "Mixta", image: "/menu/mix.png", desc: "Lechuga, Tomate y Cebolla", price: 9000 },
        { name: "Especial", image: "/menu/esp.png", desc: "Rúcula, Cherrys y Parmesano", price: 10500 },
        { name: "César", image: "/menu/cesar.jpg", desc: "Hojas verdes, Croutons, Pollo crujiente, Parmesano", price: 12000 }
    ],
    paraCompartir: [
        { name: "Tabla de Milanesas (4u.)", image: "/menu/m.jpg", desc: "Napolitana, Mozza con jamón, Mozza huevo y panceta, Suiza", price: 34000 },
        { name: "Tabla de Pizzetas (8u.)", image: "/menu/pizzetas.png", price: 14000, desc: "2 Napolitana, 2 Mozza con Jamón, 2 Fugazzetas, 2 Jamón y huevo" },
        { name: "Picada", image: "/menu/pica.jpg", desc: "Jamón Cocido, Queso, Salame, Jamón Crudo, Aceitunas, Milanesitas, Bastones de Mozza, Papas, Sopa paraguaya", options: [{ portion: "Para 2 personas", price: 22000 }, { portion: "Para 4 personas", price: 36500 }] }
    ],
    alPlato: [
        { name: "Lomo / Milanesa a la Napo con papas fritas", image: "/menu/milanapo.png", options: [{ portion: "Lomo", price: 17500 }, { portion: "Milanesa", price: 17500 }], price: 17500 },
        { name: "Pechuga al verdeo o mostaza con puré de papas", image: "/menu/pollo.png", options: [{ portion: "Verdeo", price: 15500 }, { portion: "Mostaza", price: 15500 }], price: 15500 },
        { name: "Lomo a las finas hierbas con papas noisette", image: "/menu/lom.png", price: 17500 },
        { name: "Mila a caballo en colchón con papas pay", image: "/menu/milapay.png", price: 17500 },
        { name: "Pacu teko al roquefort con papas noisette", image: "/menu/paku.png", price: 18000 },
        { name: "Sorrentinos de jamón y queso", image: "/menu/sorre.jpg", price: 16000, salsas: ["Bolognesa", "Scarparo", "4 Quesos", "Parisienne"] },
        { name: "Ravioles de ricota y verduras", image: "/menu/raviolesrico.jpg", price: 16000, salsas: ["Bolognesa", "Scarparo", "4 Quesos", "Parisienne"] },
        { name: "Tallarines al huevo", image: "/menu/tallahue.jpg", price: 14500, salsas: ["Bolognesa", "Scarparo", "4 Quesos", "Parisienne"] }
    ],
    pizzas: [
        { name: "Mozzarella", desc: "Salsa, Mozza, Aceitunas verdes, Orégano", price: 12000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Fugazzeta", desc: "Mozza, Cebolla, Aceitunas negras, Orégano, Oliva", price: 14000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Napolitana", desc: "Salsa, Mozza, Tomate en rodajas, Orégano", price: 15000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Especial", desc: "Salsa, Mozza, Jamón, Huevo duro, Tomate, Aceitunas verdes", imagen: "/menu/pizzaesp.jpg", price: 17000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Napo con Jamón", desc: "Salsa, Mozza, Jamón, Tomate, Orégano", price: 16000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Jamón y Morrones", desc: "Salsa, Mozza, Jamón, Morrones, Aceitunas verdes", price: 15000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "4 Quesos", desc: "Mozza, Queso azul, Parmesano, Provolone", price: 17000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Americana", desc: "Salsa, Mozza, Huevo frito, Panceta", imagen: "/menu/pizzhue.jpg", price: 20000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Anchoas", desc: "Salsa, Mozza, Anchoas, Aceitunas negras", price: 17000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Calabresa / Pepperoni", desc: "Salsa, Mozza, Longaniza, Aceitunas", price: 17000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Palmitos", desc: "Salsa, Mozza, Jamón, Salsa golf, Palmitos, Aceitunas", price: 18000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Tropical", desc: "Salsa, Mozza, Jamón, Ananá, Aceitunas", price: 19000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Rúcula", desc: "Salsa, Mozza, Jamón crudo, Rúcula, Parmesano, Aceitunas negras", price: 20000, extras: [{ name: "Muzza extra", price: 800 }] },
        { name: "Humita", desc: "Salsa, Mozza, Choclo en salsa blanca", price: 18000, extras: [{ name: "Muzza extra", price: 800 }] }
    ],
    empanadas: {
        sabores: ["Carne", "Pollo", "Jamón y Queso", "Cebolla y Queso", "Caprese", "Panceta y Queso", "Napolitana", "Cheese Burger", "Verduras", "Humita"],
        precios: { unidad: 2000, docena: 24000 }
    },
    hamburguesas: [
        { name: "Completa Clásica", image: "/menu/cl.jpg", extras: [{ name: "Medallón extra", price: 2500 }], desc: "Pan Artesanal, Medallón, Lechuga, Tomate, Jamón, Queso y Huevo. Todas las hamburguesas van acompañadas con papas.", price: 11000 },
        { name: "Del Bar", image: "/menu/hamburgesa_debar.jpg", extras: [{ name: "Medallón extra", price: 2500 }], desc: "Pan Artesanal, Medallón, Lechuga, Tomate, Jamón, Huevo, Queso Cheddar, Panceta crocante, Cebolla Caramelizada. Todas las hamburguesas van acompañadas con papas.", price: 12000 },
        { name: "Cheese Burger", image: "/menu/cheesebur.jpeg", extras: [{ name: "Medallón extra", price: 2500 }], desc: "Pan Artesanal, Doble Medallón de Carne Smasheada, Doble Cheddar y Cebolla. Todas las hamburguesas van acompañadas con papas.", price: 10500 },
        { name: "Crispy Onion", image: "/menu/crispy.jpg", extras: [{ name: "Medallón extra", price: 2500 }], desc: "Pan Artesanal, Doble Medallón Smasheado, Panceta Crocante, Doble queso blanco, Cebolla crocante. Todas las hamburguesas van acompañadas con papas.", price: 11500 },
        { name: "Veggie", image: "/menu/hamburgesa_debar.jpg", extras: [{ name: "Medallón extra", price: 2500 }], desc: "Medallón, Tomate, Lechuga, Queso, Huevo. Consultar variedad disponible de medallón. Todas las hamburguesas van acompañadas con papas.", price: 10000 }
    ],
    sandwicheria: [
        { name: "Lomito Completo Clásico", image: "/menu/lomo.jpg", extras: [{ name: "Salsa de ajo", price: 0 }], desc: "Pan Artesanal, Bife de lomo, Lechuga, Tomate, Jamón, Queso, Huevo. Todos los sándwiches van acompañados con papas.", price: 12500 },
        { name: "Salteado Peruano", image: "/menu/saltpe.jpg", extras: [{ name: "Salsa de ajo", price: 0 }], desc: "Pan Artesanal, Lomo en tiras, Cebolla morada, Morrón amarillo, Perejil, Tomates en gajos, Salsa agridulce, Rúcula, Cebolla. Todos los sándwiches van acompañados con papas.", price: 14000 },
        { name: "Panini de Pollo", image: "/menu/san.jpg", extras: [{ name: "Salsa de ajo", price: 0 }], desc: "Suprema grillada, Salsa de Pesto, Mozza, Tomates cherrys, Lechuga repollada. Todos los sándwiches van acompañados con papas.", price: 12000 },
        { name: "Shawarma", image: "/menu/shaw.jpg", extras: [{ name: "Salsa de ajo", price: 0 }], options: [{ portion: "Lomo", price: 11500 }, { portion: "Pollo braseado", price: 11500 }], desc: "Pan pita, Lomo o pollo braseados, Cebolla en pluma, Bañar, Salsa de ajo, Tomates trozados, Gratinado de queso. Todos los sándwiches van acompañados con papas.", price: 11500 },
        { name: "Milanguche", image: "/menu/milan.jpg", extras: [{ name: "Salsa de ajo", price: 0 }], options: [{ portion: "Carne", price: 12500 }, { portion: "Pollo", price: 12500 }], desc: "Milanesas (carne o pollo), Pan artesanal, Queso, Huevo, Jamón, Tomate, Lechuga, Morrones asados. Todos los sándwiches van acompañados con papas.", price: 12500 }
    ]
};

const menuBebidas = {
    sinAlcohol: [
        { name: "Agua Mineral 500cc", price: 2000, image: "/menu/bebidas/aguabotella.jpeg", options: [{ portion: "Con gas", price: 2000 }, { portion: "Sin gas", price: 2000 }] },
        { name: "Agua Mineral 1.5L", price: 4500, image: "/menu/bebidas/aguabotella.jpeg", options: [{ portion: "Con gas", price: 4500 }, { portion: "Sin gas", price: 4500 }] },
        { name: "Aquarius 1.5L", price: 4500, image: "/menu/bebidas/aqua.webp" },
        { name: "Cepita 1.5L", price: 5500, image: "/menu/bebidas/cepita1.png" },
        { name: "Gaseosa 500cc", price: 3500, image: "/menu/bebidas/botellachicoca.webp", options: [{ portion: "Coca Cola", price: 3500 }, { portion: "Fanta", price: 3500 }, { portion: "Sprite", price: 3500 }, { portion: "Paso de los Toros", price: 3500 }] },
        { name: "Gaseosa 1.5L", price: 6000, image: "/menu/bebidas/coca1l.jpg", options: [{ portion: "Coca Cola", price: 6000 }, { portion: "Fanta", price: 6000 }, { portion: "Sprite", price: 6000 }] },
        { name: "Red Bull (lata)", price: 4500, image: "/menu/bebidas/lata-red.jpg" },
        { name: "Speed (lata)", price: 4000, image: "/menu/bebidas/speedlata.jpg" },
        { name: "Jugo de Naranja", price: 3000, image: "/placeholder.png" },
        { name: "Licuados (Frutilla/Durazno/Ananá/Frutos Rojos)", price: 3500, image: "/placeholder.png" }
    ],
    cervezaArtesanal: [
        { name: "Media Pinta", price: 3000, image: "/menu/bebidas/pinta.jpg" },
        { name: "Pinta", price: 4500, image: "/menu/bebidas/pinta.jpg" },
        { name: "Jarra 1.5L", price: 9500, image: "/menu/bebidas/jarra.png" }
    ],
    porrones: [
        { name: "Heineken 330cc", price: 4500, image: "/menu/bebidas/heinekchica.png" },
        { name: "Corona 330cc", price: 4500, image: "/menu/bebidas/coronachi.jpg" }
    ],
    botellas: [
        { name: "Budweiser 1L", price: 5500, image: "/menu/bebidas/nud.jpg" },
        { name: "Brahma 1L", price: 5500, image: "/menu/bebidas/brahamal.webp" },
        { name: "Imperial 1L", price: 6000, image: "/menu/bebidas/golden.webp" },
        { name: "Stella Artois 1L", price: 8500, image: "/menu/bebidas/artois.webp" },
        { name: "Heineken 1L", price: 8500, image: "/menu/bebidas/heineken1l.webp" },
        { name: "Patagonia 730cc", price: 8500, image: "/menu/bebidas/patag.webp" },
        { name: "Corona 710cc", price: 7000, image: "/menu/bebidas/coronacer.webp" }
    ],
    vinos: [
        {
            tipo: "blancos", items: [
                { name: "Prófugo Chenin Dulce", price: 11000, image: "/menu/bebidas/chenindulce.jpeg" },
                { name: "Dilema Blanco Dulce", price: 6500, image: "/menu/bebidas/Vino-Dilema-Dulce-Blanco.webp" },
                { name: "Santa Julia Chenin Dulce", price: 12500, image: "/menu/bebidas/santajuliachenindulce.jpeg" },
                { name: "Lola Monetes Dulce Terroir", price: 7500, image: "/menu/bebidas/lolamontess.png" },
                { name: "flia. Gascon Dulce Cosecha", price: 8500, image: "/menu/bebidas/gaconblancodulce.jpeg" },
                { name: "Altos Del Plata chardononnay", price: 12500, image: "/menu/bebidas/altosmal.jpeg" },
                { name: "Casillero Del Diablo chardononnay", price: 14000, image: "/menu/bebidas/casillero.webp" },
                { name: "Trumpeter (consultar variedades)", price: 16500, image: "/menu/bebidas/Trumpeter-Malbec.webp" }
            ]
        },
        {
            tipo: "tintos", items: [
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
                { name: "Rutini (Malbec)", price: 50500, image: "/menu/bebidas/rutini.webp" }
            ]
        },
        {
            tipo: "espumantes", items: [
                { name: "Mercier", price: 15500, image: "/menu/bebidas/mercier.png" },
                { name: "Sidra 1888 Saenz Briones", price: 12500, image: "/menu/bebidas/1888.jpg" },
                { name: "Chandon Extra Brut", price: 30500, image: "/menu/bebidas/chandon.jpeg" },
                { name: "Baron B. Extra Brut", price: 50500, image: "/menu/bebidas/baronb.webp" }
            ]
        }
    ]
};

const menuTragos = {
    sinAlcohol: [
        { name: "Jugo de Naranja", image: "/menu/bebidas/jugonaranja.jpeg", price: 3000 },
        { name: "Jugo de Limón", image: "/menu/bebidas/limonjugo.jpeg", price: 3000 },
        { name: "Licuado de Frutilla", image: "/menu/bebidas/frutilla.jpeg", price: 3500 },
        { name: "Licuado de Durazno", image: "/menu/bebidas/durazno.jpeg", price: 3500 },
        { name: "Licuado de Ananá", image: "/menu/bebidas/anana.jpeg", price: 3500 },
        { name: "Licuado de Frutos Rojos", image: "/menu/bebidas/frutosrojos.jpeg", price: 3500 }
    ],
    jarras: [
        { name: "Fernet Branca con Coca 1.5L", image: "/menu/bebidas/jarraferne.jpg", price: 8500 },
        { name: "Clericó (sidra o vino blanco)", image: "/menu/bebidas/clerico.webp", price: 11500 },
        { name: "Jugo de Naranja", image: "/menu/bebidas/jarranaranja.jpg", price: 6000 },
        { name: "Jugo de Limón", image: "/menu/bebidas/jaralimon.jpg", price: 6000 }
    ],
    shots: [
        { name: "Branca Shot", image: "/placeholder.png", price: 3000 },
        { name: "Tía María", image: "/menu/bebidas/shottiamaria.jpg", price: 3500 },
        { name: "Amarula", image: "/menu/bebidas/shotia.jpg", price: 6000 },
        { name: "Baileys (clásico o chocolate)", image: "/menu/bebidas/baileys.jpg", price: 5000 },
        { name: "Sheridan (licor doble crema y café)", image: "/menu/bebidas/sheridan.jpg", price: 7500 },
        { name: "Shot Tequila José Cuervo Dorado", image: "/menu/bebidas/josecuervo.jpg", price: 6000 },
        { name: "Shot Tequila José Cuervo Plateado", image: "/menu/bebidas/josecuervoesp.jpg", price: 6500 }
    ],
    whiskys: [
        { name: "Jim Beam", image: "/menu/bebidas/jimbean.jpg", price: 6500 },
        { name: "Jim Beam Honey", image: "/menu/bebidas/josecuervoesp.jpg", price: 6500 },
        { name: "Jack Daniels 7", image: "/menu/bebidas/jackdaniels.jpg", price: 9000 },
        { name: "Jack Daniels Honey", image: "/menu/bebidas/jackhoney.webp", price: 9000 },
        { name: "Chivas Regal 12", image: "/menu/bebidas/chivas12.jpeg", price: 9500 },
        { name: "Chivas Regal Extra 13", image: "/menu/bebidas/chivas13.jpg", price: 11000 },
        { name: "Chivas Regal 18", image: "/menu/bebidas/chivas18.webp", price: 21500 },
        { name: "Johnnie Walker Red Label", image: "/menu/bebidas/redlabel.jpeg", price: 4500 },
        { name: "Johnnie Walker Black Label", image: "/menu/bebidas/blacklabel.jpg", price: 8500 },
        { name: "Johnnie Walker Double Black Label", image: "/menu/bebidas/doubleblack.jpeg", price: 11000 }
    ],
    clasicos: [
        { name: "Branca Cola", image: "/menu/bebidas/fernecola.jpg", desc: "Fernet Branca 30%, Gaseosa Cola 70%, Hielo", price: 5500 },
        { name: "Blu Gin Tonic", image: "/menu/bebidas/gintonic.jpg", desc: "Spirito Blu 30%, Agua Tónica 70%", price: 6000 },
        { name: "Blu Berries Tonic", image: "/menu/bebidas/gintonicfrutos.jpg", desc: "Spirito Blu 30%, Agua Tónica 70%, Frutos Rojos", price: 6500 },
        { name: "Blue Tonic", image: "/menu/bebidas/bluetonic.jpg", desc: "Blue coracao, Gin Spirito Blu, Tónica", price: 6000 },
        { name: "Negroni", image: "/menu/bebidas/negroni.jpg", desc: "Spirito Blu 33%, Bitter Rojo 33%, Carpano Rosso 33%", price: 7500 },
        { name: "Aperelys", image: "/menu/bebidas/ape.jpeg", desc: "Gin, Aperol, Jugo de pomelo, Tónica", price: 6500 },
        { name: "Armagedon", image: "/menu/bebidas/armag.jpg", desc: "Ron Habana, Malibú, Granadina, Jugo de naranja", price: 6500 },
        { name: "Gancia Batido", image: "/menu/bebidas/ganciabatido.jpg", price: 5500 },
        { name: "Cuba Libre", image: "/menu/bebidas/cubata.jpg", price: 6500 },
        { name: "Mojito", image: "/menu/bebidas/moji.jpg", price: 6500 },
        { name: "Jagger con Speed", image: "/menu/bebidas/jager.jpg", price: 7500 }
    ],
    caipirinhas: [
        { name: "Clásica (Limón caipira y cachaça)", image: "/menu/bebidas/cailim.jpg", sizes: { "360cc": 4000, "800cc": 6500, "1LT": 7000 } },
        { name: "Naranja", image: "/menu/bebidas/cainar.jpg", sizes: { "360cc": 4000, "800cc": 6500, "1LT": 7000 } },
        { name: "Pomelo", image: "/menu/bebidas/caipipo.png", sizes: { "360cc": 4000, "800cc": 6500, "1LT": 7000 } },
        { name: "Frutos Rojos", image: "/menu/bebidas/caipifruto.jpg", sizes: { "360cc": 4000, "800cc": 6500, "1LT": 7000 } },
        { name: "Maracuyá", image: "/menu/bebidas/caimar.jpg", sizes: { "360cc": 4000, "800cc": 6500, "1LT": 7000 } },
        { name: "Melón", image: "/menu/bebidas/caipiramelon.jpg", sizes: { "360cc": 4000, "800cc": 6500, "1LT": 7000 } }
    ],
    daiquiris: [
        { name: "Frutilla", image: "/menu/bebidas/daikirifrutilla.jpg", sizes: { "Vaso de Trago": 5000, "800cc": 7500, "1LT": 9000 } },
        { name: "Durazno", image: "/menu/bebidas/dakiriduranz.jpg", sizes: { "Vaso de Trago": 5000, "800cc": 7500, "1LT": 9000 } },
        { name: "Ananá", image: "/menu/bebidas/daiquirianana.jpg", sizes: { "Vaso de Trago": 5000, "800cc": 7500, "1LT": 9000 } },
        { name: "Kiwi", image: "/menu/bebidas/daiquirikiwi.jpg", sizes: { "Vaso de Trago": 5000, "800cc": 7500, "1LT": 9000 } },
        { name: "Melón", image: "/menu/bebidas/daikiridemelon.jpg", sizes: { "Vaso de Trago": 5000, "800cc": 7500, "1LT": 9000 } },
        { name: "Mango", image: "/menu/bebidas/daiquirimango.avif", sizes: { "Vaso de Trago": 5000, "800cc": 7500, "1LT": 9000 } },
        { name: "Frutos Rojos", image: "/menu/bebidas/daikirifrutos.jpg", sizes: { "Vaso de Trago": 5000, "800cc": 7500, "1LT": 9000 } }
    ],
    autor: [
        { name: "Black Russian", desc: "Sernova Vodka 45 ml, Licor Borghetti 45ml", price: 7000 },
        { name: "Sernova Candy Splash", desc: "Sernova Candy Glow 40%, Sprite 60%", price: 7000 },
        { name: "Bailey Bu", desc: "Baileys, Malibú, Leche condensada, Pulpa de frutilla", price: 8500 },
        { name: "Red Master", desc: "Gin Spirito Blu, Red Label, Jagger meister, Speed", price: 8500 },
        { name: "Bad Boy", desc: "Pineral, Naranja, Almíbar, Limón", price: 7000 },
        { name: "Argento Spritz", desc: "Carpano bianco, Sidra, Golpe de soda", price: 7000 },
        { name: "Agua en la Boca", desc: "Pulpa de melón, Pulpa de frutilla, Limón, Licor de durazno, Vodka Sernova, Agua tónica", price: 6500 }
    ]
};

// ========================
// 2. PARSING TO FLAT ARRAY
// ========================

const id_negocio = "elysrestobar";
const productos: any[] = [];

// 1. COMIDAS
menuComidas.entradas.forEach(sub => {
    sub.items.forEach(item => {
        productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", sub.subcategoria], precio_base: item.price || 0, imagen: item.image || "", opciones: item.options ? item.options.map((o: any) => ({ nombre: o.portion, precio: o.price })) : [], descripcion: item.desc || "", estado: "activo", detalles_especificos: { tipo: sub.subcategoria } });
    });
});
menuComidas.especialidades.forEach(item => {
    productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", "Especialidades"], precio_base: item.price || 0, imagen: item.image || "", opciones: item.options ? item.options.map((o: any) => ({ nombre: o.portion, precio: o.price })) : [], descripcion: item.guarniciones ? `Guarniciones: ${item.guarniciones.join(", ")}` : "", estado: "activo", detalles_especificos: { tipo: "Especialidades" } });
});
menuComidas.ensaladas.forEach(item => {
    productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", "Ensaladas"], precio_base: item.price || 0, imagen: item.image || "", descripcion: item.desc || "", estado: "activo", opciones: [], detalles_especificos: { tipo: "Ensaladas" } });
});
menuComidas.paraCompartir.forEach(item => {
    productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", "Para Compartir"], precio_base: item.price || 0, imagen: item.image || "", opciones: item.options ? item.options.map((o: any) => ({ nombre: o.portion, precio: o.price })) : [], descripcion: item.desc || "", estado: "activo", detalles_especificos: { tipo: "Para Compartir" } });
});
menuComidas.alPlato.forEach(item => {
    productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", "Al Plato"], precio_base: item.price || 0, imagen: item.image || "", opciones: item.options ? item.options.map((o: any) => ({ nombre: o.portion, precio: o.price })) : [], descripcion: item.salsas ? `Salsas: ${item.salsas.join(", ")}` : "", estado: "activo", detalles_especificos: { tipo: "Al Plato" } });
});
menuComidas.pizzas.forEach((item: any) => {
    productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", "Pizzas"], precio_base: item.price || 0, imagen: item.imagen || "", opciones_extras: item.extras ? item.extras.map((e: any) => ({ nombre: e.name, precio: e.price })) : [], descripcion: item.desc || "", estado: "activo", opciones: [], detalles_especificos: { tipo: "Pizzas" } });
});
menuComidas.empanadas.sabores.forEach(sabor => {
    productos.push({ id_negocio, nombre_producto: `Empanada de ${sabor}`, categoria_producto: "Comidas", categorias: ["Comidas", "Empanadas"], precio_base: menuComidas.empanadas.precios.unidad, imagen: "/menu/emp.png", opciones: [{ nombre: "Unidad", precio: menuComidas.empanadas.precios.unidad }, { nombre: "Docena", precio: menuComidas.empanadas.precios.docena }], descripcion: "", estado: "activo", detalles_especificos: { tipo: "Empanadas" } });
});
menuComidas.hamburguesas.forEach(item => {
    productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", "Hamburguesas"], precio_base: item.price || 0, imagen: item.image || "", opciones_extras: item.extras ? item.extras.map((e: any) => ({ nombre: e.name, precio: e.price })) : [], descripcion: item.desc || "", estado: "activo", opciones: [], detalles_especificos: { tipo: "Hamburguesas" } });
});
menuComidas.sandwicheria.forEach((item: any) => {
    productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Comidas", categorias: ["Comidas", "Sandwicheria"], precio_base: item.price || 0, imagen: item.image || "", opciones: item.options ? item.options.map((o: any) => ({ nombre: o.portion, precio: o.price })) : [], opciones_extras: item.extras ? item.extras.map((e: any) => ({ nombre: e.name, precio: e.price })) : [], descripcion: item.desc || "", estado: "activo", detalles_especificos: { tipo: "Sandwicheria" } });
});

// 2. BEBIDAS
const processBebidas = (arr: any[], subcategoria: string) => {
    arr.forEach(item => {
        productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Bebidas", categorias: ["Bebidas", subcategoria], precio_base: item.price || 0, imagen: item.image || "", opciones: item.options ? item.options.map((o: any) => ({ nombre: o.portion, precio: o.price })) : [], descripcion: item.desc || "", estado: "activo", detalles_especificos: { tipo: subcategoria } });
    });
};
processBebidas(menuBebidas.sinAlcohol, "Sin Alcohol");
processBebidas(menuBebidas.cervezaArtesanal, "Cerveza Artesanal");
processBebidas(menuBebidas.porrones, "Porrones");
processBebidas(menuBebidas.botellas, "Cervezas en Botella");
menuBebidas.vinos.forEach(v => { processBebidas(v.items, `Vinos ${v.tipo}`); });

// 3. TRAGOS
const processTragos = (arr: any[], subcategoria: string) => {
    arr.forEach(item => {
        productos.push({ id_negocio, nombre_producto: item.name, categoria_producto: "Tragos", categorias: ["Tragos", subcategoria], precio_base: item.price || 0, imagen: item.image || "", opciones: item.options ? item.options.map((o: any) => ({ nombre: o.portion, precio: o.price })) : item.sizes ? Object.keys(item.sizes).map(k => ({ nombre: k, precio: item.sizes[k] })) : [], descripcion: item.desc || "", estado: "activo", detalles_especificos: { tipo: subcategoria } });
    });
};
processTragos(menuTragos.sinAlcohol, "Sin Alcohol");
processTragos(menuTragos.jarras, "Jarras");
processTragos(menuTragos.shots, "Shots");
processTragos(menuTragos.whiskys, "Whiskys");
processTragos(menuTragos.clasicos, "Clásicos");
processTragos(menuTragos.caipirinhas, "Caipirinhas");
processTragos(menuTragos.daiquiris, "Daiquiris");
processTragos(menuTragos.autor, "De Autor");


// ========================
// 3. UPLOAD TO FIRESTORE
// ========================
async function uploadAll() {
    console.log(`Borrando catálogo existente para ${id_negocio}...`);
    const oldProductsSnap = await db.collection("productos_catalogo").where("id_negocio", "==", id_negocio).get();

    const batchDelete = db.batch();
    oldProductsSnap.docs.forEach(doc => {
        batchDelete.delete(doc.ref);
    });

    if (!oldProductsSnap.empty) {
        await batchDelete.commit();
        console.log(`Se eliminaron ${oldProductsSnap.size} productos viejos.`);
    }

    console.log(`Preparando ${productos.length} productos nuevos...`);

    const batch = db.batch();
    productos.forEach(p => {
        if (!p.opciones?.length) delete p.opciones;
        if (!p.opciones_extras?.length) delete p.opciones_extras;

        p.createdAt = admin.firestore.FieldValue.serverTimestamp();

        const docRef = db.collection("productos_catalogo").doc();
        batch.set(docRef, p);
    });

    await batch.commit();
    console.log("===============================");
    console.log(`¡Éxito! Migración finalizada.`);
    console.log(`Negocio: ${id_negocio}`);
    console.log(`Productos subidos: ${productos.length}`);
    console.log("===============================");
}

uploadAll().catch(console.error);
