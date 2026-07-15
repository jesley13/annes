import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Gift, Heart, Share2 } from 'lucide-react';
import { Celebration } from '../types/celebration';

interface GreetingCardModalProps {
  celebration: Celebration;
  onClose: () => void;
}

export const GreetingCardModal: React.FC<GreetingCardModalProps> = ({ celebration, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>(() => {
    if (celebration.event === 'Birthday') {
      return "May your special day be packed with joy, laughter, and endless happiness! Wishing you a fantastic year ahead filled with success and wonderful memories.";
    } else {
      return "Wishing you both endless love, joy, and togetherness today and always. May your bond grow even stronger with each passing year! Cheers to wonderful memories!";
    }
  });

  const isBirthday = celebration.event === 'Birthday';

  // Helper to wrap text cleanly on canvas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
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
    return currentY + lineHeight;
  };

  // Generate 1080 x 1920 Portrait Canvas Image replicating exact template aesthetic
  useEffect(() => {
    let isMounted = true;

    const renderCanvas = () => {
      if (!isMounted) return;
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (isBirthday) {
        // --- 1. BIRTHDAY WATERCOLOR PASTEL TEMPLATE REPLICATION ---
        // Crisp White Base
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
        // Rich golden brown metallic color
        ctx.fillStyle = '#a67c38';
        ctx.fillText("Happy Birthday", 540, 475);

        // --- 4. CENTER HERO NAME ("L I N S H A") ---
        ctx.font = "900 80px 'Outfit', 'Inter', sans-serif";
        ctx.fillStyle = '#111827';
        
        // Add elegant tracking/spacing to uppercase letters
        const rawName = celebration.name.toUpperCase();
        const spacedName = rawName.split('').join('  ');
        ctx.fillText(spacedName, 540, 890);

        // Optional custom wish message underneath if user customized it
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
        // Off-white textured paper base
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

        // --- 4. OVERLAPPING PASTEL WATERCOLOR HEARTS (Pink & Coral/Salmon) ---
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

        // Left Pink Watercolor Heart (-18 deg tilt)
        drawHeart(430, 780, 260, 'rgba(251, 207, 232, 0.95)', -18);
        drawHeart(430, 780, 245, 'rgba(244, 114, 182, 0.75)', -18);

        // Right Coral/Salmon Watercolor Heart (+15 deg tilt, overlapping right)
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

      // Save to data URL
      const url = canvas.toDataURL('image/png');
      setImageUrl(url);
    };

    renderCanvas();
    // Re-render when web fonts finish loading so script calligraphy looks crystal clear
    document.fonts.ready.then(() => {
      renderCanvas();
    });

    return () => {
      isMounted = false;
    };
  }, [celebration, customMessage, isBirthday]);

  // Handle Download PNG
  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${celebration.name.replace(/[^a-zA-Z0-9]/g, '_')}_WishCard.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Copy PNG Image directly to clipboard (so they can paste in WhatsApp/Messages)
  const handleCopyImage = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        // Fallback if clipboard write isn't permitted by browser
        handleDownload();
      }
    } catch (err) {
      console.error('Failed to copy image to clipboard, triggering download:', err);
      handleDownload();
    }
  };

  // Copy text wish fallback
  const handleCopyText = () => {
    navigator.clipboard.writeText(`${customMessage} - Happy ${celebration.event}, ${celebration.name}! 🎉`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-4xl w-full max-h-[95vh] flex flex-col md:flex-row overflow-hidden shadow-2xl border border-white/20">
        
        {/* Left Side: Live Portrait Image Preview (9:16 ratio container) */}
        <div className="md:w-1/2 bg-black/50 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border overflow-y-auto">
          <div className="flex items-center justify-between w-full mb-2 px-1">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Portrait Wish Card (9:16 High-Res)
            </span>
            <span className="text-[10px] bg-tertiary px-2 py-0.5 rounded text-muted font-mono">1080×1920 PNG</span>
          </div>

          <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 flex items-center justify-center group">
            {imageUrl ? (
              <img src={imageUrl} alt="Portrait Wish Card" className="w-full h-full object-cover" />
            ) : (
              <div className="text-xs text-muted">Generating card...</div>
            )}
          </div>
        </div>

        {/* Right Side: Controls, Message Editor & Actions */}
        <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isBirthday ? 'bg-pink-500/20 text-pink-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {isBirthday ? <Gift className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-main">
                    Wish Card Generator
                  </h3>
                  <p className="text-xs text-muted">Customize and share a portrait image</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-tertiary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-main block mb-1">
                  Recipient Name
                </label>
                <div className="p-2.5 rounded-xl bg-tertiary border border-border/80 text-sm font-extrabold text-purple-300">
                  {celebration.name} ({celebration.event})
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-main flex items-center justify-between mb-1">
                  <span>Customize Greeting Message</span>
                  <span className="text-[10px] text-muted font-normal">Live preview updates instantly</span>
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-tertiary border border-border p-3 text-xs sm:text-sm text-main focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-border space-y-2.5">
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Portrait Image (.PNG)</span>
            </button>

            <button
              onClick={handleCopyImage}
              className="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-tertiary border border-border text-main font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Image Copied to Clipboard! (Ready to Paste)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy Image to Clipboard (For WhatsApp/Instagram)</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyText}
              className="w-full py-2 px-3 rounded-lg text-[11px] text-muted hover:text-main flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedText ? (
                <span className="text-emerald-400 font-bold">Text Wish Copied!</span>
              ) : (
                <span>Prefer old plain text? Copy just text wish</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
