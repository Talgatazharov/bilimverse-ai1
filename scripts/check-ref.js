const fs = require('fs');

// We have the 1024x682 reference image:
const refPath = 'C:/Users/Aqparat7/.gemini/antigravity/brain/5fc40780-0863-46b3-9c6f-6f22d34661f9/.user_uploaded/media_1791827611264_f1f2a400.jpg';

console.log('Reference exists:', fs.existsSync(refPath));
