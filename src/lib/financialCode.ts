// Финансовый код по дате рождения — 22 аркана
import { normalizeToArcana, sumDigits, dayToArcana, yearToArcana } from './calculations';
import { getArcana } from './arcana';

export interface FinancialCodeResult {
  birthDate: { day: number; month: number; year: number };
  talentArcana: number; // день → аркан (таланты для заработка)
  resourceArcana: number; // день + месяц → аркан (ресурсы)
  missionArcana: number; // полная сумма → аркан (финансовая миссия)
  blockArcana: number; // |день − месяц| → аркан (финансовый блок)
  talentDesc: string;
  resourceDesc: string;
  missionDesc: string;
  blockDesc: string;
  professions: string[];
}

export function calculateFinancialCode(day: number, month: number, year: number): FinancialCodeResult {
  const talentArcana = dayToArcana(day);
  const resourceArcana = normalizeToArcana(day + month);
  const missionArcana = normalizeToArcana(sumDigits(day) + sumDigits(month) + sumDigits(year));
  const blockArcana = normalizeToArcana(Math.abs(day - month));

  const talent = getArcana(talentArcana);
  const resource = getArcana(resourceArcana);
  const mission = getArcana(missionArcana);
  const block = getArcana(blockArcana);

  return {
    birthDate: { day, month, year },
    talentArcana,
    resourceArcana,
    missionArcana,
    blockArcana,
    talentDesc: talent?.personalDescription || '',
    resourceDesc: resource?.personalDescription || '',
    missionDesc: mission?.yearForecast || '',
    blockDesc: block?.personalReversed || '',
    professions: [
      ...(talent?.professions || []),
      ...(resource?.professions || []),
    ].filter((v, i, a) => a.indexOf(v) === i),
  };
}
