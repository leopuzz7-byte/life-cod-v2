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

import purposeDark from "@/assets/cards-dark/purpose.webp";
import compatibilityDark from "@/assets/cards-dark/compatibility.webp";
import yearDark from "@/assets/cards-dark/year.webp";
import monthDark from "@/assets/cards-dark/month.webp";
import dayDark from "@/assets/cards-dark/day.webp";
import ancestralDark from "@/assets/cards-dark/ancestral.webp";

export const cardImagesDark: Record<string, string> = {
  purpose: purposeDark,
  compatibility: compatibilityDark,
  year: yearDark,
  month: monthDark,
  day: dayDark,
  ancestral: ancestralDark,
};

import cfDark from "@/assets/cards2-dark/classic-full.webp";
import lcDark from "@/assets/cards2-dark/lifecod-compatibility.webp";
import bzDark from "@/assets/cards2-dark/business.webp";
import ctDark from "@/assets/cards2-dark/contract.webp";
import nmDark from "@/assets/cards2-dark/name.webp";
import fnDark from "@/assets/cards2-dark/finance.webp";

export const cardImagesM2Dark: Record<string, string> = {
  "classic-full": cfDark,
  "lifecod-compatibility": lcDark,
  business: bzDark,
  contract: ctDark,
  name: nmDark,
  finance: fnDark,
};

// Отдельные изображения для карточек на телефоне в темной теме.
// Светлая тема и десктоп продолжают использовать наборы выше.
import purposeMobileDark from "@/assets/cards-mobile-dark-v2/purpose.webp";
import compatibilityMobileDark from "@/assets/cards-mobile-dark-v2/compatibility.webp";
import yearMobileDark from "@/assets/cards-mobile-dark-v2/year.webp";
import monthMobileDark from "@/assets/cards-mobile-dark-v2/month.webp";
import dayMobileDark from "@/assets/cards-mobile-dark-v2/day.webp";
import ancestralMobileDark from "@/assets/cards-mobile-dark-v2/ancestral.webp";

export const cardImagesMobileDark: Record<string, string> = {
  purpose: purposeMobileDark,
  compatibility: compatibilityMobileDark,
  year: yearMobileDark,
  month: monthMobileDark,
  day: dayMobileDark,
  ancestral: ancestralMobileDark,
};

import cfMobileDark from "@/assets/cards2-mobile-dark-v2/classic-full.webp";
import lcMobileDark from "@/assets/cards2-mobile-dark-v2/lifecod-compatibility.webp";
import bzMobileDark from "@/assets/cards2-mobile-dark-v2/business.webp";
import ctMobileDark from "@/assets/cards2-mobile-dark-v2/contract.webp";
import nmMobileDark from "@/assets/cards2-mobile-dark-v2/name.webp";
import fnMobileDark from "@/assets/cards2-mobile-dark-v2/finance.webp";

export const cardImagesM2MobileDark: Record<string, string> = {
  "classic-full": cfMobileDark,
  "lifecod-compatibility": lcMobileDark,
  business: bzMobileDark,
  contract: ctMobileDark,
  name: nmMobileDark,
  finance: fnMobileDark,
};
