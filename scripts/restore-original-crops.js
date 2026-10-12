const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC_IMG = 'C:/Users/Aqparat7/.gemini/antigravity/brain/5fc40780-0863-46b3-9c6f-6f22d34661f9/.user_uploaded/media_1791825295720_9aaecca7.jpg';

async function restoreOriginalCrops() {
  console.log('Restoring original clean crops from media 1...');
  
  if (!fs.existsSync('public/world')) fs.mkdirSync('public/world', { recursive: true });
  if (!fs.existsSync('public/world/regions')) fs.mkdirSync('public/world/regions', { recursive: true });
  if (!fs.existsSync('public/pets/qyran')) fs.mkdirSync('public/pets/qyran', { recursive: true });

  // 1. Main World Map (clean unified fantasy landscape)
  await sharp(SRC_IMG)
    .extract({ left: 0, top: 0, width: 580, height: 258 })
    .png()
    .toFile('public/world/main-map.png');
  console.log('✓ Restored: public/world/main-map.png');

  // 2. Original Region Cards Artwork for subject cards
  const regions = [
    { name: 'sandar-patshalygy.png', left: 588, top: 30, width: 142, height: 105 },
    { name: 'sozder-ormany.png', left: 733, top: 30, width: 142, height: 105 },
    { name: 'ertegiler-eli.png', left: 878, top: 30, width: 142, height: 105 },
    { name: 'zertteushiler-araly.png', left: 588, top: 145, width: 142, height: 105 },
    { name: 'english-town.png', left: 733, top: 145, width: 142, height: 105 },
    { name: 'digital-city.png', left: 878, top: 145, width: 142, height: 105 },
  ];

  for (const r of regions) {
    await sharp(SRC_IMG)
      .extract({ left: r.left, top: r.top, width: r.width, height: r.height })
      .png()
      .toFile(path.join('public/world/regions', r.name));
    console.log(`✓ Restored: public/world/regions/${r.name}`);
  }

  // 3. Original clean Qyran from step 150
  await sharp(SRC_IMG)
    .extract({ left: 248, top: 275, width: 125, height: 145 })
    .png()
    .toFile('public/pets/qyran/qyran-hero.png');

  await sharp(SRC_IMG)
    .extract({ left: 345, top: 345, width: 45, height: 45 })
    .png()
    .toFile('public/pets/qyran/qyran-flying.png');

  await sharp(SRC_IMG)
    .extract({ left: 375, top: 285, width: 45, height: 45 })
    .png()
    .toFile('public/pets/qyran/qyran-idle.png');

  await sharp(SRC_IMG)
    .extract({ left: 425, top: 285, width: 45, height: 45 })
    .png()
    .toFile('public/pets/qyran/qyran-happy.png');

  await sharp(SRC_IMG)
    .extract({ left: 475, top: 285, width: 45, height: 45 })
    .png()
    .toFile('public/pets/qyran/qyran-thinking.png');

  await sharp(SRC_IMG)
    .extract({ left: 395, top: 345, width: 45, height: 45 })
    .png()
    .toFile('public/pets/qyran/qyran-explaining.png');

  await sharp(SRC_IMG)
    .extract({ left: 440, top: 345, width: 45, height: 45 })
    .png()
    .toFile('public/pets/qyran/qyran-celebrating.png');

  await sharp(SRC_IMG)
    .extract({ left: 485, top: 345, width: 45, height: 45 })
    .png()
    .toFile('public/pets/qyran/qyran-sleeping.png');

  console.log('🎉 Original clean crops successfully restored!');
}

restoreOriginalCrops().catch(console.error);
