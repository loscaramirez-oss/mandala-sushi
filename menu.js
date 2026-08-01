/* ============================================================
   MANDALA SUSHI CAUCEL - CONFIGURACIÓN Y MENÚ
   Edita aquí: número de WhatsApp, nombre del negocio, productos y precios.
   Reglas:
   - Para añadir un producto: copia una línea { name: "...", price: 0 }
   - Un producto puede tener "variants" (ej. sabores) con distinto precio.
   - Acentos y emojis funcionan normal.
   ============================================================ */
const CONFIG = {
  business: "Mandala Sushi Caucel",
  whatsapp: "529993168027",
  phoneDisplay: "999 316 8027",
  banner: "Pide por WhatsApp"
};

const MENU = [
  {
    name: "Entradas",
    items: [
      { name: "Edamames", desc: "Con chile y limón.", price: 75 },
      { name: "Rollitos Primavera", desc: "4 piezas rellenas de verduras.", price: 65 },
      { name: "Champiñones Rellenos de Philadelphia", desc: "4 piezas.", price: 75 },
      { name: "Platanitos Gouda", desc: "3 piezas rellenos de queso gouda.", price: 75 },
      { name: "Papas a la Francesa", desc: "Con catsup.", price: 55 },
      { name: "Camarón Mandala", desc: "3 piezas de camarón empanizado relleno de queso gouda, tocino y piña.", price: 95 },
      { name: "Panchitos Jalapeños", desc: "3 pzas. de chiles jalapeños con philadelphia o tampico.", price: 75 },
      { name: "Camarón Philadelphia", desc: "3 pzas. de camarón rellenos de philadelphia.", price: 85 },
      { name: "Brochetas de Camarón", desc: "4 piezas de camarones en brocheta con cebolla y pimiento, asadas y bañadas con salsa teriyaki.", price: 109 },
      { name: "Dedos de Queso Philadelphia", desc: "", price: 75 },
      { name: "Dedos Gouda", desc: "", price: 75 },
      { name: "Dedos Phila Chipotle", desc: "Paquetes de 4 piezas en cada orden.", price: 75 },
      { name: "Onigiri de Philadelphia", desc: "4 piezas (empanizadas).", price: 75 },
      { name: "Onigiri de Chipotle", desc: "4 piezas (empanizadas).", price: 75 },
      { name: "Onigiri de Tampico", desc: "4 piezas (empanizadas).", price: 75 },
      { name: "Gyozas", desc: "Gyozas de carne. 4 pzas fritas.", price: 119 }
    ]
  },
  {
    name: "Temakis y Kiurimakis",
    items: [
      { name: "Pulpo", desc: "", price: 65 },
      { name: "Camarón", desc: "", price: 65 },
      { name: "Salmón", desc: "", price: 70 },
      { name: "Atún", desc: "", price: 70 },
      { name: "Anguila", desc: "", price: 70 },
      { name: "Kanikama", desc: "", price: 60 },
      { name: "Masago", desc: "", price: 60 }
    ]
  },
  {
    name: "Niguiris",
    items: [
      { name: "Pulpo", desc: "", price: 35 },
      { name: "Camarón", desc: "", price: 35 },
      { name: "Salmón", desc: "", price: 40 },
      { name: "Atún", desc: "", price: 40 },
      { name: "Anguila", desc: "", price: 49 },
      { name: "Masago", desc: "", price: 60 }
    ]
  },
  {
    name: "Tostadas con Marinado Mandala",
    items: [
      { name: "Camarón", desc: "", price: 55 },
      { name: "Salmón", desc: "", price: 65 },
      { name: "Atún", desc: "", price: 65 },
      { name: "Kanikama", desc: "", price: 55 },
      { name: "Masago", desc: "", price: 65 }
    ]
  },
  {
    name: "Otras Especialidades",
    items: [
      { name: "Orden de Camarones Empanizados", desc: "10 piezas con salsa spicy.", price: 139 },
      { name: "Tiras de Pollo", desc: "10 tiras de pollo con salsa spicy o BBQ.", price: 105 },
      { name: "Camarones Tempura", desc: "5 piezas de camarones rellenos de tampico, capeados con salsa de la casa.", price: 125, featured: true, emoji: "🍤" },
      { name: "Rollitos de Pepino", desc: "10 pzas de pepino relleno de philadelphia con aguacate y tampico, con salsa de chabacano.", price: 125 },
      { name: "Rollitos de Salmón y Atún", desc: "12 piezas de rollos de salmón u atún rellenos de philadelphia, con aguacate salseados con salsa de frambuesa.", price: 125 }
    ]
  },
  {
    name: "Arroces",
    items: [
      { name: "Yakimeshi", desc: "Arroz a la plancha bañado en soya con verduras.", variants: [
        { label: "Pollo", price: 90 },
        { label: "Res", price: 95 },
        { label: "Camarón", price: 100 },
        { label: "Mixto", price: 115 }
      ]},
      { name: "Gohan Tampico", desc: "Arroz al vapor con salsa tampico bañado con ajonjolí negro.", price: 80 },
      { name: "Gohan Spicy", desc: "Arroz al vapor con salsa spicy y aguacate.", variants: [
        { label: "Pollo", price: 90 },
        { label: "Arrachera", price: 99 },
        { label: "Camarón", price: 100 }
      ]}
    ]
  },
  {
    name: "Pasta",
    items: [
      { name: "Pasta", desc: "Acompañada de verdura, repollo, apio, brócoli, cacahuates y proteína.", variants: [
        { label: "Pollo", price: 95 },
        { label: "Camarón", price: 105 }
      ]}
    ]
  },
  {
    name: "Donburis",
    items: [
      { name: "Arroz Mandala", desc: "Arroz al vapor con salsa tampico acompañado de camarón, masago, kanikama, aguacate y salsa de anguila.", price: 125 },
      { name: "Sake Don", desc: "Arroz al vapor con salmón, aguacate, spicy de salmón con cebollín y bañado con anguila.", price: 125 }
    ]
  },
  {
    name: "Sopas",
    items: [
      { name: "Ramen", desc: "Fideos ramen acompañados de proteína a seleccionar, huevo y wakame, picante.", variants: [
        { label: "Pollo", price: 90 },
        { label: "Res", price: 95 },
        { label: "Camarón", price: 105 }
      ]},
      { name: "Sopa Emperador", desc: "Fideos transparentes, camarón, salmón, miso, wakame y dashi.", price: 125 }
    ]
  },
  {
    name: "Rollos Flameados",
    items: [
      { name: "Chicken BBQ", desc: "PF: gratinado con salsa BBQ y pollo a la plancha. PD: verduras a la plancha, tocino, aguacate y philadelphia.", price: 125 },
      { name: "Tokio", desc: "PF: salsa spicy con queso gratinado salseado con salsa de anguila y ajonjolí mixto. PD: philadelphia, aguacate y camarón.", price: 125 },
      { name: "Hiroshima", desc: "PF: salmón y salsa frambuesa. PD: camarón capeado, philadelphia, pepino y aguacate.", price: 139 },
      { name: "Cowboy", desc: "PF: queso gratinado con salsa spicy. PD: chistorra, arrachera, aguacate y chiles toreados.", price: 130 },
      { name: "Sakura", desc: "PF: atún, salsa spicy y sriracha con cebollín. PD: philadelphia, verduras capeadas, aguacate y camarón empanizado.", price: 135 },
      { name: "Eby Imperial", desc: "PF: philadelphia y camarón con salsa de chabacano. PD: tampico de camarón, pepino, aguacate.", price: 145 },
      { name: "Mexicano Roll", desc: "PF: gratinado con chistorra y guacamole. PD: philadelphia, arrachera, aguacate y piña.", price: 135 }
    ]
  },
  {
    name: "Rollos Exóticos",
    items: [
      { name: "Arcoiris Roll", desc: "PF: kiwi, philadelphia, fresa y mango. PD: surimi, pepino y aguacate.", price: 99 },
      { name: "Fresita Maki", desc: "PF: philadelphia y fresa. PD: surimi, pepino y piña.", price: 99 },
      { name: "Kiwi Roll", desc: "PF: kiwi y philadelphia. PD: camarón, pepino y aguacate.", price: 99 },
      { name: "Banana Roll", desc: "PF: plátano macho frito. PD: philadelphia, pepino, aguacate y surimi.", price: 95 },
      { name: "Geisha", desc: "PF: philadelphia y aguacate. PD: philadelphia, pepino, piña y surimi.", price: 95 },
      { name: "Hawaii", desc: "PF: philadelphia, piña y togarashi. PD: pepino, aguacate y salmón.", price: 99 },
      { name: "Manguito Roll", desc: "PF: mango y philadelphia (según disponibilidad de mango). PD: camarón, pepino y aguacate.", price: 109 }
    ]
  },
  {
    name: "Rollos Empanizados",
    items: [
      { name: "Sumo", desc: "PF: philadelphia y empanizado. PD: arrachera, queso gouda, aguacate y camarón.", price: 120 },
      { name: "Furai Furai", desc: "PF: empanizado. PD: philadelphia, camarón empanizado, zanahoria y aguacate.", price: 99 },
      { name: "Furai de Surimi", desc: "PF: empanizado. PD: philadelphia, aguacate y surimi.", price: 90 },
      { name: "Furai de Pollo", desc: "PF: empanizado. PD: philadelphia, aguacate y pollo.", price: 90 },
      { name: "Furai de Camarón", desc: "PF: empanizado. PD: philadelphia, aguacate y camarón empanizado.", price: 99 },
      { name: "Furai de Arrachera", desc: "PF: empanizado. PD: philadelphia, aguacate y arrachera.", price: 99 },
      { name: "Eby Furai", desc: "PF: empanizado y tampico. PD: philadelphia, camarón y aguacate.", price: 125 },
      { name: "Sake Furai", desc: "PF: empanizado y tampico. PD: philadelphia, camarón, salmón y aguacate.", price: 139 },
      { name: "Okinawa", desc: "PF: empanizado. PD: tocino, pollo a la plancha, piña y queso gouda.", price: 99, featured: true, emoji: "🥓" },
      { name: "Coco Hot", desc: "PF: empanizado de coco y tampico con salsa chipotle. PD: philadelphia, camarón empanizado, piña y coco.", price: 125, featured: true, emoji: "🥥" },
      { name: "Cantinflas", desc: "PF: queso gouda, empanizado y guacamole. PD: aguacate, arrachera con queso gratinado y cebolla.", price: 135 },
      { name: "Yoko Roll", desc: "PF: tampico chipotle. PD: philadelphia, aguacate, cebollín y surimi empanizado.", price: 95 },
      { name: "Doradito Roll", desc: "PF: aguacate y julianas de tortilla frita. PD: arrachera y queso gouda.", price: 95 },
      { name: "Tori", desc: "PF: tampico y ajonjolí. PD: philadelphia, pepino, aguacate y surimi.", price: 90 },
      { name: "Daisuki", desc: "PF: philadelphia y furikake de salmón. PD: aguacate y salmón empanizado.", price: 105 },
      { name: "Katana", desc: "PF: philadelphia y piel de salmón. PD: philadelphia, aguacate y camarón empanizado.", price: 105 },
      { name: "Kiroi Pollito", desc: "PF: queso gratinado. PD: aguacate y pollo empanizado.", price: 90 },
      { name: "Dragón", desc: "PF: aguacate, masago y cebollín. PD: philadelphia, pepino y camarón empanizado.", price: 110, featured: true, emoji: "🐉" },
      { name: "Adachi", desc: "PF: masago, furikake de salmón, cebollín. PD: philadelphia, pepino, aguacate y camarón empanizado.", price: 110 },
      { name: "Ondori Aoi", desc: "PF: queso de bola, philadelphia y salsa de chabacano. PD: pollo empanizado, aguacate y kakiague.", price: 110 },
      { name: "Yaki Sake", desc: "PF: salmón a la plancha y cebollín en salsa chipotle. PD: kakiague, aguacate y queso gouda.", price: 115 },
      { name: "Kani Kani", desc: "PF: aguacate, spicy, camarón empanizado y kanikama. PD: philadelphia, pepino y aguacate.", price: 115 }
    ]
  },
  {
    name: "Rollos con Sabor a Japón",
    items: [
      { name: "Shinigami", desc: "PF: aguacate, spicy, salsa de anguila, sriracha y ajonjolí. PD: philadelphia, tampico y camarón empanizado.", price: 115 },
      { name: "Minato", desc: "PF: capeado, pechuga y chipotle. PD: manchego, philadelphia y aguacate.", price: 115 },
      { name: "Samurai", desc: "PF: fideos de pepino y togarashi. PD: philadelphia, aguacate y camarón.", price: 105 },
      { name: "Mandala Roll", desc: "PF: camarón, kanikama, atún, salmón, pulpo, masago y philadelphia. PD: tomago, aguacate y pepino.", price: 145, featured: true, emoji: "🥢" },
      { name: "Ninja", desc: "PF: hoja de arroz. PD: philadelphia, pepino, aguacate y salmón.", price: 115 },
      { name: "Ikao Masago", desc: "PF: philadelphia y masago. PD: pepino, aguacate y camarón.", price: 115 },
      { name: "Maguro", desc: "PF: atún. PD: philadelphia, pepino y aguacate.", price: 105 },
      { name: "Eby", desc: "PF: furikake de camarón. PD: philadelphia, camarón empanizado y aguacate.", price: 105 },
      { name: "Sake", desc: "PF: salmón. PD: philadelphia, aguacate y pepino.", price: 105, featured: true, emoji: "🍣" }
    ]
  },
  {
    name: "Rollos Clásicos",
    items: [
      { name: "California Roll", desc: "PF: ajonjolí mixto. PD: philadelphia, aguacate y surimi.", price: 90, featured: true, emoji: "🥑" },
      { name: "Philadelphia Roll", desc: "PF: philadelphia. PD: pepino, aguacate y surimi.", price: 90 },
      { name: "Chipotle Roll", desc: "PF: philadelphia con chipotle. PD: pepino, aguacate y surimi.", price: 90 },
      { name: "Nori Maki", desc: "PF: alga. PD: philadelphia, pepino, aguacate y surimi.", price: 90 },
      { name: "Yasai Tempura", desc: "PF: verduras capeadas. PD: philadelphia, pepino, aguacate y surimi.", price: 90 },
      { name: "Nevadito", desc: "PF: philadelphia. PD: camarón empanizado y aguacate.", price: 99 }
    ]
  },
  {
    name: "Postres",
    items: [
      { name: "Pastel de Chocolate", desc: "", price: 50 },
      { name: "Cheesecake Japonés", desc: "", price: 70 },
      { name: "Helado Tempura", desc: "", price: 70 }
    ]
  },
  {
    name: "Bebidas",
    items: [
      { name: "Ramune", desc: "Refresco gasificado japonés en varios sabores.", price: 70 },
      { name: "Calpis", desc: "Bebida japonesa con sabor ácido y dulce (natural o soda).", price: 40 },
      { name: "Naranjada o Limonada", desc: "Natural o soda.", price: 35 },
      { name: "Té Helado Nestea", desc: "Refill (3 vasos).", price: 45 },
      { name: "Agua de Pepino", desc: "Refill (3 vasos).", price: 45 },
      { name: "Agua Fresa-Limón", desc: "Refill (3 vasos).", price: 45 },
      { name: "Refrescos", desc: "Coca cola, Fanta, Manzanita, negra, mineral.", price: 28 },
      { name: "Agua Embotellada 500 ml", desc: "", price: 22 },
      { name: "Agua Embotellada 1 L", desc: "", price: 25 },
      { name: "Fuzetea", desc: "", price: 28 }
    ]
  }
];
