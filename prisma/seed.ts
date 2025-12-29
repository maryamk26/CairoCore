import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a default user first (places need a creator)
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@cairocore.com' },
    update: {},
    create: {
      email: 'admin@cairocore.com',
      username: 'cairocore_admin',
      name: 'CairoCore Admin',
      bio: 'Official CairoCore account',
      isPrivate: false,
    },
  })

  console.log('✅ Created default user')

  // Real Cairo places with comprehensive data
  const places = [
    {
      title: 'Pyramids of Giza and Sphinx',
      description: 'The last surviving wonder of the ancient world. Stand in awe before the Great Pyramid of Khufu, explore the mysterious Sphinx, and walk through 4,500 years of history. A must-visit that will absolutely blow your mind.',
      images: ['/images/places/pyramids.jpeg'],
      latitude: 29.9792,
      longitude: 31.1342,
      address: 'Al Haram, Giza Governorate, Egypt',
      vibe: ['historical', 'photography', 'cultural', 'adventure'],
      workingHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
        saturday: { open: '08:00', close: '17:00' },
        sunday: { open: '08:00', close: '17:00' },
      },
      entryFees: 540,
      cameraFees: 300,
      bestTime: {
        seasons: ['winter', 'spring'],
        timeOfDay: ['morning', 'afternoon'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Grand Egyptian Museum',
      description: 'The world\'s largest archaeological museum dedicated to a single civilization. Home to over 100,000 artifacts including the complete Tutankhamun collection. Modern, air-conditioned, and absolutely stunning. Worth every penny!',
      images: ['/images/places/grandm.jpeg'],
      latitude: 30.0081,
      longitude: 31.1322,
      address: 'Cairo-Alexandria Desert Rd, Kafr Nassar, Al Giza Desert, Giza',
      vibe: ['historical', 'cultural', 'modern', 'photography'],
      workingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '18:00' },
      },
      entryFees: 600,
      cameraFees: 0,
      bestTime: {
        seasons: ['all'],
        timeOfDay: ['morning', 'afternoon'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Khan el-Khalili Bazaar',
      description: 'Cairo\'s most famous marketplace dating back to 1382. Get lost in the maze of shops selling everything from spices to jewelry. Perfect for shopping, people watching, and soaking in authentic Cairo vibes. Don\'t forget to haggle!',
      images: ['/images/places/khan.jpeg'],
      latitude: 30.0479,
      longitude: 31.2626,
      address: 'El-Gamaleya, Cairo Governorate, Egypt',
      vibe: ['cultural', 'shopping', 'photography', 'adventure'],
      workingHours: {
        monday: { open: '09:00', close: '23:00' },
        tuesday: { open: '09:00', close: '23:00' },
        wednesday: { open: '09:00', close: '23:00' },
        thursday: { open: '09:00', close: '23:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '09:00', close: '23:00' },
        sunday: { open: '09:00', close: '23:00' },
      },
      entryFees: 0,
      cameraFees: 0,
      bestTime: {
        seasons: ['all'],
        timeOfDay: ['afternoon', 'evening'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Cairo Tower',
      description: 'Iconic 187-meter tower offering 360° views of Cairo. Perfect for sunset photos and getting a bird\'s-eye view of the city. The rotating restaurant at the top is a vibe! Best spot for couples and photographers.',
      images: ['/images/places/cairotower.jpeg'],
      latitude: 30.0456,
      longitude: 31.2242,
      address: 'Zamalek, Cairo Governorate, Egypt',
      vibe: ['modern', 'romantic', 'photography'],
      workingHours: {
        monday: { open: '09:00', close: '01:00' },
        tuesday: { open: '09:00', close: '01:00' },
        wednesday: { open: '09:00', close: '01:00' },
        thursday: { open: '09:00', close: '01:00' },
        friday: { open: '09:00', close: '01:00' },
        saturday: { open: '09:00', close: '01:00' },
        sunday: { open: '09:00', close: '01:00' },
      },
      entryFees: 200,
      cameraFees: 0,
      bestTime: {
        seasons: ['all'],
        timeOfDay: ['evening', 'night'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Al-Azhar Park',
      description: 'A stunning 30-hectare green oasis in the heart of historic Cairo. Perfect for picnics, walking, and chilling with friends. Amazing views of the city, beautiful gardens, and great restaurants. Super family and pet friendly!',
      images: ['/images/backgrounds/home1.jpg'],
      latitude: 30.0407,
      longitude: 31.2629,
      address: 'Salah Salem St, Cairo Governorate, Egypt',
      vibe: ['nature', 'romantic', 'photography'],
      workingHours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '22:00' },
        saturday: { open: '09:00', close: '22:00' },
        sunday: { open: '09:00', close: '22:00' },
      },
      entryFees: 20,
      cameraFees: 0,
      bestTime: {
        seasons: ['spring', 'winter'],
        timeOfDay: ['morning', 'afternoon', 'evening'],
      },
      petsFriendly: true,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Egyptian Museum (Tahrir)',
      description: 'The OG museum in downtown Cairo housing over 120,000 ancient Egyptian artifacts. A bit old school but packed with treasures. Home to the famous golden mask of Tutankhamun and countless mummies. History buffs will love this!',
      images: ['/images/backgrounds/aboutbg.jpg'],
      latitude: 30.0478,
      longitude: 31.2336,
      address: 'Meret Basha, Ismailia, Cairo Governorate, Egypt',
      vibe: ['historical', 'cultural', 'photography'],
      workingHours: {
        monday: { open: '09:00', close: '19:00' },
        tuesday: { open: '09:00', close: '19:00' },
        wednesday: { open: '09:00', close: '19:00' },
        thursday: { open: '09:00', close: '19:00' },
        friday: { open: '09:00', close: '19:00' },
        saturday: { open: '09:00', close: '19:00' },
        sunday: { open: '09:00', close: '19:00' },
      },
      entryFees: 450,
      cameraFees: 50,
      bestTime: {
        seasons: ['all'],
        timeOfDay: ['morning', 'afternoon'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Citadel of Saladin',
      description: 'Medieval Islamic fortress with breathtaking views and stunning mosques. The Muhammad Ali Mosque inside is absolutely gorgeous. Rich history, beautiful architecture, and amazing photo ops. A must-see for culture lovers!',
      images: ['/images/backgrounds/searchbg.jpg'],
      latitude: 30.0296,
      longitude: 31.2600,
      address: 'Al Abageyah, Qism El-Khalifa, Cairo Governorate, Egypt',
      vibe: ['historical', 'cultural', 'photography'],
      workingHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
        saturday: { open: '08:00', close: '17:00' },
        sunday: { open: '08:00', close: '17:00' },
      },
      entryFees: 180,
      cameraFees: 0,
      bestTime: {
        seasons: ['winter', 'spring'],
        timeOfDay: ['morning', 'afternoon'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Cairo Opera House',
      description: 'Egypt\'s main performing arts venue in the heart of Zamalek. Catch world-class performances, concerts, and cultural events. Modern, elegant, and perfect for a fancy night out. Great for date nights and culture enthusiasts!',
      images: ['/images/backgrounds/authbg.jpg'],
      latitude: 30.0428,
      longitude: 31.2244,
      address: 'Gezira, Cairo Governorate, Egypt',
      vibe: ['modern', 'cultural', 'romantic'],
      workingHours: {
        monday: { open: '10:00', close: '23:00' },
        tuesday: { open: '10:00', close: '23:00' },
        wednesday: { open: '10:00', close: '23:00' },
        thursday: { open: '10:00', close: '23:00' },
        friday: { open: '10:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '23:00' },
      },
      entryFees: 300,
      cameraFees: 0,
      bestTime: {
        seasons: ['all'],
        timeOfDay: ['evening', 'night'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'Nile River Cruise',
      description: 'Experience Cairo from the water! Cruise down the Nile with dinner, live entertainment, and stunning city views. Perfect for special occasions and romantic evenings. Book in advance for the best experience!',
      images: ['/images/backgrounds/home1.jpg'],
      latitude: 30.0444,
      longitude: 31.2357,
      address: 'Nile Corniche, Cairo Governorate, Egypt',
      vibe: ['romantic', 'modern', 'adventure'],
      workingHours: {
        monday: { open: '19:00', close: '23:00' },
        tuesday: { open: '19:00', close: '23:00' },
        wednesday: { open: '19:00', close: '23:00' },
        thursday: { open: '19:00', close: '23:00' },
        friday: { open: '19:00', close: '23:00' },
        saturday: { open: '19:00', close: '23:00' },
        sunday: { open: '19:00', close: '23:00' },
      },
      entryFees: 800,
      cameraFees: 0,
      bestTime: {
        seasons: ['all'],
        timeOfDay: ['evening', 'night'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
    {
      title: 'City Stars Mall',
      description: 'The largest shopping mall in Cairo and one of the biggest in Africa. Over 750 stores, restaurants, cinema, and entertainment. Perfect for shopping sprees, hanging out, and escaping the heat. Super modern and clean!',
      images: ['/images/backgrounds/aboutbg.jpg'],
      latitude: 30.0726,
      longitude: 31.3456,
      address: 'Nasr City, Cairo Governorate, Egypt',
      vibe: ['shopping', 'modern'],
      workingHours: {
        monday: { open: '10:00', close: '00:00' },
        tuesday: { open: '10:00', close: '00:00' },
        wednesday: { open: '10:00', close: '00:00' },
        thursday: { open: '10:00', close: '00:00' },
        friday: { open: '10:00', close: '00:00' },
        saturday: { open: '10:00', close: '00:00' },
        sunday: { open: '10:00', close: '00:00' },
      },
      entryFees: 0,
      cameraFees: 0,
      bestTime: {
        seasons: ['all'],
        timeOfDay: ['afternoon', 'evening'],
      },
      petsFriendly: false,
      kidsFriendly: true,
      status: 'approved',
      createdBy: defaultUser.id,
    },
  ]

  // Insert all places
  for (const placeData of places) {
    const existingPlace = await prisma.place.findFirst({
      where: { title: placeData.title },
    })
    
    if (existingPlace) {
      console.log(`⏭️  Skipping (already exists): ${placeData.title}`)
      continue
    }
    
    const place = await prisma.place.create({
      data: placeData,
    })
    console.log(`✅ Created: ${place.title}`)
  }

  console.log('🎉 Database seeded successfully!')
  console.log(`📍 Added ${places.length} places to the database`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

