// Экран выбора карты: пять карт рубашкой вверх (черно-золото, высокое качество).
// Рубашку не сжимаем: рисуем крупно, отдаём PNG без потерь.
const path = require("path");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");

const FONTS = path.join(__dirname, "..", "..", "assets", "fonts");
const BACK = path.join(__dirname, "..", "..", "assets", "cards", "back.png");
try { GlobalFonts.registerFromPath(path.join(FONTS, "Playfair-ExtraBold.ttf"), "PlayfairXB"); } catch (_) {}
try { GlobalFonts.registerFromPath(path.join(FONTS, "Playfair-Italic.ttf"), "PlayfairI"); } catch (_) {}
try { GlobalFonts.registerFromPath(path.join(FONTS, "Playfair-Bold.ttf"), "PlayfairB"); } catch (_) {}

const BG0 = "#0b0a0f", BG1 = "#15121c", GLOW = "#3a2c14";
const GOLD_HI = "#f7e4a8", GOLD = "#d9b45a", GOLD_LO = "#9c7a2c";
const CW = 300, CH = 450, GAP = 34, PAD = 70, TOP = 200, BOTTOM = 150;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function goldGrad(ctx, y, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, GOLD_HI); g.addColorStop(0.5, GOLD); g.addColorStop(1, GOLD_LO); return g;
}

async function renderDeckChoice(n = 5, opts = {}) {
  const W = PAD * 2 + n * CW + (n - 1) * GAP;
  const H = TOP + CH + BOTTOM;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = BG0; ctx.fillRect(0, 0, W, H);
  const rg = ctx.createRadialGradient(W / 2, TOP + CH * 0.4, 80, W / 2, TOP + CH * 0.4, W * 0.55);
  rg.addColorStop(0, GLOW); rg.addColorStop(0.5, BG1); rg.addColorStop(1, BG0);
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 110; i++) {
    const x = Math.random() * W, y = Math.random() * H;
    ctx.globalAlpha = Math.random() * 0.45 + 0.05;
    ctx.beginPath(); ctx.arc(x, y, Math.random() * 1.3 + 0.3, 0, Math.PI * 2);
    ctx.fillStyle = GOLD_HI; ctx.fill();
  }
  ctx.globalAlpha = 1;

  // рамка
  ctx.strokeStyle = GOLD_LO; ctx.lineWidth = 1.5;
  roundRect(ctx, 22, 22, W - 44, H - 44, 10); ctx.stroke();

  ctx.textAlign = "center";
  ctx.save(); ctx.shadowColor = "rgba(217,180,90,0.5)"; ctx.shadowBlur = 22;
  ctx.font = "58px PlayfairXB"; ctx.fillStyle = goldGrad(ctx, 78, 60);
  ctx.fillText(opts.title || "Выбери карту", W / 2, 132); ctx.restore();

  const back = await loadImage(BACK);
  for (let i = 0; i < n; i++) {
    const x = PAD + i * (CW + GAP), y = TOP;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12;
    roundRect(ctx, x, y, CW, CH, 16); ctx.fillStyle = "#000"; ctx.fill(); ctx.restore();
    ctx.save(); roundRect(ctx, x, y, CW, CH, 16); ctx.clip();
    ctx.drawImage(back, x, y, CW, CH); ctx.restore();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; roundRect(ctx, x, y, CW, CH, 16); ctx.stroke();
    ctx.strokeStyle = "rgba(247,228,168,0.45)"; ctx.lineWidth = 1; roundRect(ctx, x + 5, y + 5, CW - 10, CH - 10, 12); ctx.stroke();
    // номер под картой
    const ncy = y + CH + 56;
    ctx.beginPath(); ctx.arc(x + CW / 2, ncy, 33, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(217,180,90,0.16)"; ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.font = "48px PlayfairXB"; ctx.fillStyle = goldGrad(ctx, ncy - 24, 48);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), x + CW / 2, ncy + 3); ctx.textBaseline = "alphabetic";
  }
  return canvas.encode("png");
}
module.exports = { renderDeckChoice };
