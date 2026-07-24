// Черно-золотой премиум-рендер трёх карт по сферам жизни.
// Тёмный фон, металлическое золото, орнаментальная рамка, свечение.
const path = require("path");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");

const FONTS = path.join(__dirname, "..", "..", "assets", "fonts");
const ARCANA_DIR = path.join(__dirname, "..", "..", "assets", "arcana");
GlobalFonts.registerFromPath(path.join(FONTS, "Playfair-ExtraBold.ttf"), "PlayfairXB");
GlobalFonts.registerFromPath(path.join(FONTS, "Playfair-Bold.ttf"), "PlayfairB");
GlobalFonts.registerFromPath(path.join(FONTS, "Playfair-Regular.ttf"), "PlayfairR");
GlobalFonts.registerFromPath(path.join(FONTS, "Playfair-Italic.ttf"), "PlayfairI");

// палитра
const BG0 = "#0b0a0f", BG1 = "#15121c", GLOW = "#3a2c14";
const GOLD_HI = "#f7e4a8", GOLD = "#d9b45a", GOLD_LO = "#9c7a2c", GOLD_DK = "#6f5320";

const CARD_W = 300, CARD_H = 450, GAP = 60, PAD_X = 84, TOP = 214, BOTTOM = 170;

// вертикальный «металлический» градиент золота
function goldGrad(ctx, y, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, GOLD_HI); g.addColorStop(0.5, GOLD); g.addColorStop(1, GOLD_LO);
  return g;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function diamond(ctx, cx, cy, r, fill) {
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r, cy); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
}
function centeredText(ctx, text, cx, y, font, fill, spacing = 0) {
  ctx.font = font; ctx.textAlign = spacing ? "left" : "center";
  if (!spacing) { ctx.fillStyle = fill; ctx.fillText(text, cx, y); return; }
  const widths = [...text].map((ch) => ctx.measureText(ch).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0) - spacing;
  let x = cx - total / 2;
  ctx.fillStyle = fill;
  for (let i = 0; i < text.length; i++) { ctx.fillText(text[i], x, y); x += widths[i]; }
  ctx.textAlign = "center";
}

// cards: [{ n, label, sub }] ровно 3. opts: { title, subtitle }
async function renderThemeCards(cards, opts = {}) {
  const W = PAD_X * 2 + 3 * CARD_W + 2 * GAP;
  const H = TOP + CARD_H + BOTTOM;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // фон: глубокий тёмный + тёплое радиальное свечение по центру
  ctx.fillStyle = BG0; ctx.fillRect(0, 0, W, H);
  const rg = ctx.createRadialGradient(W / 2, TOP + CARD_H * 0.42, 60, W / 2, TOP + CARD_H * 0.42, W * 0.62);
  rg.addColorStop(0, GLOW); rg.addColorStop(0.55, BG1); rg.addColorStop(1, BG0);
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

  // звёздная пыль сверху
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * W, y = Math.random() * (TOP + 40);
    ctx.globalAlpha = Math.random() * 0.5 + 0.06;
    ctx.beginPath(); ctx.arc(x, y, Math.random() * 1.4 + 0.3, 0, Math.PI * 2);
    ctx.fillStyle = GOLD_HI; ctx.fill();
  }
  ctx.globalAlpha = 1;

  // орнаментальная золотая рамка холста с уголками
  const m = 22;
  ctx.strokeStyle = GOLD_LO; ctx.lineWidth = 1.5;
  roundRect(ctx, m, m, W - 2 * m, H - 2 * m, 10); ctx.stroke();
  ctx.strokeStyle = "rgba(217,180,90,0.35)"; ctx.lineWidth = 1;
  roundRect(ctx, m + 6, m + 6, W - 2 * m - 12, H - 2 * m - 12, 8); ctx.stroke();
  [[m, m], [W - m, m], [m, H - m], [W - m, H - m]].forEach(([x, y]) => diamond(ctx, x, y, 7, GOLD));

  // заголовок
  if (opts.title) {
    ctx.save();
    ctx.shadowColor = "rgba(217,180,90,0.5)"; ctx.shadowBlur = 24;
    centeredText(ctx, opts.title, W / 2, 96, "60px PlayfairXB", goldGrad(ctx, 52, 60), 2);
    ctx.restore();
  }
  if (opts.subtitle) centeredText(ctx, opts.subtitle, W / 2, 140, "italic 27px PlayfairI", "#c9b788");
  // разделитель
  ctx.strokeStyle = GOLD_LO; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(W / 2 - 130, 166); ctx.lineTo(W / 2 - 16, 166); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W / 2 + 16, 166); ctx.lineTo(W / 2 + 130, 166); ctx.stroke();
  diamond(ctx, W / 2, 166, 6, GOLD);

  for (let i = 0; i < 3; i++) {
    const x = PAD_X + i * (CARD_W + GAP), y = TOP;
    const img = await loadImage(path.join(ARCANA_DIR, `arcana-${cards[i].n}.webp`));

    // тёплая тень
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
    roundRect(ctx, x, y, CARD_W, CARD_H, 16); ctx.fillStyle = "#000"; ctx.fill();
    ctx.restore();

    // золотое свечение вокруг карты
    ctx.save();
    ctx.shadowColor = "rgba(217,180,90,0.55)"; ctx.shadowBlur = 26;
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3;
    roundRect(ctx, x, y, CARD_W, CARD_H, 16); ctx.stroke();
    ctx.restore();

    // картинка
    ctx.save(); roundRect(ctx, x, y, CARD_W, CARD_H, 16); ctx.clip();
    ctx.drawImage(img, x, y, CARD_W, CARD_H);
    // лёгкое затемнение снизу для читаемости
    const sh = ctx.createLinearGradient(0, y + CARD_H - 90, 0, y + CARD_H);
    sh.addColorStop(0, "rgba(11,10,15,0)"); sh.addColorStop(1, "rgba(11,10,15,0.55)");
    ctx.fillStyle = sh; ctx.fillRect(x, y + CARD_H - 90, CARD_W, 90);
    ctx.restore();

    // двойная золотая рамка
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; roundRect(ctx, x, y, CARD_W, CARD_H, 16); ctx.stroke();
    ctx.strokeStyle = "rgba(247,228,168,0.5)"; ctx.lineWidth = 1; roundRect(ctx, x + 5, y + 5, CARD_W - 10, CARD_H - 10, 12); ctx.stroke();

    // подпись сферы (капсом, с разрядкой) и аркан
    diamond(ctx, x + CARD_W / 2, y + CARD_H + 30, 5, GOLD);
    centeredText(ctx, (cards[i].label || "").toUpperCase(), x + CARD_W / 2, y + CARD_H + 74, "28px PlayfairB", goldGrad(ctx, y + CARD_H + 50, 30), 3);
    if (cards[i].sub) centeredText(ctx, cards[i].sub, x + CARD_W / 2, y + CARD_H + 112, "italic 24px PlayfairI", "#b9a878");
  }

  return canvas.encode("png");
}

module.exports = { renderThemeCards };
