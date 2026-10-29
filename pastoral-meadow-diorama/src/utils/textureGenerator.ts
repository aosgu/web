// Procedural canvas texture generator for the meadow / desert / island dioramas

import { SceneTheme } from '../types';

/**
 * Fade and stipple the outside of the diorama so every landscape reads
 * as a hand-painted patch of land floating on warm paper.
 */
function stippleDioramaBorder(ctx: CanvasRenderingContext2D, size: number, _pad = size * 0.105) {
  const mask = document.createElement('canvas');
  mask.width = size;
  mask.height = size;
  const m = mask.getContext('2d');
  if (!m) return;

  const blobPath = (target: CanvasRenderingContext2D) => {
    const steps = 220;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const ex = Math.sign(cos) * Math.pow(Math.abs(cos), 0.62);
      const ey = Math.sign(sin) * Math.pow(Math.abs(sin), 0.62);
      const wobble = 1 + Math.sin(angle * 5.3) * 0.022 + Math.cos(angle * 9.1 + 1.4) * 0.016;
      const x = size * 0.5 + ex * size * 0.446 * wobble;
      const y = size * 0.5 + ey * size * 0.445 * wobble;
      if (i === 0) target.moveTo(x, y);
      else target.lineTo(x, y);
    }
    target.closePath();
  };

  m.fillStyle = '#ffffff';
  m.beginPath();
  blobPath(m);
  m.fill();

  // Painted brush fringe: thousands of dots straddling the outline.
  for (let i = 0; i < 13000; i++) {
    const angle = Math.random() * Math.PI * 2;
    const edgeFactor = Math.random();
    const depth = size * (0.405 + edgeFactor * 0.084);
    const wobble = 1 + Math.sin(angle * 5.3) * 0.022 + Math.cos(angle * 9.1 + 1.4) * 0.016;
    const ex = Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), 0.62);
    const ey = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), 0.62);
    const x = size * 0.5 + ex * depth * wobble;
    const y = size * 0.5 + ey * depth * wobble;
    const r = 2 + Math.pow(Math.random(), 2.4) * 24;
    m.fillStyle = `rgba(255,255,255,${0.5 + Math.random() * 0.5})`;
    m.beginPath();
    m.arc(x, y, r, 0, Math.PI * 2);
    m.fill();
  }

  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.filter = 'blur(7px)';
  ctx.drawImage(mask, 0, 0);
  ctx.filter = 'none';
  ctx.restore();
}

