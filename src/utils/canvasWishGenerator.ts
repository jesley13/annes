import { Celebration } from '../types/celebration';

// Helper for multiline text wrap on canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

export async function generateWishCanvasBlob(celebration: Celebration, customMessage: string = ''): Promise<Blob | null> {
  // Ensure web fonts like Great Vibes, Dancing Script, Caveat are loaded before drawing
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isBirthday = celebration.event === 'Birthday';

  if (isBirthday) {
    // --- 1. BIRTHDAY WATERCOLOR PASTEL TEMPLATE REPLICATION ---
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1080, 1920);

    // Top-center soft blush / pink watercolor clouds
    const topCloud = ctx.createRadialGradient(540, 250, 0, 540, 250, 750);
    topCloud.addColorStop(0, 'rgba(252, 231, 243, 0.75)');
    topCloud.addColorStop(0.6, 'rgba(255, 241, 242, 0.4)');
    topCloud.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = topCloud;
    ctx.fillRect(0, 0, 1080, 960);

    // Bottom-left soft lavender/purple wash
    const leftCloud = ctx.createRadialGradient(180, 1600, 0, 180, 1600, 680);
    leftCloud.addColorStop(0, 'rgba(243, 232, 255, 0.85)');
    leftCloud.addColorStop(0.5, 'rgba(237, 233, 254, 0.4)');
    leftCloud.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = leftCloud;
    ctx.fillRect(0, 960, 1080, 960);

    // Bottom-right soft peach/yellow/green wash
    const rightCloud = ctx.createRadialGradient(900, 1650, 0, 900, 1650, 650);
    rightCloud.addColorStop(0, 'rgba(254, 249, 195, 0.7)');
    rightCloud.addColorStop(0.4, 'rgba(220, 252, 231, 0.45)');
    rightCloud.addColorStop(0.8, 'rgba(254, 226, 226, 0.3)');
    rightCloud.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rightCloud;
    ctx.fillRect(0, 960, 1080, 960);

    // --- 2. TOP CURSIVE TYPOGRAPHY ("St Anne's Family wishes you") ---
    ctx.textAlign = 'center';
    ctx.font = "italic 56px 'Dancing Script', 'Alex Brush', Georgia, cursive";
    ctx.fillStyle = '#111827';
    ctx.fillText("St Anne's Family wishes you", 540, 330);

    // --- 3. GOLDEN CALLIGRAPHY ("Happy Birthday") ---
    ctx.font = "italic 118px 'Great Vibes', 'Alex Brush', Georgia, cursive";
    ctx.fillStyle = '#a67c38';
    ctx.fillText("Happy Birthday", 540, 475);

    // --- 4. CENTER HERO NAME ("L I N S H A") ---
    ctx.font = "900 80px 'Outfit', 'Inter', sans-serif";
    ctx.fillStyle = '#111827';
    
    const rawName = celebration.name.toUpperCase();
    const spacedName = rawName.split('').join('  ');
    ctx.fillText(spacedName, 540, 890);

    if (customMessage.trim()) {
      ctx.font = "500 36px 'Inter', sans-serif";
      ctx.fillStyle = '#475569';
      wrapText(ctx, customMessage, 540, 1060, 840, 52);
    }

    // --- 5. BOTTOM CENTER 2-TIER CAKE ILLUSTRATION ---
    const cx = 540, cy = 1750;

    // Base Plate (Yellow oval)
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 25, 175, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bottom Tier (Chocolate layers)
    const bw = 270, bh = 150;
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2, cy - bh + 25, bw, bh, 12);
    ctx.fill();

    // Bottom Tier Middle Filling
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cx - bw / 2, cy - bh / 2 + 10, bw, 25);

    // Top Tier (Chocolate)
    const tw = 190, th = 120;
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(cx - tw / 2, cy - bh - th + 35, tw, th, 12);
    ctx.fill();

    // Top Tier Middle Filling
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cx - tw / 2, cy - bh - th / 2 + 25, tw, 22);

    // Bottom Tier Pink Frosting Drips
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2, cy - bh + 20, bw, 45, [12, 12, 20, 20]);
    ctx.fill();
    for (let d = -110; d <= 110; d += 55) {
      ctx.beginPath();
      ctx.arc(cx + d, cy - bh + 60, 18, 0, Math.PI);
      ctx.fill();
    }

    // Top Tier Pink Frosting Drips
    ctx.beginPath();
    ctx.roundRect(cx - tw / 2, cy - bh - th + 30, tw, 42, [12, 12, 18, 18]);
    ctx.fill();
    for (let d = -75; d <= 75; d += 50) {
      ctx.beginPath();
      ctx.arc(cx + d, cy - bh - th + 66, 16, 0, Math.PI);
      ctx.fill();
    }

    // Frosting Rosettes at bottom of tiers
    ctx.fillStyle = '#f9a8d4';
    for (let r = -115; r <= 115; r += 46) {
      ctx.beginPath();
      ctx.arc(cx + r, cy + 22, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7 Candles on Top Tier
    const candleColors = ['#3b82f6', '#ef4444', '#eab308', '#a855f7', '#10b981', '#f97316', '#ec4899'];
    for (let c = 0; c < 7; c++) {
      const candleX = cx - 65 + c * 21;
      const candleY = cy - bh - th - 35;
      
      // Candle body
      ctx.fillStyle = candleColors[c % candleColors.length];
      ctx.roundRect(candleX - 4, candleY, 8, 65, 3);
      ctx.fill();

      // Candle Flame (yellow/orange teardrop)
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(candleX, candleY - 12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(candleX, candleY - 10, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- 6. BOTTOM RIGHT DATE ("July 1") ---
    ctx.textAlign = 'right';
    ctx.font = "500 48px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = '#334155';
    ctx.fillText(`${celebration.month} ${celebration.day}`, 950, 1750);

  } else {
    // --- 1. WEDDING ANNIVERSARY TEMPLATE REPLICATION ---
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle paper grain/scratch texture simulation
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * 1080;
      const sy = Math.random() * 1920;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 80, sy + (Math.random() - 0.5) * 80);
      ctx.stroke();
    }

    // --- 2. TOP-LEFT TYPEWRITER/MONO TYPOGRAPHY ("St Anne's Family wishes") ---
    ctx.textAlign = 'left';
    ctx.font = "500 44px 'Courier New', Courier, monospace";
    ctx.fillStyle = '#1e293b';
    ctx.fillText("St Anne's Family wishes", 85, 190);

    // --- 3. CENTER STACKED BRUSH SCRIPT CALLIGRAPHY ("Happy Anniversary") ---
    ctx.textAlign = 'center';
    ctx.font = "italic 118px 'Caveat', 'Dancing Script', 'Alex Brush', cursive";
    ctx.fillStyle = '#334155';
    ctx.fillText("Happy", 540, 440);
    ctx.fillText("Anniversary", 540, 580);

    // --- 4. OVERLAPPING PASTEL WATERCOLOR HEARTS ---
    const drawHeart = (hx: number, hy: number, size: number, color: string, rotDeg: number) => {
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate((rotDeg * Math.PI) / 180);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size * 0.5, -size * 0.4, -size, size * 0.1, 0, size);
      ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.4, 0, size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawHeart(430, 780, 260, 'rgba(251, 207, 232, 0.95)', -18);
    drawHeart(430, 780, 245, 'rgba(244, 114, 182, 0.75)', -18);

    drawHeart(650, 790, 260, 'rgba(254, 205, 211, 0.95)', 15);
    drawHeart(650, 790, 245, 'rgba(251, 113, 133, 0.85)', 15);

    // --- 5. COUPLE HERO NAME ("ALEX & LINCY") ---
    ctx.font = "500 74px 'Courier New', Courier, monospace";
    ctx.fillStyle = '#111827';
    
    const rawName = celebration.name.toUpperCase();
    const spacedName = rawName.split('').join('  ');
    ctx.fillText(spacedName, 540, 1330);

    if (customMessage.trim()) {
      ctx.font = "500 34px 'Inter', sans-serif";
      ctx.fillStyle = '#475569';
      wrapText(ctx, customMessage, 540, 1490, 840, 48);
    }

    // --- 6. BOTTOM-RIGHT UPPERCASE DATE ("AUG 30") ---
    ctx.textAlign = 'right';
    ctx.font = "500 48px 'Courier New', Courier, monospace";
    ctx.fillStyle = '#111827';
    
    const monthUpper = celebration.month.toUpperCase();
    ctx.fillText(`${monthUpper} ${celebration.day}`, 960, 1810);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
