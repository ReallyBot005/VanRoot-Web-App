// VANROOTS — Location Data
// Each location maps to /location/:id

const HERO_IMAGES = {
  shillong: '/shillong_market.png',
  cherrapunji: '/laitlum_sunrise.png',
  mawlynnong: '/mawlynnong_village.png',
  nongriat: '/meghalaya_festival.png',
  dawki: '/dawki_waters.png',
};

const LISTING_IMAGES = {
  community: '/khasi_grandmother.png',
  festival: '/meghalaya_festival.png',
  market: '/shillong_market.png',
  sunrise: '/laitlum_sunrise.png',
  village: '/mawlynnong_village.png',
  water: '/dawki_waters.png',
};

// Cabs configuration reusable across locations for simplicity
const CABS = [
  {
    id: 'cab-sedan',
    title: 'City Explorer Sedan',
    image: LISTING_IMAGES.market,
    price: 2500,
    rating: 4.8,
    reviews: 320,
    tags: ['Sedan', '4 Seats', 'AC'],
    description: 'Comfortable sedan for exploration. Driver verified.',
    cabType: 'sedan'
  },
  {
    id: 'cab-suv',
    title: 'Meghalaya Explorer SUV',
    image: LISTING_IMAGES.market,
    price: 3500,
    rating: 4.9,
    reviews: 410,
    tags: ['SUV', '6 Seats', 'AC'],
    description: 'Spacious SUV perfect for hilly terrain and larger groups.',
    cabType: 'suv'
  },
  {
    id: 'cab-traveller',
    title: 'Group Tempo Traveller',
    image: LISTING_IMAGES.market,
    price: 5000,
    rating: 4.7,
    reviews: 180,
    tags: ['Traveller', '12 Seats', 'AC'],
    description: 'Large tempo traveller for group excursions. Comfort assured.',
    cabType: 'traveller'
  }
];

const GUIDES = [
  {
    id: 'guide-basic',
    title: 'Local Explorer Guide',
    name: 'Banjop Kharshiing',
    image: LISTING_IMAGES.community,
    price: 1800,
    rating: 4.8,
    reviews: 120,
    tags: ['Basic'],
    description: 'Experience: 5 Years. Languages: English, Hindi, Khasi. Duration: 2 Days. Places Covered: Police Bazaar, Ward’s Lake, Shillong Peak.',
    packageDays: 2,
    places: 'Police Bazaar, Ward’s Lake, Shillong Peak',
  },
  {
    id: 'guide-elite',
    title: 'Nature & Culture Specialist',
    name: 'Ribok Lyngdoh',
    image: LISTING_IMAGES.sunrise,
    price: 3500,
    rating: 4.9,
    reviews: 210,
    tags: ['Elite'],
    description: 'Experience: 8 Years. Languages: English, Khasi. Duration: 4 Days. Places Covered: Police Bazaar, Shillong Peak, Elephant Falls, Laitlum Canyon, Mawphlang Forest, Local Khasi Market.',
    packageDays: 4,
    places: 'Police Bazaar, Shillong Peak, Elephant Falls, Laitlum Canyon, Mawphlang Forest, Local Khasi Market',
  },
  {
    id: 'guide-premium',
    title: 'Complete Meghalaya Experience Curator',
    name: 'Evan Suting',
    image: LISTING_IMAGES.village,
    price: 7000,
    rating: 5.0,
    reviews: 89,
    tags: ['Premium'],
    description: 'Experience: 12 Years. Languages: English, Hindi, Khasi, Bengali. Duration: 7 Days. Places Covered: Shillong City Tour, Elephant Falls, Laitlum, Cherrapunji, Nohkalikai Falls, Dawki, Mawlynnong, Nongriat Trek, Living Root Bridge, Cultural Village, Hidden Cafes, Sunrise / Sunset Spots.',
    packageDays: 7,
    places: 'Shillong City Tour, Elephant Falls, Laitlum, Cherrapunji, Nohkalikai Falls, Dawki, Mawlynnong, Nongriat Trek, Living Root Bridge, Cultural Village, Hidden Cafes, Sunrise / Sunset Spots',
  }
];

