window.RestaurantConfig = Object.freeze({
  appVersion: 1,
  storagePrefix: 'kansoTable',
  restaurant: {
    name: 'Kansō Table',
    tagline: 'Seasonal plates. Quiet craft.',
    description: 'A refined dining room blending Indian regional comfort with Japanese-inspired restraint.',
    phone: '+91 90000 12345',
    email: 'hello@kansotable.demo',
    address: 'Jubilee Hills, Hyderabad, Telangana 500033',
    mapUrl: 'https://maps.google.com/?q=Jubilee+Hills+Hyderabad',
    instagram: '#',
    facebook: '#',
    currency: 'INR',
    locale: 'en-IN'
  },
  openingHours: {
    monday:'12:00–22:30', tuesday:'12:00–22:30', wednesday:'12:00–22:30', thursday:'12:00–22:30',
    friday:'12:00–23:00', saturday:'12:00–23:00', sunday:'12:00–23:00', holidays:'Update manually for special dates'
  },
  taxRate: 0.05,
  deliveryFee: 49,
  freeDeliveryThreshold: 999,
  categories: ['Starters','Main Course','Rice & Noodles','Desserts','Beverages','Combos','Chef\'s Specials'],
  cuisines: ['Andhra','South Indian','North Indian','Japanese','Chinese','Italian','Continental','Other'],
  dietary: ['Vegetarian','Vegan','Egg','Non-Vegetarian'],
  spiceLevels: ['Mild','Medium','Hot','Extra Hot'],
  reservation: {
    minGuests: 1,
    maxGuests: 12,
    openTime: '12:00',
    closeTime: '22:30',
    intervalMinutes: 30
  },
  recentlyViewedLimit: 8,
  loyalty: {
    pointsPer100: 10,
    tiers: [
      { name: 'Hinoki', min: 0, max: 999 },
      { name: 'Sakura', min: 1000, max: 2499 },
      { name: 'Kintsugi', min: 2500, max: Infinity }
    ]
  },
  features: {
    admin: true,
    loyalty: true,
    reviews: true,
    reservations: true,
    multilingual: true,
    gallery: true,
    catering: true
  },
  languages: {
    en: { label: 'English', home:'Home', menu:'Menu', cuisines:'Cuisines', about:'About', reservations:'Reservations', reviews:'Reviews', contact:'Contact', cart:'Cart', profile:'Profile' },
    hi: { label: 'हिन्दी', home:'होम', menu:'मेन्यू', cuisines:'व्यंजन', about:'हमारे बारे में', reservations:'आरक्षण', reviews:'समीक्षाएँ', contact:'संपर्क', cart:'कार्ट', profile:'प्रोफ़ाइल' },
    te: { label: 'తెలుగు', home:'హోమ్', menu:'మెనూ', cuisines:'వంటకాలు', about:'గురించి', reservations:'రిజర్వేషన్లు', reviews:'సమీక్షలు', contact:'సంప్రదింపు', cart:'కార్ట్', profile:'ప్రొఫైల్' }
  }
});
