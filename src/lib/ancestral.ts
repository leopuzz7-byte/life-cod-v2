// Родовая нумерология - Ancestral Numerology

export interface AncestralResult {
  birthDate: { day: number; month: number; year: number };
  gender: 'male' | 'female';
  
  // 4 рабочих числа
  workingNumbers: {
    first: number;   // сумма всех цифр даты
    second: number;  // сумма цифр первого
    third: number;   // зависит от года (до/после 2000)
    fourth: number;  // сумма цифр третьего
  };
  
  // Кармическая родовая звезда (количество каждой цифры)
  starCounts: {
    twos: number;    // цифра 2
    fours: number;   // цифра 4
    fives: number;   // цифра 5
    sevens: number;  // цифра 7
    eights: number;  // цифра 8
  };
  
  // Роли в роду
  roles: {
    isKeeper: boolean;      // Хранитель рода
    isHealer: boolean;      // Целитель рода
    isLastHope: boolean;    // Последняя надежда (только женщины)
    hasCurse: boolean;      // Родовое проклятие/зарок
  };
  
  // Все цифры для отображения
  allDigits: string;
}

// Сумма цифр числа
function sumDigitsSimple(num: number): number {
  return Math.abs(num)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

// Подсчёт количества определённой цифры в строке
function countDigit(str: string, digit: string): number {
  return str.split('').filter(d => d === digit).length;
}

// Расчёт родовых программ
export function calculateAncestralPrograms(
  day: number,
  month: number,
  year: number,
  gender: 'male' | 'female'
): AncestralResult {
  // Форматируем дату в строку цифр
  const dayStr = day.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString();
  const dateDigits = dayStr + monthStr + yearStr;
  
  // Определяем методику по году рождения
  const isBefore2000 = year < 2000;
  
  let first: number, second: number, third: number, fourth: number;
  
  // Первое рабочее число - сумма всех цифр даты
  first = sumDigitsSimple(parseInt(dateDigits));
  
  // Второе рабочее число - сумма цифр первого
  second = first >= 10 ? sumDigitsSimple(first) : first;
  
  if (isBefore2000) {
    // Методика для рождённых до 2000 года
    // Третье число = первое число - (первая цифра дня × 2)
    const firstDayDigit = parseInt(dayStr[0]) || parseInt(dayStr[1]); // Если первая цифра 0, берём вторую
    third = first - (firstDayDigit * 2);
    if (third < 0) third = Math.abs(third);
  } else {
    // Методика для рождённых с 2000 года
    // Третье число = первое число + 19
    third = first + 19;
  }
  
  // Четвёртое рабочее число - сумма цифр третьего
  fourth = third >= 10 ? sumDigitsSimple(third) : third;
  
  // Собираем все цифры для подсчёта (дата + 4 рабочих числа)
  const workingNumbersStr = first.toString() + second.toString() + third.toString() + fourth.toString();
  const allDigits = dateDigits + workingNumbersStr;
  
  // Подсчёт цифр для кармической звезды
  const starCounts = {
    twos: countDigit(allDigits, '2'),
    fours: countDigit(allDigits, '4'),
    fives: countDigit(allDigits, '5'),
    sevens: countDigit(allDigits, '7'),
    eights: countDigit(allDigits, '8'),
  };
  
  // Определение ролей
  // Хранитель рода: второе число = 11, четвёртое = 9
  const isKeeper = second === 11 && fourth === 9;
  
  // Целитель рода: второе число = 11, четвёртое = 7
  const isHealer = second === 11 && fourth === 7;
  
  // Последняя надежда рода: женщина И (нет пятёрок ИЛИ нет восьмёрок)
  const isLastHope = gender === 'female' && (starCounts.fives === 0 || starCounts.eights === 0);
  
  // Родовое проклятие/зарок: второе ИЛИ четвёртое число = 6
  const hasCurse = second === 6 || fourth === 6;
  
  return {
    birthDate: { day, month, year },
    gender,
    workingNumbers: { first, second, third, fourth },
    starCounts,
    roles: { isKeeper, isHealer, isLastHope, hasCurse },
    allDigits
  };
}