const locations = {
  shillong: {
    id: 'shillong',
    name: 'Shillong',
    tagline: 'Clouds, Culture & Calm',
    heroImage: HERO_IMAGES.shillong,
    rating: 4.8,
    reviews: 1240,
    description: 'The Scotland of the East — where misty hills meet colonial charm and vibrant Khasi culture.',
    badge: 'Most Popular',
    coordinates: { top: '38%', left: '62%' },
    categories: {
      stays: [
        {
          id: 'sh-stay-1',
          title: 'Misty Pines Retreat',
          image: LISTING_IMAGES.sunrise,
          price: 3200,
          rating: 4.9,
          reviews: 87,
          tags: ['Eco', 'Premium'],
          description: 'Perched above the clouds with panoramic valley views and warm local hospitality.',
        },
        {
          id: 'sh-stay-2',
          title: 'Khasi Heritage Homestay',
          image: LISTING_IMAGES.community,
          price: 1800,
          rating: 4.7,
          reviews: 134,
          tags: ['Local', 'Cultural'],
          description: 'Authentic Khasi family home — sleep, eat, and live the local way.',
        },
      ],
      packages: [
        {
          id: 'sh-pkg-1',
          title: 'Shillong Discovery Escape (Basic)',
          image: LISTING_IMAGES.market,
          price: 5000,
          rating: 4.6,
          reviews: 120,
          tags: ['2 Days', 'Basic'],
          description: 'Cab Included. Guide Included. 2 Days. Places: Police Bazaar, Ward’s Lake, Shillong Peak.',
          packageDays: 2,
          places: 'Police Bazaar, Ward’s Lake, Shillong Peak'
        },
        {
          id: 'sh-pkg-2',
          title: 'Shillong Discovery Escape (Elite)',
          image: LISTING_IMAGES.sunrise,
          price: 12000,
          rating: 4.8,
          reviews: 245,
          tags: ['4 Days', 'Elite'],
          description: 'Cab Included. Guide Included. 4 Days. Places: Police Bazaar, Ward’s Lake, Shillong Peak, Elephant Falls, Laitlum.',
          packageDays: 4,
          places: 'Police Bazaar, Ward’s Lake, Shillong Peak, Elephant Falls, Laitlum'
        },
        {
          id: 'sh-pkg-3',
          title: 'Shillong Discovery Escape (Premium)',
          image: LISTING_IMAGES.community,
          price: 20000,
          rating: 5.0,
          reviews: 89,
          tags: ['7 Days', 'Premium'],
          description: 'Cab Included. Guide Included. 7 Days. Places: Police Bazaar, Ward’s Lake, Shillong Peak, Elephant Falls, Laitlum, Hidden Cafes, Culture Tour, Nearby Villages.',
          packageDays: 7,
          places: 'Police Bazaar, Ward’s Lake, Shillong Peak, Elephant Falls, Laitlum, Hidden Cafes, Culture Tour, Nearby Villages'
        },
      ],
    },
  },

  cherrapunji: {
    id: 'cherrapunji',
    name: 'Cherrapunji',
    tagline: 'Where Rain Meets Wonder',
    heroImage: HERO_IMAGES.cherrapunji,
    rating: 4.9,
    reviews: 987,
    description: 'The wettest place on Earth — home to living root bridges, thundering waterfalls, and infinite mist.',
    badge: 'Nature\'s Best',
    coordinates: { top: '55%', left: '54%' },
    categories: {
      stays: [
        {
          id: 'ch-stay-1',
          title: 'Nohkalikai Mist Lodge',
          image: LISTING_IMAGES.water,
          price: 4200,
          rating: 4.9,
          reviews: 63,
          tags: ['Scenic', 'Premium'],
          description: 'Wake up to India\'s tallest waterfall from your bedroom window.',
        },
      ],
      packages: [
        {
          id: 'ch-pkg-1',
          title: 'Cherrapunji Rain & Falls Trail (Basic)',
          image: LISTING_IMAGES.water,
          price: 4500,
          rating: 4.7,
          reviews: 112,
          tags: ['2 Days', 'Basic'],
          description: 'Cab Included. Guide Included. 2 Days. Places: Nohkalikai Falls, Seven Sisters Falls.',
          packageDays: 2,
          places: 'Nohkalikai Falls, Seven Sisters Falls'
        },
        {
          id: 'ch-pkg-2',
          title: 'Cherrapunji Rain & Falls Trail (Elite)',
          image: LISTING_IMAGES.village,
          price: 9000,
          rating: 4.9,
          reviews: 320,
          tags: ['4 Days', 'Elite'],
          description: 'Cab Included. Guide Included. 4 Days. Places: Nohkalikai Falls, Seven Sisters Falls, Mawsmai Cave, Eco Park.',
          packageDays: 4,
          places: 'Nohkalikai Falls, Seven Sisters Falls, Mawsmai Cave, Eco Park'
        },
        {
          id: 'ch-pkg-3',
          title: 'Cherrapunji Rain & Falls Trail (Premium)',
          image: LISTING_IMAGES.water,
          price: 16000,
          rating: 5.0,
          reviews: 75,
          tags: ['7 Days', 'Premium'],
          description: 'Cab Included. Guide Included. 7 Days. Places: Nohkalikai Falls, Seven Sisters Falls, Mawsmai Cave, Eco Park, Dawki Add-on, Hidden Trails, Sunset Points.',
          packageDays: 7,
          places: 'Nohkalikai Falls, Seven Sisters Falls, Mawsmai Cave, Eco Park, Dawki Add-on, Hidden Trails, Sunset Points'
        },
      ],
    },
  },

  mawlynnong: {
    id: 'mawlynnong',
    name: 'Mawlynnong',
    tagline: 'Asia\'s Cleanest Village',
    heroImage: HERO_IMAGES.mawlynnong,
    rating: 4.7,
    reviews: 654,
    description: 'A hidden masterpiece — bamboo pathways, hanging sky walks, and the purest air in northeast India.',
    badge: 'Hidden Gem',
    coordinates: { top: '66%', left: '70%' },
    categories: {
      stays: [
        {
          id: 'mw-stay-1',
          title: 'Sky Walk Bamboo Cottage',
          image: LISTING_IMAGES.village,
          price: 2800,
          rating: 4.8,
          reviews: 72,
          tags: ['Eco', 'Unique'],
          description: 'Handcrafted bamboo cottage with a private sky walk over the forest canopy.',
        },
      ],
      packages: [
        {
          id: 'mw-pkg-1',
          title: 'Cleanest Village Cultural Retreat (Basic)',
          image: LISTING_IMAGES.village,
          price: 4000,
          rating: 4.7,
          reviews: 80,
          tags: ['2 Days', 'Basic'],
          description: 'Cab Included. Guide Included. 2 Days. Places: Village Walk, Sky Viewpoint.',
          packageDays: 2,
          places: 'Village Walk, Sky Viewpoint'
        },
        {
          id: 'mw-pkg-2',
          title: 'Cleanest Village Cultural Retreat (Elite)',
          image: LISTING_IMAGES.sunrise,
          price: 8500,
          rating: 4.9,
          reviews: 150,
          tags: ['4 Days', 'Elite'],
          description: 'Cab Included. Guide Included. 4 Days. Places: Village Walk, Sky Viewpoint, Local Food Trail, Bamboo Walk.',
          packageDays: 4,
          places: 'Village Walk, Sky Viewpoint, Local Food Trail, Bamboo Walk'
        },
        {
          id: 'mw-pkg-3',
          title: 'Cleanest Village Cultural Retreat (Premium)',
          image: LISTING_IMAGES.festival,
          price: 15000,
          rating: 5.0,
          reviews: 45,
          tags: ['7 Days', 'Premium'],
          description: 'Cab Included. Guide Included. 7 Days. Places: Village Walk, Sky Viewpoint, Local Food Trail, Bamboo Walk, Dawki River, Community Stay, Handicrafts Tour.',
          packageDays: 7,
          places: 'Village Walk, Sky Viewpoint, Local Food Trail, Bamboo Walk, Dawki River, Community Stay, Handicrafts Tour'
        },
      ],
    },
  },

  nongriat: {
    id: 'nongriat',
    name: 'Nongriat',
    tagline: 'Living Root Bridges',
    heroImage: HERO_IMAGES.nongriat,
    rating: 4.9,
    reviews: 1102,
    description: 'A jungle sanctuary only accessible by foot, home to the iconic Double Decker Living Root Bridge.',
    badge: 'Adventure',
    coordinates: { top: '70%', left: '65%' },
    categories: {
      stays: [
        {
          id: 'nr-stay-1',
          title: 'Jungle Canopy Homestay',
          image: LISTING_IMAGES.water,
          price: 1500,
          rating: 4.8,
          reviews: 118,
          tags: ['Camping', 'Scenic'],
          description: 'Basic local homestay right next to the crystal clear pools and root bridges.',
        },
      ],
      packages: [
        {
          id: 'nr-pkg-1',
          title: 'Living Root Bridge Expedition (Basic)',
          image: LISTING_IMAGES.water,
          price: 3500,
          rating: 4.8,
          reviews: 210,
          tags: ['2 Days', 'Basic'],
          description: 'Cab Included. Guide Included. 2 Days. Places: Double Decker Bridge.',
          packageDays: 2,
          places: 'Double Decker Bridge'
        },
        {
          id: 'nr-pkg-2',
          title: 'Living Root Bridge Expedition (Elite)',
          image: LISTING_IMAGES.water,
          price: 8000,
          rating: 4.9,
          reviews: 180,
          tags: ['4 Days', 'Elite'],
          description: 'Cab Included. Guide Included. 4 Days. Places: Double Decker Bridge, Rainbow Falls, Trek Extension.',
          packageDays: 4,
          places: 'Double Decker Bridge, Rainbow Falls, Trek Extension'
        },
        {
          id: 'nr-pkg-3',
          title: 'Living Root Bridge Expedition (Premium)',
          image: LISTING_IMAGES.market,
          price: 16000,
          rating: 5.0,
          reviews: 90,
          tags: ['7 Days', 'Premium'],
          description: 'Cab Included. Guide Included. 7 Days. Places: Double Decker Bridge, Rainbow Falls, Trek Extension, Camping, Hidden Pools, Local Trek Guide Journey.',
          packageDays: 7,
          places: 'Double Decker Bridge, Rainbow Falls, Trek Extension, Camping, Hidden Pools, Local Trek Guide Journey'
        },
      ],
    },
  },

  dawki: {
    id: 'dawki',
    name: 'Dawki',
    tagline: 'Crystal Waters & Serenity',
    heroImage: HERO_IMAGES.dawki,
    rating: 4.8,
    reviews: 840,
    description: 'Crystal waters, border beauty, riverside escapes. Experience the magic of the Umngot River.',
    badge: 'Riverside Bliss',
    coordinates: { top: '72%', left: '63%' },
    categories: {
      stays: [
        {
          id: 'dk-stay-1',
          title: 'Umngot Riverside Camp',
          image: LISTING_IMAGES.water,
          price: 2500,
          rating: 4.8,
          reviews: 56,
          tags: ['Riverside', 'Eco'],
          description: 'Sleep by the crystal clear Umngot River under a thousand stars.',
        },
        {
          id: 'dk-stay-2',
          title: 'Dawki Heritage Homestay',
          image: LISTING_IMAGES.community,
          price: 2200,
          rating: 4.7,
          reviews: 42,
          tags: ['Heritage', 'Local'],
          description: 'Experience local Khasi hospitality in the heart of Dawki.',
        },
      ],
      packages: [
        {
          id: 'dk-pkg-1',
          title: 'Dawki Waters & Border Trail (Basic)',
          image: LISTING_IMAGES.water,
          price: 4000,
          rating: 4.7,
          reviews: 95,
          tags: ['2 Days', 'Basic'],
          description: 'Cab Included. Guide Included. 2 Days. Places: Boating on Umngot River, Tamabil Border.',
          packageDays: 2,
          places: 'Boating on Umngot River, Tamabil Border'
        },
        {
          id: 'dk-pkg-2',
          title: 'Dawki Waters & Border Trail (Elite)',
          image: LISTING_IMAGES.sunrise,
          price: 9500,
          rating: 4.9,
          reviews: 140,
          tags: ['4 Days', 'Elite'],
          description: 'Cab Included. Guide Included. 4 Days. Places: Umngot River, Tamabil Border, Byrdaw Falls, Shnongpdeng Camping.',
          packageDays: 4,
          places: 'Umngot River, Tamabil Border, Byrdaw Falls, Shnongpdeng Camping'
        },
        {
          id: 'dk-pkg-3',
          title: 'Dawki Waters & Border Trail (Premium)',
          image: LISTING_IMAGES.water,
          price: 18000,
          rating: 5.0,
          reviews: 62,
          tags: ['7 Days', 'Premium'],
          description: 'Cab Included. Guide Included. 7 Days. Places: Complete Dawki Experience, Shnongpdeng, Scuba Diving, Cliff Jumping, Border Visit, Nearby Khasi Villages.',
          packageDays: 7,
          places: 'Complete Dawki Experience, Shnongpdeng, Scuba Diving, Cliff Jumping, Border Visit, Nearby Khasi Villages'
        },
      ],
    },
  },
};

export default locations;
