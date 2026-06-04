// План действий — что делать, что усилить, чего избегать
import { CalcTrace } from './personalAnalysis';
import i18n from '@/i18n';
import { getActionSet, getActionLabels } from './actionPlanI18n';

export interface ActionPlanModule {
  doNow: string[];
  strengthen: string[];
  avoid: string[];
  unlockPotential: string[];
}

const doNowByYear: Record<number, string> = {
  1: 'Начните новый проект или возьмите инициативу',
  2: 'Найдите партнёра или укрепите существующие связи',
  3: 'Заявите о себе — запишите видео, напишите пост',
  4: 'Наведите порядок в финансах и делах',
  5: 'Попробуйте новый подход к старой задаче',
  6: 'Возьмите ответственность за важное решение',
  7: 'Остановитесь и проанализируйте ситуацию',
  8: 'Примите жёсткое решение, которое откладывали',
  9: 'Завершите то, что тянется давно',
};

const strengthenByConsciousness: Record<number, string> = {
  1: 'Усильте самодисциплину и независимость',
  2: 'Развивайте эмоциональный интеллект',
  3: 'Прокачайте навыки публичных выступлений',
  4: 'Создайте систему привычек и рутин',
  5: 'Развивайте адаптивность и гибкость',
  6: 'Научитесь ставить границы в заботе',
  7: 'Углубите экспертизу в своей области',
  8: 'Прокачайте управленческие навыки',
  9: 'Развивайте способность отпускать и завершать',
};

const avoidByAction: Record<number, string> = {
  1: 'Избегайте изоляции и упрямства',
  2: 'Избегайте подчинения чужой воле',
  3: 'Избегайте пустых обещаний и болтовни',
  4: 'Избегайте гиперконтроля и жёсткости',
  5: 'Избегайте хаотичных перемен без плана',
  6: 'Избегайте жертвенного поведения',
  7: 'Избегайте полной изоляции от людей',
  8: 'Избегайте давления на окружающих',
  9: 'Избегайте резких обрывов отношений',
};

const unlockByMission: Record<number, string> = {
  1: 'Ваш потенциал раскрывается через лидерство — начните вести, а не ждать',
  2: 'Ваш потенциал раскрывается через партнёрство — найдите своего человека',
  3: 'Ваш потенциал раскрывается через слово — начните создавать контент',
  4: 'Ваш потенциал раскрывается через систему — постройте процессы',
  5: 'Ваш потенциал раскрывается через разнообразие — не бойтесь экспериментов',
  6: 'Ваш потенциал раскрывается через заботу — помогайте, но не жертвуйте',
  7: 'Ваш потенциал раскрывается через знания — станьте экспертом',
  8: 'Ваш потенциал раскрывается через масштаб — думайте больше',
  9: 'Ваш потенциал раскрывается через отпускание — завершите старое',
};

export function calculateActionPlan(
  personalYear: number,
  consciousness: number,
  action: number,
  missionNumber: number,
  missingDigits: number[],
  strongDigits: number[]
): ActionPlanModule {
  const lang = i18n.language;
  const set = getActionSet(lang);
  const L = getActionLabels(lang);
  const doNowD = set?.doNow ?? doNowByYear;
  const strengthenD = set?.strengthen ?? strengthenByConsciousness;
  const avoidD = set?.avoid ?? avoidByAction;
  const unlockD = set?.unlock ?? unlockByMission;
  const adviceD = set?.advice;

  const doNow: string[] = [
    doNowD[personalYear] || L.fallbackDoNow,
  ];
  // Add based on missing
  if (missingDigits.length > 0) {
    doNow.push(L.workEnergy(missingDigits[0], getShortAdvice(missingDigits[0], adviceD)));
  }

  const strengthen: string[] = [
    strengthenD[consciousness] || L.fallbackStrengthen,
  ];
  if (strongDigits.length > 0) {
    strengthen.push(L.useStrong(strongDigits[0]));
  }

  const avoid: string[] = [
    avoidD[action] || L.fallbackAvoid,
  ];
  if ([7, 8, 9].includes(personalYear)) {
    avoid.push(L.crisisAvoid);
  }

  const unlockPotential: string[] = [
    unlockD[missionNumber] || L.fallbackUnlock,
  ];

  return { doNow, strengthen, avoid, unlockPotential };
}

function getShortAdvice(digit: number, localized?: Record<number, string>): string {
  const advice: Record<number, string> = {
    1: 'научитесь принимать решения самостоятельно',
    2: 'развивайте эмпатию и умение слушать',
    3: 'начните выражать себя публично',
    4: 'создайте структуру в повседневности',
    5: 'позвольте себе перемены',
    6: 'научитесь заботиться без самопожертвования',
    7: 'начните задавать глубокие вопросы',
    8: 'наведите порядок в финансах',
    9: 'научитесь завершать циклы',
  };
  return (localized && localized[digit]) || advice[digit] || '';
}
