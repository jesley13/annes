import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Gift, Heart, Share2 } from 'lucide-react';
import { Celebration } from '../types/celebration';
import { generateWishCanvasBlob } from '../utils/canvasWishGenerator';

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

  // Generate 731 x 1024 Canvas Image using exact attached template aesthetic
  useEffect(() => {
    let isMounted = true;

    const renderCard = async () => {
      const blob = await generateWishCanvasBlob(celebration, customMessage);
      if (blob && isMounted) {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    };

    renderCard();

    return () => {
      isMounted = false;
    };
  }, [celebration, customMessage]);

  // Handle Download PNG
  const handleDownload = () => {
    if (!imageUrl) return;
    const prefix = isBirthday ? 'BD' : 'WA';
    const cleanName = celebration.name.replace(/[^a-zA-Z0-9]/g, '_');
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${prefix}_${cleanName}.png`;
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
        
        {/* Left Side: Live Portrait Image Preview (731:1024 ratio container) */}
        <div className="md:w-1/2 bg-black/50 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border overflow-y-auto">
          <div className="flex items-center justify-between w-full mb-2 px-1">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Portrait Wish Card (731×1024 High-Res)
            </span>
            <span className="text-[10px] bg-tertiary px-2 py-0.5 rounded text-muted font-mono">731×1024 PNG</span>
          </div>

          <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[731/1024] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 flex items-center justify-center group">
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
