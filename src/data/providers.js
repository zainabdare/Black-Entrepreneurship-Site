/**
 * src/data/providers.js
 * 
 * ⚠️ SAMPLE / TEST DATA NOTICE:
 * All business names, owner names, URLs, and phone numbers in this file
 * are FICTIONAL SAMPLE RECORDS created for prototyping and development.
 * Geographical coordinates and neighborhoods are real Baton Rouge locations
 * within a 25-mile radius of Louisiana State University (LSU Memorial Tower).
 * 
 * Each category contains at least 3 providers with realistic category-specific attributes:
 * - Hair: hairTypes, specialties, chairVibe
 * - Nails: nailStyles
 * - Lashes: lashTypes, offersFills
 * - Food & Beverages: foodTypes, campusDropOff, preOrderRequired
 * - Fashion (Custom Outfits): outfitTypes, turnaround
 * - Photography: shootTypes, travelsToCampus, turnaround
 */

export const SAMPLE_PROVIDERS = [
  // =========================================================================
  // 1. HAIR PROVIDERS (3 providers)
  // =========================================================================
  {
    id: "sample-hair-01",
    businessName: "Bayou Crown Braid Lounge [SAMPLE]",
    ownerName: "Sample Kiana Carter",
    category: "Hair",
    description: "Specializing in tension-free protective styles, knotless braids, and goddess locs. Located minutes from LSU's Northgate with braiding hair included in all packages.",
    instagramUrl: "https://instagram.com/sample.bayoubraids",
    tiktokUrl: "https://tiktok.com/@sample.bayoubraids",
    websiteUrl: "https://sample-bayoubraids.example.com",
    bookingUrl: "https://sample-booking.example.com/bayoubraids",
    startingPrice: 120,
    priceTier: "$$",
    yearsExperience: 4,
    studentDiscount: true,
    serviceDelivery: "studio",
    availability: "open-this-week",
    turnaround: null,
    latitude: 30.4190,
    longitude: -91.1765,
    neighborhood: "Northgate (LSU Walkable)",
    lsuVerified: "student",
    hairTypes: ["3A-3C", "4A-4C"],
    specialties: ["knotless braids", "hair included"],
    chairVibe: "home studio",
    policies: {
      depositRequired: true,
      depositAmount: "$30 non-refundable deposit required upon booking",
      cancellationPolicy: "48-hour advance notice required to transfer deposit to a new date.",
      refundPolicy: "Deposits non-refundable; complimentary service adjustment offered within 48 hours."
    },
    averageRating: 4.9,
    reviewCount: 47,
    portfolioImages: [
      "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "homecoming", "graduation-formal"]
  },
  {
    id: "sample-hair-02",
    businessName: "Silk & Structure Hair Atelier [SAMPLE]",
    ownerName: "Sample Dominique Vance",
    category: "Hair",
    description: "Luxury healthy hair care studio focused on flawless silk presses, custom lace closures, and scalp rehabilitation therapies in Mid City.",
    instagramUrl: "https://instagram.com/sample.silkandstructure",
    tiktokUrl: "https://tiktok.com/@sample.silkandstructure",
    websiteUrl: "https://sample-silkandstructure.example.com",
    bookingUrl: "https://sample-booking.example.com/silkandstructure",
    startingPrice: 85,
    priceTier: "$$",
    yearsExperience: 7,
    studentDiscount: true,
    serviceDelivery: "both",
    availability: "bookings-open",
    turnaround: null,
    latitude: 30.4460,
    longitude: -91.1520,
    neighborhood: "Mid City",
    lsuVerified: "alumni",
    hairTypes: ["3A-3C", "4A-4C", "Relaxed/Straight"],
    specialties: ["silk press", "wig installs"],
    chairVibe: "studio",
    policies: {
      depositRequired: true,
      depositAmount: "$25 deposit applied to total service",
      cancellationPolicy: "24-hour cancellation notice required; late cancellations charged 50% of balance.",
      refundPolicy: "All services final. Client satisfaction check done before leaving chair."
    },
    averageRating: 4.8,
    reviewCount: 63,
    portfolioImages: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["graduation-formal", "formal-ready"]
  },
  {
    id: "sample-hair-03",
    businessName: "Roots & Culture Loc Sanctuary [SAMPLE]",
    ownerName: "Sample Malik Robinson",
    category: "Hair",
    description: "Holistic loc maintenance, interlocking, Sisterlocks retightening, and botanical detox soaks located near Downtown Baton Rouge.",
    instagramUrl: "https://instagram.com/sample.rootslocsanctuary",
    tiktokUrl: "https://tiktok.com/@sample.rootslocsanctuary",
    websiteUrl: "https://sample-rootslocs.example.com",
    bookingUrl: "https://sample-booking.example.com/rootslocs",
    startingPrice: 95,
    priceTier: "$$",
    yearsExperience: 9,
    studentDiscount: false,
    serviceDelivery: "studio",
    availability: "same-day",
    turnaround: null,
    latitude: 30.4515,
    longitude: -91.1871,
    neighborhood: "Downtown Baton Rouge",
    lsuVerified: "alumni",
    hairTypes: ["Locs & Sisterlocks", "4A-4C"],
    specialties: ["loc maintenance"],
    chairVibe: "studio",
    policies: {
      depositRequired: true,
      depositAmount: "$40 deposit required for new appointments",
      cancellationPolicy: "Reschedule at least 24 hours in advance to keep deposit valid for 30 days.",
      refundPolicy: "Non-refundable deposits."
    },
    averageRating: 5.0,
    reviewCount: 88,
    portfolioImages: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "fresh-cut"]
  },

  // =========================================================================
  // 2. NAILS PROVIDERS (3 providers)
  // Fields: nailStyles (acrylic, gel-x, natural nail, press-ons, nail art)
  // =========================================================================
  {
    id: "sample-nails-01",
    businessName: "Luxe Claw Lab [SAMPLE]",
    ownerName: "Sample Jasmine Taylor",
    category: "Nails",
    description: "Precision dry Russian manicures, structured gel overlays, and custom hand-painted LSU Tiger purple & gold nail art located right off Tigerland.",
    instagramUrl: "https://instagram.com/sample.luxeclawlab",
    tiktokUrl: "https://tiktok.com/@sample.luxeclawlab",
    websiteUrl: "https://sample-luxeclawlab.example.com",
    bookingUrl: "https://sample-booking.example.com/luxeclawlab",
    startingPrice: 55,
    priceTier: "$",
    yearsExperience: 3,
    studentDiscount: true,
    serviceDelivery: "studio",
    availability: "open-this-week",
    turnaround: null,
    latitude: 30.4010,
    longitude: -91.1730,
    neighborhood: "Tigerland",
    lsuVerified: "student",
    nailStyles: ["gel-x", "nail art", "acrylic"],
    policies: {
      depositRequired: true,
      depositAmount: "$20 non-refundable deposit required",
      cancellationPolicy: "15-minute grace period before appointment cancellation with forfeited deposit.",
      refundPolicy: "Free repair warranty within 72 hours of initial service."
    },
    averageRating: 4.9,
    reviewCount: 52,
    portfolioImages: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "homecoming", "tailgate-ready"]
  },
  {
    id: "sample-nails-02",
    businessName: "Perkins Nail Atelier [SAMPLE]",
    ownerName: "Sample Chloe Baptiste",
    category: "Nails",
    description: "Mobile and in-studio builder gel extensions, sculpted acrylics, and express press-on sets tailored for formals and university events.",
    instagramUrl: "https://instagram.com/sample.perkinsnails",
    tiktokUrl: "https://tiktok.com/@sample.perkinsnails",
    websiteUrl: "https://sample-perkinsnails.example.com",
    bookingUrl: "https://sample-booking.example.com/perkinsnails",
    startingPrice: 70,
    priceTier: "$$",
    yearsExperience: 5,
    studentDiscount: true,
    serviceDelivery: "both",
    availability: "bookings-open",
    turnaround: null,
    latitude: 30.4225,
    longitude: -91.1530,
    neighborhood: "College Town / Perkins",
    lsuVerified: null,
    nailStyles: ["natural nail", "press-ons", "gel-x"],
    policies: {
      depositRequired: true,
      depositAmount: "$25 non-refundable deposit",
      cancellationPolicy: "24-hour advance notice to reschedule with transferable deposit.",
      refundPolicy: "Services non-refundable; client approval required before topcoat curing."
    },
    averageRating: 4.7,
    reviewCount: 39,
    portfolioImages: [
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["graduation-formal", "formal-ready"]
  },
  {
    id: "sample-nails-03",
    businessName: "Baton Rouge Acrylic Dynasty [SAMPLE]",
    ownerName: "Sample Tasha Washington",
    category: "Nails",
    description: "Specializing in sculpted XXL acrylic sets, encapsulated glitter designs, 3D charms, and custom game-day press-on sets with campus drop-off.",
    instagramUrl: "https://instagram.com/sample.acrylicdynasty",
    tiktokUrl: "https://tiktok.com/@sample.acrylicdynasty",
    websiteUrl: "https://sample-acrylicdynasty.example.com",
    bookingUrl: "https://sample-booking.example.com/acrylicdynasty",
    startingPrice: 65,
    priceTier: "$$",
    yearsExperience: 6,
    studentDiscount: true,
    serviceDelivery: "both",
    availability: "same-day",
    turnaround: null,
    latitude: 30.4380,
    longitude: -91.1620,
    neighborhood: "Garden District / Government St",
    lsuVerified: "alumni",
    nailStyles: ["acrylic", "nail art", "press-ons"],
    policies: {
      depositRequired: true,
      depositAmount: "$25 deposit required for acrylic sets",
      cancellationPolicy: "Rescheduling must occur at least 12 hours prior to start time.",
      refundPolicy: "Complimentary fix on broken nails within 4 days."
    },
    averageRating: 4.9,
    reviewCount: 61,
    portfolioImages: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337094344-660f63421113?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "tailgate-glam", "campus-special"]
  },

  // =========================================================================
  // 3. LASHES PROVIDERS (3 providers)
  // Fields: lashTypes (classic, hybrid, volume, mega volume), offersFills (true/false)
  // =========================================================================
  {
    id: "sample-lashes-01",
    businessName: "Flawless Wink Lash Lounge [SAMPLE]",
    ownerName: "Sample Brianna Scott",
    category: "Lashes",
    description: "Custom volume lash sets, wispy mega-volume extensions, and keratin lash lifts tailored to your natural eye shape in the Garden District.",
    instagramUrl: "https://instagram.com/sample.flawlesswink",
    tiktokUrl: "https://tiktok.com/@sample.flawlesswink",
    websiteUrl: "https://sample-flawlesswink.example.com",
    bookingUrl: "https://sample-booking.example.com/flawlesswink",
    startingPrice: 80,
    priceTier: "$$",
    yearsExperience: 4,
    studentDiscount: true,
    serviceDelivery: "studio",
    availability: "open-this-week",
    turnaround: null,
    latitude: 30.4350,
    longitude: -91.1680,
    neighborhood: "Garden District",
    lsuVerified: "student",
    lashTypes: ["hybrid", "volume", "mega volume"],
    offersFills: true,
    policies: {
      depositRequired: true,
      depositAmount: "$25 deposit required upon booking",
      cancellationPolicy: "Please reschedule 24 hours prior. Late arrivals past 15 mins incur a $15 late fee.",
      refundPolicy: "Non-refundable deposit; free 3-day refill touchup for premature shedding."
    },
    averageRating: 4.9,
    reviewCount: 56,
    portfolioImages: [
      "https://images.unsplash.com/photo-1583001809873-a128495da465?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "graduation-formal"]
  },
  {
    id: "sample-lashes-02",
    businessName: "Bayou Beauty Lash Bar [SAMPLE]",
    ownerName: "Sample Kennedy Hayes",
    category: "Lashes",
    description: "Natural everyday classic sets, wet lash mascara mapping, and rapid bi-weekly lash fills located a short walk from LSU on Highland.",
    instagramUrl: "https://instagram.com/sample.bayoulashbar",
    tiktokUrl: "https://tiktok.com/@sample.bayoulashbar",
    websiteUrl: "https://sample-bayoulashbar.example.com",
    bookingUrl: "https://sample-booking.example.com/bayoulashbar",
    startingPrice: 65,
    priceTier: "$",
    yearsExperience: 3,
    studentDiscount: true,
    serviceDelivery: "studio",
    availability: "same-day",
    turnaround: null,
    latitude: 30.4150,
    longitude: -91.1735,
    neighborhood: "Highland / State St",
    lsuVerified: "student",
    lashTypes: ["classic", "hybrid"],
    offersFills: true,
    policies: {
      depositRequired: true,
      depositAmount: "$20 deposit secures appointment",
      cancellationPolicy: "Same-day cancellation loses deposit; one free reschedule with 24h notice.",
      refundPolicy: "Satisfaction guarantee: free adjustment within 48 hours."
    },
    averageRating: 4.8,
    reviewCount: 44,
    portfolioImages: [
      "https://images.unsplash.com/photo-1522337094344-660f63421113?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["everyday-beauty", "rush-prep"]
  },
  {
    id: "sample-lashes-03",
    businessName: "The Glamour Gaze Studio [SAMPLE]",
    ownerName: "Sample Simone Pierre",
    category: "Lashes",
    description: "High-drama Russian mega volume sets, wispy textured spikes, bottom lash extensions, and camera-ready looks for Greek formals and photo shoots.",
    instagramUrl: "https://instagram.com/sample.glamourgaze",
    tiktokUrl: "https://tiktok.com/@sample.glamourgaze",
    websiteUrl: "https://sample-glamourgaze.example.com",
    bookingUrl: "https://sample-booking.example.com/glamourgaze",
    startingPrice: 110,
    priceTier: "$$$",
    yearsExperience: 6,
    studentDiscount: false,
    serviceDelivery: "studio",
    availability: "bookings-open",
    turnaround: null,
    latitude: 30.4505,
    longitude: -91.1850,
    neighborhood: "Downtown Baton Rouge",
    lsuVerified: "alumni",
    lashTypes: ["volume", "mega volume"],
    offersFills: false,
    policies: {
      depositRequired: true,
      depositAmount: "$35 non-refundable studio deposit",
      cancellationPolicy: "48 hours notice needed to reschedule without forfeiture.",
      refundPolicy: "No refunds on completed lash sets."
    },
    averageRating: 5.0,
    reviewCount: 38,
    portfolioImages: [
      "https://images.unsplash.com/photo-1583001809873-a128495da465?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["formal-ready", "graduation-formal"]
  },

  // =========================================================================
  // 4. FOOD & BEVERAGES PROVIDERS (3 providers)
  // Fields: foodTypes (meals/plates, desserts/baked goods, drinks, catering),
  //         campusDropOff (true/false), preOrderRequired (true/false)
  // =========================================================================
  {
    id: "sample-food-01",
    businessName: "Geaux Soul Gourmet [SAMPLE]",
    ownerName: "Sample Chef Marcus Thibodeaux",
    category: "Food & Beverages",
    description: "Authentic Creole-soul catering, game-day tailgate platters, slow-smoked wings, seafood boils, and private dining for LSU student organizations.",
    instagramUrl: "https://instagram.com/sample.geauxsoulgourmet",
    tiktokUrl: "https://tiktok.com/@sample.geauxsoulgourmet",
    websiteUrl: "https://sample-geauxsoul.example.com",
    bookingUrl: "https://sample-booking.example.com/geauxsoul",
    startingPrice: 45,
    priceTier: "$$",
    yearsExperience: 10,
    studentDiscount: true,
    serviceDelivery: "both",
    availability: "bookings-open",
    turnaround: null,
    latitude: 30.4195,
    longitude: -91.1710,
    neighborhood: "Highland Road / LSU",
    lsuVerified: "alumni",
    foodTypes: ["meals/plates", "catering"],
    campusDropOff: true,
    preOrderRequired: true,
    policies: {
      depositRequired: true,
      depositAmount: "50% deposit required for catering bookings over $150",
      cancellationPolicy: "5 days advance notice required for full deposit return on large event orders.",
      refundPolicy: "50% refund on cancellations made with 5+ days notice."
    },
    averageRating: 5.0,
    reviewCount: 112,
    portfolioImages: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "tailgate-feasts", "homecoming"]
  },
  {
    id: "sample-food-02",
    businessName: "Sweet Magnolia Dessert Bar [SAMPLE]",
    ownerName: "Sample Danielle Moreau",
    category: "Food & Beverages",
    description: "Handcrafted graduation celebration drip cakes, gourmet stuffed cupcakes, Louisiana pecan praline bars, and cold brew coffee catering.",
    instagramUrl: "https://instagram.com/sample.sweetmagnoliabr",
    tiktokUrl: "https://tiktok.com/@sample.sweetmagnoliabr",
    websiteUrl: "https://sample-sweetmagnolia.example.com",
    bookingUrl: "https://sample-booking.example.com/sweetmagnolia",
    startingPrice: 25,
    priceTier: "$",
    yearsExperience: 6,
    studentDiscount: false,
    serviceDelivery: "both",
    availability: "same-day",
    turnaround: null,
    latitude: 30.4490,
    longitude: -91.1490,
    neighborhood: "Mid City",
    lsuVerified: null,
    foodTypes: ["desserts/baked goods", "drinks"],
    campusDropOff: true,
    preOrderRequired: false,
    policies: {
      depositRequired: true,
      depositAmount: "Full payment for express orders; 50% for custom multi-tier cakes",
      cancellationPolicy: "48-hour cancellation policy for custom cake orders.",
      refundPolicy: "Store credit issued if cancellation is placed before baking commencement."
    },
    averageRating: 4.8,
    reviewCount: 74,
    portfolioImages: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["graduation-formal", "celebrations"]
  },
  {
    id: "sample-food-03",
    businessName: "Tigerland BBQ & Loaded Plates [SAMPLE]",
    ownerName: "Sample Deon Jackson",
    category: "Food & Beverages",
    description: "Smoked jerk chicken loaded mac bowls, BBQ brisket sandwiches, and cold Southern lemonade dropped off directly to campus dorms and tailgates.",
    instagramUrl: "https://instagram.com/sample.tigerlandbbq",
    tiktokUrl: "https://tiktok.com/@sample.tigerlandbbq",
    websiteUrl: "https://sample-tigerlandbbq.example.com",
    bookingUrl: "https://sample-booking.example.com/tigerlandbbq",
    startingPrice: 18,
    priceTier: "$",
    yearsExperience: 4,
    studentDiscount: true,
    serviceDelivery: "both",
    availability: "same-day",
    turnaround: null,
    latitude: 30.3980,
    longitude: -91.1740,
    neighborhood: "Tigerland / Burbank",
    lsuVerified: "student",
    foodTypes: ["meals/plates", "drinks"],
    campusDropOff: true,
    preOrderRequired: false,
    policies: {
      depositRequired: false,
      depositAmount: "Pay on order or campus meetup",
      cancellationPolicy: "Orders can be modified within 15 minutes of placing.",
      refundPolicy: "Immediate replacement or refund for incorrect orders."
    },
    averageRating: 4.9,
    reviewCount: 89,
    portfolioImages: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "tailgate-ready", "quick-bites"]
  },

  // =========================================================================
  // 5. FASHION (CUSTOM OUTFITS) PROVIDERS (3 providers)
  // Fields: outfitTypes (game day, formal/prom, graduation, everyday), turnaround
  // =========================================================================
  {
    id: "sample-fashion-01",
    businessName: "Atelier Noire Custom Apparel [SAMPLE]",
    ownerName: "Sample Aliyah Sterling",
    category: "Fashion (Custom Outfits)",
    description: "Bespoke formal gowns, graduation sash embroidery, custom corset tops, and tailor-made homecoming outfits created with luxury fabrics.",
    instagramUrl: "https://instagram.com/sample.ateliernoire",
    tiktokUrl: "https://tiktok.com/@sample.ateliernoire",
    websiteUrl: "https://sample-ateliernoire.example.com",
    bookingUrl: "https://sample-booking.example.com/ateliernoire",
    startingPrice: 180,
    priceTier: "$$$",
    yearsExperience: 6,
    studentDiscount: true,
    serviceDelivery: "studio",
    availability: "bookings-open",
    turnaround: "formal-ready",
    latitude: 30.3850,
    longitude: -91.0850,
    neighborhood: "Bluebonnet / Perkins Rowe",
    lsuVerified: "alumni",
    outfitTypes: ["formal/prom", "graduation"],
    policies: {
      depositRequired: true,
      depositAmount: "50% non-refundable deposit to secure fabric and production slot",
      cancellationPolicy: "Design consultations can be rescheduled up to 48 hours prior.",
      refundPolicy: "All custom garments are non-refundable; includes two fitting alteration sessions."
    },
    averageRating: 4.9,
    reviewCount: 41,
    portfolioImages: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["graduation-formal", "homecoming", "formal-ready"]
  },
  {
    id: "sample-fashion-02",
    businessName: "Tiger Stitches Alterations & Streetwear [SAMPLE]",
    ownerName: "Sample Jordan LeBlanc",
    category: "Fashion (Custom Outfits)",
    description: "Rush formalwear alterations, custom distressed denim, chainstitch embroidery, and custom Greek fraternity & sorority letterman jackets.",
    instagramUrl: "https://instagram.com/sample.tigerstitches",
    tiktokUrl: "https://tiktok.com/@sample.tigerstitches",
    websiteUrl: "https://sample-tigerstitches.example.com",
    bookingUrl: "https://sample-booking.example.com/tigerstitches",
    startingPrice: 40,
    priceTier: "$",
    yearsExperience: 4,
    studentDiscount: true,
    serviceDelivery: "both",
    availability: "open-this-week",
    turnaround: "this-week",
    latitude: 30.4135,
    longitude: -91.1785,
    neighborhood: "LSU Campus Vicinity",
    lsuVerified: "student",
    outfitTypes: ["game day", "everyday"],
    policies: {
      depositRequired: false,
      depositAmount: "No deposit on basic alterations; payment upon completion",
      cancellationPolicy: "Orders must be picked up within 14 days of completion.",
      refundPolicy: "Free re-tailoring adjustment within 7 days of garment delivery."
    },
    averageRating: 4.8,
    reviewCount: 35,
    portfolioImages: [
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["game-day", "greek-life", "rush-ready"]
  },
  {
    id: "sample-fashion-03",
    businessName: "Heritage Haute Stoles & Tailoring [SAMPLE]",
    ownerName: "Sample Camille Broussard",
    category: "Fashion (Custom Outfits)",
    description: "Handcrafted Kente graduation stoles, personalized purple and gold satin game-day corsets, and cocktail dress alterations in Mid City.",
    instagramUrl: "https://instagram.com/sample.heritagehaute",
    tiktokUrl: "https://tiktok.com/@sample.heritagehaute",
    websiteUrl: "https://sample-heritagehaute.example.com",
    bookingUrl: "https://sample-booking.example.com/heritagehaute",
    startingPrice: 95,
    priceTier: "$$",
    yearsExperience: 5,
    studentDiscount: true,
    serviceDelivery: "studio",
    availability: "bookings-open",
    turnaround: "2-weeks",
    latitude: 30.4440,
    longitude: -91.1550,
    neighborhood: "Mid City",
    lsuVerified: "alumni",
    outfitTypes: ["graduation", "formal/prom", "game day"],
    policies: {
      depositRequired: true,
      depositAmount: "30% deposit required on custom orders",
      cancellationPolicy: "Free cancellation within 24 hours of placing order.",
      refundPolicy: "Garment adjustments covered free within 14 days."
    },
    averageRating: 5.0,
    reviewCount: 29,
    portfolioImages: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["graduation", "commencement-ready", "formal-ready"]
  },

  // =========================================================================
  // 6. PHOTOGRAPHY PROVIDERS (3 providers)
  // Fields: shootTypes (graduation, game day, events, portraits, brand content),
  //         travelsToCampus (true/false), turnaround
  // =========================================================================
  {
    id: "sample-photo-01",
    businessName: "Purple Gold Lens Photography [SAMPLE]",
    ownerName: "Sample Xavier Brooks",
    category: "Photography",
    description: "Signature graduation portraits under the LSU Live Oaks and Memorial Tower, dynamic sports action captures, and Greek formal event coverage.",
    instagramUrl: "https://instagram.com/sample.purplegoldlens",
    tiktokUrl: "https://tiktok.com/@sample.purplegoldlens",
    websiteUrl: "https://sample-purplegoldlens.example.com",
    bookingUrl: "https://sample-booking.example.com/purplegoldlens",
    startingPrice: 150,
    priceTier: "$$",
    yearsExperience: 5,
    studentDiscount: true,
    serviceDelivery: "mobile",
    availability: "bookings-open",
    turnaround: "2-weeks",
    latitude: 30.4133,
    longitude: -91.1800,
    neighborhood: "LSU Campus (Memorial Tower)",
    lsuVerified: "student",
    shootTypes: ["graduation", "game day", "portraits"],
    travelsToCampus: true,
    policies: {
      depositRequired: true,
      depositAmount: "$50 booking retainer to secure shoot time and date",
      cancellationPolicy: "Inclement weather rain checks granted at zero extra charge for outdoor campus shoots.",
      refundPolicy: "Retainer non-refundable upon cancellation within 48h; full reshoot offered if client is unsatisfied with gallery proofs."
    },
    averageRating: 5.0,
    reviewCount: 94,
    portfolioImages: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["graduation-formal", "game-day", "senior-portraits"]
  },
  {
    id: "sample-photo-02",
    businessName: "Baton Rouge Studio Luminary [SAMPLE]",
    ownerName: "Sample Terrence Miller",
    category: "Photography",
    description: "High-end studio portraits, professional LinkedIn headshots, editorial fashion lookbooks, and personal branding sessions in Downtown BR.",
    instagramUrl: "https://instagram.com/sample.studyluminary",
    tiktokUrl: "https://tiktok.com/@sample.studyluminary",
    websiteUrl: "https://sample-studyluminary.example.com",
    bookingUrl: "https://sample-booking.example.com/studyluminary",
    startingPrice: 220,
    priceTier: "$$$",
    yearsExperience: 8,
    studentDiscount: false,
    serviceDelivery: "studio",
    availability: "open-this-week",
    turnaround: "this-week",
    latitude: 30.4530,
    longitude: -91.1890,
    neighborhood: "Downtown Baton Rouge",
    lsuVerified: "alumni",
    shootTypes: ["brand content", "portraits", "events"],
    travelsToCampus: false,
    policies: {
      depositRequired: true,
      depositAmount: "30% studio deposit required to reserve studio lighting bay",
      cancellationPolicy: "72-hour notice required to reschedule without re-booking charge.",
      refundPolicy: "Deposits credited toward rescheduled date valid for up to 60 days."
    },
    averageRating: 4.9,
    reviewCount: 68,
    portfolioImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["professional-headshots", "branding", "graduation-formal"]
  },
  {
    id: "sample-photo-03",
    businessName: "Golden Hour Campus Shutter [SAMPLE]",
    ownerName: "Sample Kayla Davis",
    category: "Photography",
    description: "Express golden hour photo sessions around the LSU Lakes, fraternity/sorority tailgates, and celebratory champagne graduation pop portraits.",
    instagramUrl: "https://instagram.com/sample.campusshutter",
    tiktokUrl: "https://tiktok.com/@sample.campusshutter",
    websiteUrl: "https://sample-campusshutter.example.com",
    bookingUrl: "https://sample-booking.example.com/campusshutter",
    startingPrice: 125,
    priceTier: "$",
    yearsExperience: 3,
    studentDiscount: true,
    serviceDelivery: "mobile",
    availability: "same-day",
    turnaround: "this-week",
    latitude: 30.4210,
    longitude: -91.1780,
    neighborhood: "Northgate / Lakeshore",
    lsuVerified: "student",
    shootTypes: ["graduation", "events", "game day"],
    travelsToCampus: true,
    policies: {
      depositRequired: true,
      depositAmount: "$30 deposit required to lock in sunset slot",
      cancellationPolicy: "Free rain check rescheduling for weather conflicts.",
      refundPolicy: "High-resolution digital delivery included; retakes offered within 7 days."
    },
    averageRating: 4.9,
    reviewCount: 51,
    portfolioImages: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
    ],
    seasonalTags: ["graduation", "lsu-lakes", "golden-hour"]
  }
];

export default SAMPLE_PROVIDERS;