function paintSandGrain(ctx: CanvasRenderingContext2D, size: number, count = 3000) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const dark = Math.random() > 0.5;
    ctx.fillStyle = dark ? 'rgba(166,122,58,0.22)' : 'rgba(255,247,218,0.35)';
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + Math.random() * 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintOasisWater(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  // Damp sand margin
  const bank = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.6);
  bank.addColorStop(0, 'rgba(147,185,137,0.38)');
  bank.addColorStop(0.55, 'rgba(150,188,124,0.22)');
  bank.addColorStop(1, 'rgba(205,170,99,0)');
  ctx.fillStyle = bank;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Irregular waterhole silhouette
  ctx.save();
  ctx.beginPath();
  const points = 13;
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble = 1 + Math.sin(i * 2.7) * 0.12 + Math.cos(i * 1.9) * 0.07;
    const px = cx + Math.cos(angle) * radius * wobble;
    const py = cy + Math.sin(angle) * radius * 0.68 * wobble;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.quadraticCurveTo(cx + Math.cos(angle - 0.2) * radius * 1.05, cy + Math.sin(angle - 0.2) * radius * 0.7, px, py);
  }
  ctx.closePath();
  const water = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.25, radius * 0.1, cx, cy, radius);
  water.addColorStop(0, '#9ff1e4');
  water.addColorStop(0.35, '#4ed3cc');
  water.addColorStop(0.75, '#1aa7b5');
  water.addColorStop(1, '#107f96');
  ctx.fillStyle = water;
  ctx.fill();
  ctx.clip();

  // Sunlit ripples
  ctx.strokeStyle = 'rgba(239,255,250,0.65)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i++) {
    const ry = cy - radius * 0.45 + i * radius * 0.15;
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.55, ry);
    ctx.quadraticCurveTo(cx - radius * 0.1, ry + 12, cx + radius * 0.4, ry - 3);
    ctx.stroke();
  }
  ctx.restore();

  // Reeds and tiny lily pads
  ctx.strokeStyle = '#4f7f3b';
  ctx.lineWidth = 4;
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = radius * (0.82 + Math.random() * 0.22);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r * 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 5, y - 15, x + 2 + Math.random() * 7, y - 26);
    ctx.stroke();
  }
  for (let i = 0; i < 9; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = radius * (0.3 + Math.random() * 0.5);
    ctx.fillStyle = ['#6ec25c', '#9ed874', '#4f9f59'][i % 3];
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r * 0.6, 9, 5, angle, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Procedural canvas texture generator for the meadow diorama
export function generateMeadowTexture(): HTMLCanvasElement {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Base vibrant meadow green
  ctx.fillStyle = '#7ac348';
  ctx.fillRect(0, 0, size, size);

  // Subtle grass variations / noise
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#82cc4a');
  grad.addColorStop(0.5, '#76bf42');
  grad.addColorStop(1, '#6eb63b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Add soft organic noise patches
  for (let i = 0; i < 120; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    const rad = 60 + Math.random() * 180;
    const g = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
    const isLighter = Math.random() > 0.4;
    g.addColorStop(0, isLighter ? 'rgba(145, 215, 80, 0.25)' : 'rgba(95, 165, 45, 0.2)');
    g.addColorStop(1, 'rgba(120, 195, 65, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Wheat / Golden Hay field plot (Bottom-Right quadrant)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(size * 0.58, size * 0.65);
  ctx.lineTo(size * 0.95, size * 0.48);
  ctx.lineTo(size * 0.95, size * 0.92);
  ctx.lineTo(size * 0.52, size * 0.92);
  ctx.closePath();

  const wheatGrad = ctx.createLinearGradient(size * 0.6, size * 0.6, size * 0.9, size * 0.9);
  wheatGrad.addColorStop(0, '#d9b147');
  wheatGrad.addColorStop(1, '#e8c459');
  ctx.fillStyle = wheatGrad;
  ctx.fill();

  // Subtle crop lines in wheat field
  ctx.strokeStyle = 'rgba(180, 140, 40, 0.2)';
  ctx.lineWidth = 4;
  for (let x = size * 0.5; x < size * 0.95; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x, size * 0.6);
    ctx.lineTo(x + 120, size * 0.92);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Hedgerows / Field Boundaries (Dark green organic lines)
  ctx.save();
  ctx.strokeStyle = '#3d7821';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Hedge 1: Top-center down diagonally towards bottom-left
  ctx.beginPath();
  ctx.moveTo(size * 0.48, size * 0.12);
  ctx.quadraticCurveTo(size * 0.42, size * 0.35, size * 0.36, size * 0.62);
  ctx.quadraticCurveTo(size * 0.32, size * 0.78, size * 0.28, size * 0.92);
  ctx.stroke();

  // Hedge 2: Center to right-top
  ctx.beginPath();
  ctx.moveTo(size * 0.65, size * 0.15);
  ctx.quadraticCurveTo(size * 0.72, size * 0.32, size * 0.78, size * 0.46);
  ctx.stroke();

  // Hedge 3: Center-left branch
  ctx.beginPath();
  ctx.moveTo(size * 0.36, size * 0.62);
  ctx.quadraticCurveTo(size * 0.22, size * 0.58, size * 0.15, size * 0.52);
  ctx.stroke();

  // Hedge 4: Border along wheat field
  ctx.beginPath();
  ctx.moveTo(size * 0.58, size * 0.65);
  ctx.quadraticCurveTo(size * 0.54, size * 0.78, size * 0.52, size * 0.92);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size * 0.58, size * 0.65);
  ctx.quadraticCurveTo(size * 0.75, size * 0.56, size * 0.95, size * 0.48);
  ctx.stroke();
  ctx.restore();

  // 4. Winding Sandy Dirt Road (Center-right from top to bottom)
  ctx.save();
  ctx.strokeStyle = '#e2cd9f';
  ctx.lineWidth = 38;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(size * 0.6, size * 0.12);
  ctx.bezierCurveTo(
    size * 0.54, size * 0.35,
    size * 0.57, size * 0.65,
    size * 0.64, size * 0.92
  );
  ctx.stroke();

  // Soft road edges / highlight
  ctx.strokeStyle = '#eedcb2';
  ctx.lineWidth = 20;
  ctx.stroke();
  ctx.restore();

  // 5. Curving Blue River on the Left
  ctx.save();
  // Riverbanks (softer green/sand border)
  ctx.strokeStyle = '#62a838';
  ctx.lineWidth = 104;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(size * 0.26, size * 0.14);
  ctx.bezierCurveTo(
    size * 0.18, size * 0.35,
    size * 0.27, size * 0.65,
    size * 0.15, size * 0.92
  );
  ctx.stroke();

  // Water base
  ctx.strokeStyle = '#2b7fff';
  ctx.lineWidth = 78;
  ctx.stroke();

  // Water center light cyan highlight
  ctx.strokeStyle = '#64aaff';
  ctx.lineWidth = 44;
  ctx.stroke();

  // River water highlights / glint waves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const t = (i + 1) / 9;
    const px = size * (0.24 - Math.sin(t * Math.PI) * 0.08);
    const py = size * (0.16 + t * 0.72);
    ctx.beginPath();
    ctx.moveTo(px - 15, py);
    ctx.quadraticCurveTo(px, py + 8, px + 15, py);
    ctx.stroke();
  }
  ctx.restore();

  // 6. Scattered Wildflowers (Yellow, White, Pink, Orange)
  ctx.save();
  for (let i = 0; i < 1800; i++) {
    const fx = size * (0.12 + Math.random() * 0.76);
    const fy = size * (0.12 + Math.random() * 0.76);

    // Skip inside deep river channel
    if (fx < size * 0.3 && fx > size * 0.12 && fy > size * 0.2 && fy < size * 0.85) {
      continue;
    }

    const flowerColors = ['#fffbe8', '#ffe853', '#fbcfe8', '#fed7aa', '#fef08a'];
    const col = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    ctx.fillStyle = col;
    const r = 2.5 + Math.random() * 3.5;
    ctx.beginPath();
    ctx.arc(fx, fy, r, 0, Math.PI * 2);
    ctx.fill();

    // Center dot
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.arc(fx, fy, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 7. Organic painted-paper edge
  stippleDioramaBorder(ctx, size);

  return canvas;
}

/**
 * Desert Oasis: honey-colored dunes, sun-baked clay, a turquoise waterhole
 * and a meandering caravan trail.
 */
export function generateDesertTexture(): HTMLCanvasElement {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const sand = ctx.createLinearGradient(0, 0, size, size);
  sand.addColorStop(0, '#f0d395');
  sand.addColorStop(0.42, '#e8c683');
  sand.addColorStop(1, '#ddb46c');
  ctx.fillStyle = sand;
  ctx.fillRect(0, 0, size, size);

  // Broad, soft dune shadows
  const duneShadows: [number, number, number, number, string][] = [
    [0.1, 0.18, 0.4, 0.36, 'rgba(185,135,70,0.18)'],
    [0.62, 0.2, 0.34, 0.27, 'rgba(255,245,202,0.28)'],
    [0.42, 0.74, 0.46, 0.25, 'rgba(177,127,58,0.16)'],
    [0.8, 0.7, 0.3, 0.26, 'rgba(255,240,190,0.22)'],
    [0.08, 0.63, 0.3, 0.3, 'rgba(171,121,54,0.15)'],
  ];
  duneShadows.forEach(([x, y, rx, ry, color]) => {
    const g = ctx.createRadialGradient(size * x, size * y, 0, size * x, size * y, size * Math.max(rx, ry));
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(220,180,110,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(size * x, size * y, size * rx, size * ry * 0.7, -0.35, 0, Math.PI * 2);
    ctx.fill();
  });

  // Wind-carved dunes: incised ripple curves
  ctx.save();
  for (let i = 0; i < 16; i++) {
    const y = size * (0.08 + i * 0.057);
    ctx.strokeStyle = `rgba(${i % 2 ? '251,244,215' : '169,122,60'},${i % 2 ? '0.3' : '0.13'})`;
    ctx.lineWidth = 4 + (i % 4) * 2;
    ctx.beginPath();
    ctx.moveTo(-40, y);
    ctx.bezierCurveTo(size * 0.22, y - 70, size * 0.38, y + 90, size * 0.58, y - 5);
    ctx.bezierCurveTo(size * 0.76, y - 80, size * 0.88, y + 55, size + 40, y - 35);
    ctx.stroke();
  }
  ctx.restore();

  // Dry cracked clay patches
  ctx.strokeStyle = 'rgba(155,105,47,0.27)';
  ctx.lineWidth = 2.5;
  for (let patch = 0; patch < 10; patch++) {
    const px = size * (0.5 + Math.random() * 0.46);
    const py = size * (0.14 + Math.random() * 0.7);
    for (let l = 0; l < 9; l++) {
      ctx.beginPath();
      ctx.moveTo(px + (Math.random() - 0.5) * 90, py + (Math.random() - 0.5) * 70);
      ctx.lineTo(px + (Math.random() - 0.5) * 110, py + (Math.random() - 0.5) * 95);
      ctx.stroke();
    }
  }

  // Caravan trail sweeping top-right toward the oasis
  ctx.save();
  ctx.strokeStyle = 'rgba(193,143,76,0.36)';
  ctx.lineWidth = 52;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.92, size * 0.08);
  ctx.bezierCurveTo(size * 0.7, size * 0.24, size * 0.67, size * 0.44, size * 0.57, size * 0.63);
  ctx.bezierCurveTo(size * 0.48, size * 0.78, size * 0.52, size * 0.88, size * 0.47, size * 0.96);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(246,225,172,0.44)';
  ctx.lineWidth = 22;
  ctx.stroke();
  ctx.restore();

  // The oasis waterhole (world: x≈-3, z≈+1.15)
  paintOasisWater(ctx, size * 0.355, size * 0.56, size * 0.135);

  // Golden grass tufts near the oasis
  ctx.save();
  for (let i = 0; i < 260; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = size * (0.14 + Math.random() * 0.13);
    const x = size * 0.355 + Math.cos(angle) * dist;
    const y = size * 0.56 + Math.sin(angle) * dist * 0.66;
    ctx.strokeStyle = Math.random() > 0.5 ? '#9a8c42' : '#b6a252';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 14, y - 12 - Math.random() * 18);
    ctx.stroke();
  }
  ctx.restore();

  // Small sun-bleached stones
  ctx.save();
  for (let i = 0; i < 180; i++) {
    const x = size * (0.1 + Math.random() * 0.82);
    const y = size * (0.1 + Math.random() * 0.8);
    if (Math.hypot(x - size * 0.355, (y - size * 0.56) * 1.4) < size * 0.17) continue;
    ctx.fillStyle = `rgba(${112 + Math.random() * 30},${91 + Math.random() * 24},${67 + Math.random() * 20},0.5)`;
    ctx.beginPath();
    ctx.ellipse(x, y, 3 + Math.random() * 8, 2 + Math.random() * 4, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Tiny desert blooms
  for (let i = 0; i < 100; i++) {
    const x = size * (0.13 + Math.random() * 0.74);
    const y = size * (0.13 + Math.random() * 0.74);
    ctx.fillStyle = Math.random() > 0.55 ? '#fff2ee' : '#e5bd59';
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  paintSandGrain(ctx, size, 1600);
  stippleDioramaBorder(ctx, size);
  return canvas;
}

/**
 * Tropical Isle: a soft sandy island, a bright inner meadow, tidal pools
 * and a vivid turquoise sea with painted foam.
 */
export function generateIslandTexture(): HTMLCanvasElement {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Lagoon / open sea base
  const sea = ctx.createLinearGradient(0, 0, size, size);
  sea.addColorStop(0, '#54d4d0');
  sea.addColorStop(0.4, '#2cb7c9');
  sea.addColorStop(0.72, '#1494b5');
  sea.addColorStop(1, '#3fc6c6');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, size, size);

  // Shallow-water halos
  for (let i = 0; i < 16; i++) {
    const g = ctx.createRadialGradient(
      size * (0.2 + Math.random() * 0.6),
      size * (0.2 + Math.random() * 0.6),
      0,
      size * 0.5,
      size * 0.5,
      size * (0.2 + Math.random() * 0.35)
    );
    g.addColorStop(0, 'rgba(151,246,229,0.2)');
    g.addColorStop(1, 'rgba(64,206,216,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  // Wavy sea texture strokes
  ctx.save();
  for (let row = 0; row < 19; row++) {
    for (let col = 0; col < 13; col++) {
      const x = size * 0.06 + col * size * 0.076 + Math.sin(row * 1.8 + col) * 26;
      const y = size * 0.07 + row * size * 0.05;
      ctx.strokeStyle = `rgba(235,255,252,${0.1 + Math.random() * 0.18})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 22, y - 9, x + 50, y);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Coral hints below the waterline
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = size * (0.36 + Math.random() * 0.16);
    const x = size * 0.5 + Math.cos(angle) * dist;
    const y = size * 0.52 + Math.sin(angle) * dist * 0.8;
    ctx.fillStyle = ['rgba(255,188,154,0.22)', 'rgba(255,230,153,0.2)', 'rgba(234,167,204,0.2)'][i % 3];
    ctx.beginPath();
    ctx.arc(x, y, 5 + Math.random() * 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sea foam rings radiating from the island
  ctx.save();
  ctx.strokeStyle = 'rgba(244,255,250,0.65)';
  ctx.lineWidth = 5;
  for (let ring = 0; ring < 7; ring++) {
    ctx.beginPath();
    ctx.ellipse(
      size * 0.5,
      size * 0.515,
      size * (0.27 + ring * 0.061),
      size * (0.25 + ring * 0.052),
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
  ctx.restore();

  // Island landmass (sandy beach)
  const drawIslandBlob = (scale: number) => {
    ctx.beginPath();
    const steps = 22;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const wobble = 1 + Math.sin(i * 2.1) * 0.035 + Math.cos(i * 1.35) * 0.05;
      const x = size * 0.5 + Math.cos(angle) * size * 0.33 * scale * wobble;
      const y = size * 0.515 + Math.sin(angle) * size * 0.3 * scale * wobble;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  ctx.save();
  drawIslandBlob(1);
  ctx.fillStyle = '#f5e2b5';
  ctx.fill();
  ctx.restore();

  // Shallow aqua rim around the sand
  ctx.save();
  drawIslandBlob(1.075);
  ctx.strokeStyle = 'rgba(185,255,240,0.65)';
  ctx.lineWidth = 15;
  ctx.stroke();
  ctx.restore();

  // Inner grassy isle
  ctx.save();
  drawIslandBlob(0.83);
  const green = ctx.createRadialGradient(size * 0.47, size * 0.46, size * 0.02, size * 0.5, size * 0.515, size * 0.34);
  green.addColorStop(0, '#a9d96b');
  green.addColorStop(0.6, '#82c34f');
  green.addColorStop(1, '#6cb841');
  ctx.fillStyle = green;
  ctx.fill();
  ctx.restore();

  // Sandy footpath across the isle
  ctx.save();
  ctx.strokeStyle = 'rgba(235,211,160,0.8)';
  ctx.lineWidth = 38;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.37, size * 0.72);
  ctx.bezierCurveTo(size * 0.45, size * 0.58, size * 0.59, size * 0.55, size * 0.63, size * 0.36);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,242,204,0.48)';
  ctx.lineWidth = 12;
  ctx.stroke();
  ctx.restore();

  // A tiny freshwater lagoon (world: x≈1.9, z≈1.7)
  paintOasisWater(ctx, size * 0.588, size * 0.587, size * 0.043);

  // Grass and flower speckles
  for (let i = 0; i < 850; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * size * 0.25;
    const x = size * 0.5 + Math.cos(angle) * dist;
    const y = size * 0.515 + Math.sin(angle) * dist * 0.9;
    ctx.fillStyle = Math.random() > 0.82 ? '#fff7d8' : Math.random() > 0.5 ? '#c9e896' : '#70b842';
    ctx.beginPath();
    ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Palm shadows painted into the beach
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.4;
    const x = size * 0.5 + Math.cos(angle) * size * 0.245;
    const y = size * 0.515 + Math.sin(angle) * size * 0.225;
    const g = ctx.createRadialGradient(x, y, 0, x, y, size * 0.06);
    g.addColorStop(0, 'rgba(141,108,52,0.25)');
    g.addColorStop(1, 'rgba(141,108,52,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - size * 0.06, y - size * 0.06, size * 0.12, size * 0.12);
  }

  stippleDioramaBorder(ctx, size);
  return canvas;
}

const textureCache: Partial<Record<SceneTheme, HTMLCanvasElement>> = {};

export function generateSceneTexture(theme: SceneTheme): HTMLCanvasElement {
  if (textureCache[theme]) return textureCache[theme]!;
  const texture =
    theme === 'desert'
      ? generateDesertTexture()
      : theme === 'island'
        ? generateIslandTexture()
        : generateMeadowTexture();
  textureCache[theme] = texture;
  return texture;
}
