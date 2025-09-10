let idCounter = 1;
const withId = (arr, defaults = {}) =>
  arr.map(item => ({ id: idCounter++, ...defaults, ...item }));

export const MANICURES = withId([
  { name: "Basic Manicure", description: "Nail shaping, cuticle care and polish.", price: 20, duration: 20, icon: "fa-hand-sparkles" },
  { name: "Gel Manicure", description: "Long-lasting gel with LED cure.", price: 40, duration: 40, icon: "fa-droplet" },
  { name: "French Manicure", description: "Crisp white tips.", price: 50, duration: 30, icon: "fa-paintbrush" },
]);

export const PEDICURES  = withId([
  { name: "Basic Pedicure", description: "Soak, trim, gentle exfoliation and polish.", price: 30, duration: 45, icon: "fa-shoe-prints" },
  { name: "Spa Pedicure", description: "Sugar scrub, mask and massage.", price: 40, duration: 45, icon: "fa-spa" },
  { name: "Deluxe Pedicure", description: "Paraffin dip, extended massage.", price: 60, duration: 60, icon: "fa-gem" },
]);

export const DIPS = withId([
  { name: "Classic Dip", description: "Durable powder finish.", price: 40, duration: 45, icon: "fa-tint" },
  { name: "Multichrome Dip", description: "Color-shifting finish.", price: 50, duration: 60, icon: "fa-adjust" },
  { name: "Glitter Dip", description: "High sparkle finish.", price: 50, duration: 60, icon: "fa-star" },
]);

export const ACRYLICS = withId([
  { name: "Full Set Acrylics", description: "Premium acrylic set.", price: 35, duration: 60, icon: "fa-square-plus" },
  { name: "Acrylic Fill", description: "Maintains existing acrylics.", price: 25, duration: 45, icon: "fa-fill-drip" },
  { name: "Acrylic Nail Art", description: "Hand-painted designs/gems.", price: 20, duration: 60, icon: "fa-palette" },
]);

export const ADDONS = withId([
  { name: "Paraffin Wax", description: "Deep moisturize.", price: 15, duration: 15, icon: "fa-hand-holding-droplet" },
  { name: "Sugar Scrub", description: "Gentle exfoliation.", price: 25, duration: 15, icon: "fa-spa" },
  { name: "Gel Top Coat Add-On", description: "Ultra-shiny finish.", price: 15, duration: 15, icon: "fa-gem" },
]);

export const SERVICES_BY_CATEGORY = [
  { title: "Manicures", items: MANICURES },
  { title: "Pedicures", items: PEDICURES },
  { title: "Dip Powder", items: DIPS },
  { title: "Acrylics", items: ACRYLICS },
  { title: "Add-Ons", items: ADDONS },
];

// handy flat list if you want one section only
export const SERVICES_FLAT = [
  ...MANICURES, ...PEDICURES, ...DIPS, ...ACRYLICS, ...ADDONS,
];
