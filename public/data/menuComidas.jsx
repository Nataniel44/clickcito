export const menuComidas = {


    entradas: [
        {
            subcategoria: "Papas",
            items: [
                { name: "Clásicas o Rústicas", image: "/menu/pacl.png", price: 9000 },
                {
                    name: "Gratinadas con queso", options: [
                        { portion: "Cheddar", price: 10000 },
                        { portion: "Muzzarella", price: 10000 },
                    ], image: "/menu/papgratinque.jpg", price: 10000
                },
                { name: "Panceta, cheddar y verdeo", image: "/menu/papaschedarverd.jpg", price: 11000 },
                { name: "Bravas (picantes)", image: "/menu/papasbravaspic.jpg", price: 10000 },
            ],
        },
        {
            subcategoria: "Otros",
            items: [
                { name: "Mandiocas fritas", image: "/menu/man.png", price: 9000 },
                { name: "Tequeños con dip", image: "/menu/taque.jpg", price: 11500 },
                { name: "Rabas con aderezo", image: "/menu/rabas.jpg", price: 17000 },
                { name: "Camarones crujientes", image: "/menu/camacru.jpg", price: 22000 },
                { name: "Mozzarella sticks", image: "/menu/fing.png", price: 11500 },
                { name: "Chicken fingers con dip", image: "/menu/muzzas.jpg", price: 12000 },
                { name: "Provoleta a la Napolitana", image: "/menu/prov.jpg", price: 13000 },
            ],
        },
    ],
    especialidades: [
        {
            name: "Picaña",
            image: "/menu/pic.jpg",
            options: [
                { portion: "Para 2 personas ", price: 25500 },
                { portion: "Para 4 personas ", price: 43000 },
            ],
            guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"],
        },
        {
            name: "Entraña",
            image: "/menu/entr.jpg",
            options: [
                { portion: "Para 2 personas", price: 25500 },
                { portion: "Para 4 personas", price: 43000 },
            ],
            guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"],
        },
        {
            name: "Lomo",
            image: "/menu/pic.jpg",
            options: [
                { portion: "Para 2 personas", price: 25500 },
                { portion: "Para 4 personas", price: 43000 },
            ],
            guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"],
        },
        {
            name: "T-Bone",
            image: "/menu/tbone.jpg",
            options: [
                { portion: "Para 2 personas", price: 25500 },
                { portion: "Para 4 personas", price: 43000 },
            ],
            guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"],
        },
        {
            name: "Bife de Chorizo",
            image: "/menu/bif.jpeg",
            options: [
                { portion: "Para 2 personas", price: 25500 },
                { portion: "Para 4 personas", price: 43000 },
            ],
            guarniciones: ["Papas fritas", "Mandioca frita", "Mandioca hervida", "Puré de papas", "Arroz especiado"],
        },
    ],
    ensaladas: [
        { name: "Completa", image: "/menu/compl.png", desc: "Zanahoria, Tomate, Huevo Duro, Choclo", price: 11000 },
        { name: "Mixta", image: "/menu/mix.png", desc: "Lechuga, Tomate y Cebolla", price: 9000 },
        { name: "Especial", image: "/menu/esp.png", desc: "Rúcula, Cherrys y Parmesano", price: 10500 },
        { name: "César", image: "/menu/cesar.jpg", desc: "Hojas verdes, Croutons, Pollo crujiente, Parmesano", price: 12000 },
    ], paraCompartir: [
        {
            name: "Tabla de Milanesas (4u.)",
            image: "/menu/m.jpg",
            desc: "Napolitana, Mozza con jamón, Mozza huevo y panceta, Suiza",

            price: 34000,
        },
        {
            name: "Tabla de Pizzetas (8u.)",
            image: "/menu/pizzetas.png",
            price: 14000,
            desc: "2 Napolitana, 2 Mozza con Jamón, 2 Fugazzetas, 2 Jamón y huevo",

        },

        {
            name: "Picada", image: "/menu/pica.jpg",
            desc: "Jamón Cocido, Queso, Salame, Jamón Crudo, Aceitunas, Milanesitas, Bastones de Mozza, Papas, Sopa paraguaya",
            options: [
                { portion: "Para 2 personas", price: 22000 },
                { portion: "Para 4 personas", price: 36500 },
            ],
        },
    ], alPlato: [
        {
            name: "Lomo / Milanesa a la Napo con papas fritas", image: "/menu/milanapo.png", options: [
                { portion: "Lomo", price: 17500 },
                { portion: "Milanesa", price: 17500 },
            ], price: 17500
        },
        {
            name: "Pechuga al verdeo o mostaza con puré de papas", image: "/menu/pollo.png", options: [
                { portion: "Verdeo", price: 15500 },
                { portion: "Mostaza", price: 15500 },
            ], price: 15500
        },
        { name: "Lomo a las finas hierbas con papas noisette", image: "/menu/lom.png", price: 17500 },
        { name: "Mila a caballo en colchón con papas pay", image: "/menu/milapay.png", price: 17500 },
        { name: "Pacu teko al roquefort con papas noisette", image: "/menu/paku.png", price: 18000 },
        // Pastas
        { name: "Sorrentinos de jamón y queso", image: "/menu/sorre.jpg", price: 16000, salsas: ["Bolognesa", "Scarparo", "4 Quesos", "Parisienne"] },
        { name: "Ravioles de ricota y verduras", image: "/menu/raviolesrico.jpg", price: 16000, salsas: ["Bolognesa", "Scarparo", "4 Quesos", "Parisienne"] },
        { name: "Tallarines al huevo", image: "/menu/tallahue.jpg", price: 14500, salsas: ["Bolognesa", "Scarparo", "4 Quesos", "Parisienne"] },
    ],
    pizzas: [
        {
            name: "Mozzarella",
            desc: "Salsa, Mozza, Aceitunas verdes, Orégano",
            price: 12000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Fugazzeta",
            desc: "Mozza, Cebolla, Aceitunas negras, Orégano, Oliva",
            price: 14000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Napolitana",
            desc: "Salsa, Mozza, Tomate en rodajas, Orégano",
            price: 15000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Especial",
            desc: "Salsa, Mozza, Jamón, Huevo duro, Tomate, Aceitunas verdes",
            imagen: "/menu/pizzaesp.jpg",
            price: 17000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Napo con Jamón",
            desc: "Salsa, Mozza, Jamón, Tomate, Orégano",
            price: 16000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Jamón y Morrones",
            desc: "Salsa, Mozza, Jamón, Morrones, Aceitunas verdes",
            price: 15000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "4 Quesos",
            desc: "Mozza, Queso azul, Parmesano, Provolone",
            price: 17000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Americana",
            desc: "Salsa, Mozza, Huevo frito, Panceta", imagen: "/menu/pizzhue.jpg",
            price: 20000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Anchoas",
            desc: "Salsa, Mozza, Anchoas, Aceitunas negras",
            price: 17000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Calabresa / Pepperoni",
            desc: "Salsa, Mozza, Longaniza, Aceitunas",
            price: 17000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Palmitos",
            desc: "Salsa, Mozza, Jamón, Salsa golf, Palmitos, Aceitunas",
            price: 18000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Tropical",
            desc: "Salsa, Mozza, Jamón, Ananá, Aceitunas",
            price: 19000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Rúcula",
            desc: "Salsa, Mozza, Jamón crudo, Rúcula, Parmesano, Aceitunas negras",
            price: 20000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        },
        {
            name: "Humita",
            desc: "Salsa, Mozza, Choclo en salsa blanca",
            price: 18000,
            extras: [
                { name: "Muzza extra", price: 800 }
            ]
        }
    ],

    empanadas: {
        sabores: [
            "Carne",
            "Pollo",
            "Jamón y Queso",
            "Cebolla y Queso",
            "Caprese",
            "Panceta y Queso",
            "Napolitana",
            "Cheese Burger",
            "Verduras",
            "Humita",
        ],
        precios: { unidad: 2000, docena: 24000 },
    },
    hamburguesas: [
        {
            name: "Completa Clásica", image: "/menu/cl.jpg", extras: [
                { name: "Medallón extra", price: 2500 }
            ], desc: "Pan Artesanal, Medallón, Lechuga, Tomate, Jamón, Queso y Huevo. Todas las hamburguesas van acompañadas con papas.", price: 11000
        },
        {
            name: "Del Bar", extras: [
                { name: "Medallón extra", price: 2500 }
            ], image: "/menu/hamburgesa_debar.jpg", desc: "Pan Artesanal, Medallón, Lechuga, Tomate, Jamón, Huevo, Queso Cheddar, Panceta crocante, Cebolla Caramelizada. Todas las hamburguesas van acompañadas con papas.", price: 12000
        },
        {
            name: "Cheese Burger", extras: [
                { name: "Medallón extra", price: 2500 }
            ], image: "/menu/cheesebur.jpeg", desc: "Pan Artesanal, Doble Medallón de Carne Smasheada, Doble Cheddar y Cebolla. Todas las hamburguesas van acompañadas con papas.", price: 10500
        },
        {
            name: "Crispy Onion", extras: [
                { name: "Medallón extra", price: 2500 }
            ], image: "/menu/crispy.jpg", desc: "Pan Artesanal, Doble Medallón Smasheado, Panceta Crocante, Doble queso blanco, Cebolla crocante. Todas las hamburguesas van acompañadas con papas.", price: 11500
        },
        {
            name: "Veggie", extras: [
                { name: "Medallón extra", price: 2500 }
            ], image: "/menu/hamburgesa_debar.jpg", desc: "Medallón, Tomate, Lechuga, Queso, Huevo. Consultar variedad disponible de medallón. Todas las hamburguesas van acompañadas con papas.", price: 10000
        },
    ],
    sandwicheria: [

        {
            name: "Lomito Completo Clásico", image: "/menu/lomo.jpg", extras: [
                { name: "Salsa de ajo", price: 0 }
            ], desc: "Pan Artesanal, Bife de lomo, Lechuga, Tomate, Jamón, Queso, Huevo. Todos los sándwiches van acompañados con papas.", price: 12500,
        },
        {
            name: "Salteado Peruano", image: "/menu/saltpe.jpg", extras: [
                { name: "Salsa de ajo", price: 0 }
            ], desc: "Pan Artesanal, Lomo en tiras, Cebolla morada, Morrón amarillo, Perejil, Tomates en gajos, Salsa agridulce, Rúcula, Cebolla. Todos los sándwiches van acompañados con papas.", price: 14000
        },
        {
            name: "Panini de Pollo", extras: [
                { name: "Salsa de ajo", price: 0 }
            ], image: "/menu/san.jpg", desc: "Suprema grillada, Salsa de Pesto, Mozza, Tomates cherrys, Lechuga repollada. Todos los sándwiches van acompañados con papas.", price: 12000
        },
        {
            name: "Shawarma", image: "/menu/shaw.jpg", extras: [

                { name: "Salsa de ajo", price: 0 }
            ], options: [
                { portion: "Lomo", price: 11500 },
                { portion: "Pollo braseado", price: 11500 },
            ], desc: "Pan pita, Lomo o pollo braseados, Cebolla en pluma, Bañar, Salsa de ajo, Tomates trozados, Gratinado de queso. Todos los sándwiches van acompañados con papas.", price: 11500
        },
        {
            name: "Milanguche",
            image: "/menu/milan.jpg",
            extras: [
                { name: "Salsa de ajo", price: 0 }
            ], options: [
                { portion: "Carne", price: 12500 },
                { portion: "Pollo", price: 12500 },
            ], desc: "Milanesas (carne o pollo), Pan artesanal, Queso, Huevo, Jamón, Tomate, Lechuga, Morrones asados. Todos los sándwiches van acompañados con papas.", price: 12500
        },
    ],
    postres: "Consultar opciones disponibles y precios",
};
