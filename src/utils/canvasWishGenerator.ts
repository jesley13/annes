import { Celebration } from '../types/celebration';

// Helper to load image cleanly across browser / canvas
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

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
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

export async function generateWishCanvasBlob(celebration: Celebration, customMessage: string = ''): Promise<Blob | null> {
  // Ensure web fonts are loaded before drawing
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const isBirthday = celebration.event === 'Birthday';
  const imgUrl = isBirthday ? '/BD.jpg' : '/WA.jpg';

  let bgImg: HTMLImageElement | null = null;
  try {
    bgImg = await loadImage(imgUrl);
  } catch (err) {
    console.error('Failed to load template image:', imgUrl, err);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 731;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (bgImg) {
    // Draw the exact attached template image as background without changing dimensions or contents
    ctx.drawImage(bgImg, 0, 0, 731, 1024);

    if (isBirthday) {
      // Cleanly erase existing sample name ('LINSHA') on BD.jpg
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(80, 460, 571, 52);

      // Cleanly erase sample date ('July 1') at bottom right
      const dateBg = ctx.getImageData(540, 990, 1, 1).data;
      ctx.fillStyle = `rgb(${dateBg[0]}, ${dateBg[1]}, ${dateBg[2]})`;
      ctx.fillRect(540, 970, 175, 45);

      // Draw dynamic celebration name (centered around y = 493)
      ctx.textAlign = 'center';
      ctx.font = "800 36px 'Outfit', 'Inter', sans-serif";
      ctx.fillStyle = '#111827';
      const rawName = celebration.name.toUpperCase();
      const spacedName = rawName.split('').join(' ');
      ctx.fillText(spacedName, 365.5, 493);

      if (customMessage.trim()) {
        ctx.font = "500 20px 'Inter', sans-serif";
        ctx.fillStyle = '#475569';
        wrapText(ctx, customMessage, 365.5, 535, 600, 26);
      }

      // Draw dynamic celebration date
      ctx.textAlign = 'right';
      ctx.font = "500 32px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = '#334155';
      ctx.fillText(`${celebration.month} ${celebration.day}`, 650, 1002);
    } else {
      // Cleanly erase existing sample couple name ('SHYJEN & BETINA') on WA.jpg
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(80, 620, 571, 55);

      // Cleanly erase sample date ('July 07') at bottom right
      const dateBg = ctx.getImageData(560, 995, 1, 1).data;
      ctx.fillStyle = `rgb(${dateBg[0]}, ${dateBg[1]}, ${dateBg[2]})`;
      ctx.fillRect(570, 972, 145, 42);

      // Draw dynamic couple name (centered around y = 660)
      ctx.textAlign = 'center';
      ctx.font = "500 42px 'Courier New', Courier, monospace";
      ctx.fillStyle = '#111827';
      const rawName = celebration.name.toUpperCase();
      ctx.fillText(rawName, 365.5, 660);

      if (customMessage.trim()) {
        ctx.font = "500 20px 'Inter', sans-serif";
        ctx.fillStyle = '#475569';
        wrapText(ctx, customMessage, 365.5, 715, 600, 26);
      }

      // Draw dynamic date
      ctx.textAlign = 'right';
      ctx.font = "500 32px 'Courier New', Courier, monospace";
      ctx.fillStyle = '#111827';
      const monthUpper = celebration.month.toUpperCase();
      const padDay = celebration.day < 10 ? `0${celebration.day}` : `${celebration.day}`;
      ctx.fillText(`${monthUpper} ${padDay}`, 703, 1004);
    }
  } else {
    // Fallback if template fails to load
    ctx.fillStyle = isBirthday ? '#fff1f2' : '#f8fafc';
    ctx.fillRect(0, 0, 731, 1024);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#111827';
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(celebration.name, 365.5, 512);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
