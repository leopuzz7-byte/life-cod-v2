// Картинки для карточек методики 1 (сжатые WebP). Ключ — id метода.
import purpose from "@/assets/cards/purpose.webp";
import compatibility from "@/assets/cards/compatibility.webp";
import year from "@/assets/cards/year.webp";
import month from "@/assets/cards/month.webp";
import day from "@/assets/cards/day.webp";
import ancestral from "@/assets/cards/ancestral.webp";
import contract from "@/assets/cards/contract.webp";

export const cardImages: Record<string, string> = {
  purpose, compatibility, year, month, day, ancestral, contract,
};

// Картинки для карточек методики 2 (классика).
import cf from "@/assets/cards2/classic-full.webp";
import lc from "@/assets/cards2/lifecod-compatibility.webp";
import bz from "@/assets/cards2/business.webp";
import ct from "@/assets/cards2/contract.webp";
import nm from "@/assets/cards2/name.webp";
import fn from "@/assets/cards2/finance.webp";
import sp from "@/assets/cards2/success-path.webp";

export const cardImagesM2: Record<string, string> = {
  "classic-full": cf,
  "lifecod-compatibility": lc,
  business: bz,
  contract: ct,
  name: nm,
  finance: fn,
  "success-path": sp,
};
