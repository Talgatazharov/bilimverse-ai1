const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const REF_IMG = path.resolve('C:/Users/Aqparat7/.gemini/antigravity/brain/5fc40780-0863-46b3-9c6f-6f22d34661f9/.user_uploaded/media_1791827611264_f1f2a400.jpg');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Remove dark background from raw pixel buffer via edge-connected BFS.
 * @param {Buffer} rawBuffer 
 * @param {number} width 
 * @param {number} height 
 * @param {object} options
 */
function removeBackground(rawBuffer, width, height, options = {}) {
  const {
    darkThreshold = 45,
    colorTolerance = 38,
    feather = true,
  } = options;

  const out = Buffer.alloc(width * height * 4);
  const visited = new Uint8Array(width * height);
  const queue = [];

  function getPixel(x, y) {
    const idx = (y * width + x) * 3;
    return {
      r: rawBuffer[idx],
      g: rawBuffer[idx + 1],
      b: rawBuffer[idx + 2],
    };
  }

  // Sample edge colors
  const edgeSamples = [
    getPixel(0, 0),
    getPixel(width - 1, 0),
    getPixel(0, height - 1),
    getPixel(width - 1, height - 1),
    getPixel(Math.floor(width / 2), 0),
    getPixel(0, Math.floor(height / 2)),
    getPixel(width - 1, Math.floor(height / 2)),
    getPixel(Math.floor(width / 2), height - 1),
  ];

  function isBackground(x, y) {
    const { r, g, b } = getPixel(x, y);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < darkThreshold) return true;

    for (const bg of edgeSamples) {
      const dist = Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2);
      if (dist < colorTolerance) return true;
    }
    return false;
  }

  // Seed border pixels
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const idx = y * width + x;
      if (!visited[idx] && isBackground(x, y)) {
        visited[idx] = 1;
        queue.push((y << 16) | x);
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      const idx = y * width + x;
      if (!visited[idx] && isBackground(x, y)) {
        visited[idx] = 1;
        queue.push((y << 16) | x);
      }
    }
  }

  // BFS
  const dx = [0, 0, 1, -1];
  const dy = [1, -1, 0, 0];
  let head = 0;

  while (head < queue.length) {
    const val = queue[head++];
    const x = val & 0xffff;
    const y = val >>> 16;

    for (let i = 0; i < 4; i++) {
      const nx = x + dx[i];
      const ny = y + dy[i];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && isBackground(nx, ny)) {
          visited[nIdx] = 1;
          queue.push((ny << 16) | nx);
        }
      }
    }
  }

  // Render out RGBA
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const inIdx = (y * width + x) * 3;
      const outIdx = (y * width + x) * 4;
      const r = rawBuffer[inIdx];
      const g = rawBuffer[inIdx + 1];
      const b = rawBuffer[inIdx + 2];
      const isBg = visited[y * width + x] === 1;

      if (isBg) {
        out[outIdx] = 0;
        out[outIdx + 1] = 0;
        out[outIdx + 2] = 0;
        out[outIdx + 3] = 0;
      } else {
        out[outIdx] = r;
        out[outIdx + 1] = g;
        out[outIdx + 2] = b;

        // Check if near border for anti-aliasing
        if (feather) {
          let nearBg = false;
          for (let i = 0; i < 4; i++) {
            const nx = x + dx[i];
            const ny = y + dy[i];
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (visited[ny * width + nx] === 1) {
                nearBg = true;
                break;
              }
            }
          }
          if (nearBg) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const alpha = Math.min(255, Math.max(70, Math.round(lum * 2.2)));
            out[outIdx + 3] = alpha;
          } else {
            out[outIdx + 3] = 255;
          }
        } else {
          out[outIdx + 3] = 255;
        }
      }
    }
  }

  return out;
}

/**
 * Extract an asset, optionally remove background, upscale 2x Lanczos for crispness, and save as WebP & PNG.
 */
async function extractAsset(cropBox, outBase, options = {}) {
  const {
    transparent = true,
    scale = 2,
    darkThreshold = 45,
    colorTolerance = 38,
  } = options;

  const cropped = await sharp(REF_IMG)
    .extract(cropBox)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let outBuffer;
  let channels = 3;

  if (transparent) {
    outBuffer = removeBackground(cropped.data, cropped.info.width, cropped.info.height, {
      darkThreshold,
      colorTolerance,
    });
    channels = 4;
  } else {
    outBuffer = cropped.data;
  }

  const targetWidth = Math.round(cropBox.width * scale);
  const targetHeight = Math.round(cropBox.height * scale);

  const pipeline = sharp(outBuffer, {
    raw: {
      width: cropped.info.width,
      height: cropped.info.height,
      channels: channels,
    },
  }).resize(targetWidth, targetHeight, {
    kernel: sharp.kernel.lanczos3,
    fit: 'fill',
  });

  // Save PNG
  await pipeline.clone().png({ quality: 100, compressionLevel: 9 }).toFile(`${outBase}.png`);
  // Save WebP
  await pipeline.clone().webp({ quality: 95, lossless: transparent }).toFile(`${outBase}.webp`);

  console.log(`✓ Generated: ${path.basename(outBase)}.png & .webp (${targetWidth}x${targetHeight})`);
}

