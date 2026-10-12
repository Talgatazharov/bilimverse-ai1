const sharp = require('sharp');
const fs = require('fs');

async function check() {
  const meta = await sharp('public/world/main-map.png').metadata();
  console.log('main-map.png:', meta.width, 'x', meta.height, meta.format);
}
check();
