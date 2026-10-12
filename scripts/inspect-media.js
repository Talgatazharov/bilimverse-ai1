const sharp = require('sharp');

async function inspectMedia() {
  const m1 = await sharp('C:/Users/Aqparat7/.gemini/antigravity/brain/5fc40780-0863-46b3-9c6f-6f22d34661f9/.user_uploaded/media_1791825295720_9aaecca7.jpg').metadata();
  console.log('media 1 (screenshot/board):', m1.width, 'x', m1.height);
  const m2 = await sharp('C:/Users/Aqparat7/.gemini/antigravity/brain/5fc40780-0863-46b3-9c6f-6f22d34661f9/.user_uploaded/media_1791827611264_f1f2a400.jpg').metadata();
  console.log('media 2 (asset sheet):', m2.width, 'x', m2.height);
}
inspectMedia();