async function main() {
  console.log('🚀 Extracting all clean reference assets with sharp...');

  // 1. QYRAN STATES
  ensureDir('public/assets/qyran');
  // Idle
  await extractAsset({ left: 10, top: 38, width: 95, height: 95 }, 'public/assets/qyran/idle', { darkThreshold: 45, colorTolerance: 35 });
  // Happy
  await extractAsset({ left: 100, top: 32, width: 115, height: 100 }, 'public/assets/qyran/happy', { darkThreshold: 45, colorTolerance: 35 });
  // Thinking
  await extractAsset({ left: 216, top: 24, width: 80, height: 108 }, 'public/assets/qyran/thinking', { darkThreshold: 45, colorTolerance: 35 });
  // Explaining
  await extractAsset({ left: 295, top: 24, width: 105, height: 108 }, 'public/assets/qyran/explaining', { darkThreshold: 45, colorTolerance: 35 });
  // Celebrating
  await extractAsset({ left: 395, top: 22, width: 100, height: 110 }, 'public/assets/qyran/celebrating', { darkThreshold: 45, colorTolerance: 35 });
  // Sleeping
  await extractAsset({ left: 485, top: 46, width: 115, height: 86 }, 'public/assets/qyran/sleeping', { darkThreshold: 45, colorTolerance: 35 });

  // Also copy to public/pets/qyran for backward compatibility
  ensureDir('public/pets/qyran');
  for (const s of ['idle', 'happy', 'thinking', 'explaining', 'celebrating', 'sleeping']) {
    fs.copyFileSync(`public/assets/qyran/${s}.png`, `public/pets/qyran/qyran-${s}.png`);
  }

  // 2. AVATARS
  ensureDir('public/assets/avatars');
  // Boy
  await extractAsset({ left: 622, top: 26, width: 74, height: 115 }, 'public/assets/avatars/boy', { darkThreshold: 55, colorTolerance: 40 });
  // Girl
  await extractAsset({ left: 698, top: 26, width: 74, height: 115 }, 'public/assets/avatars/girl', { darkThreshold: 55, colorTolerance: 40 });
  ensureDir('public/characters');
  fs.copyFileSync('public/assets/avatars/boy.png', 'public/characters/boy-explorer.png');
  fs.copyFileSync('public/assets/avatars/girl.png', 'public/characters/girl-explorer.png');

  // 3. WORLD REGIONS EXTRACTION DISABLED
  // (Reference sheet is not used for automated world map crop; clean unified background & React overlay markers are used instead)

  // 4. REWARDS / CHESTS
  ensureDir('public/assets/rewards');
  // Closed chest
  await extractAsset({ left: 726, top: 515, width: 88, height: 120 }, 'public/assets/rewards/chest-closed', { darkThreshold: 55, colorTolerance: 40 });
  // Opening chest
  await extractAsset({ left: 818, top: 515, width: 92, height: 120 }, 'public/assets/rewards/chest-opening', { darkThreshold: 55, colorTolerance: 40 });
  // Open chest
  await extractAsset({ left: 912, top: 515, width: 102, height: 120 }, 'public/assets/rewards/chest-open', { darkThreshold: 55, colorTolerance: 40 });

  ensureDir('public/ui');
  fs.copyFileSync('public/assets/rewards/chest-closed.png', 'public/ui/chest-wood.png');
  fs.copyFileSync('public/assets/rewards/chest-opening.png', 'public/ui/chest-silver.png');
  fs.copyFileSync('public/assets/rewards/chest-open.png', 'public/ui/chest-gold.png');
  fs.copyFileSync('public/assets/rewards/chest-open.png', 'public/ui/chest-legendary.png');

  // 5. BUILDINGS (MY WORLD)
  ensureDir('public/assets/buildings');
  const buildings = [
    { name: 'yurt', left: 10, top: 512, width: 82, height: 118 },
    { name: 'library', left: 94, top: 512, width: 80, height: 118 },
    { name: 'workshop', left: 176, top: 512, width: 80, height: 118 },
    { name: 'stables', left: 258, top: 512, width: 84, height: 118 },
    { name: 'garden', left: 344, top: 512, width: 84, height: 118 },
    { name: 'observatory', left: 430, top: 512, width: 88, height: 118 },
    { name: 'science-center', left: 520, top: 512, width: 92, height: 118 },
    { name: 'watermill', left: 614, top: 512, width: 94, height: 118 },
  ];

  ensureDir('public/buildings');
  for (const b of buildings) {
    await extractAsset({ left: b.left, top: b.top, width: b.width, height: b.height }, `public/assets/buildings/${b.name}`, { darkThreshold: 55, colorTolerance: 40 });
    fs.copyFileSync(`public/assets/buildings/${b.name}.png`, `public/buildings/${b.name}.png`);
  }

  // 6. NATURE ELEMENTS
  ensureDir('public/assets/world/nature');
  // Bridge
  await extractAsset({ left: 824, top: 388, width: 88, height: 75 }, 'public/assets/world/nature/bridge', { darkThreshold: 55, colorTolerance: 40 });
  // Floating mini-island
  await extractAsset({ left: 894, top: 248, width: 65, height: 70 }, 'public/assets/world/nature/floating-island', { darkThreshold: 55, colorTolerance: 40 });
  // Waterfall
  await extractAsset({ left: 830, top: 338, width: 95, height: 60 }, 'public/assets/world/nature/waterfall', { darkThreshold: 55, colorTolerance: 40 });
  // Trees
  await extractAsset({ left: 770, top: 360, width: 55, height: 100 }, 'public/assets/world/nature/trees', { darkThreshold: 55, colorTolerance: 40 });

  console.log('🎉 All assets successfully rebuilt and polished!');
}

main().catch(console.error);
