import chakrasData from "./chakras.json";
import solarActivity from "../api/solarActivityModel.json";
import kpIndex from "../api/kpIndex.json";

// Определение Титхи (Лунного дня)
function getCurrentTithi(lunarLongitude: number): number {
    return Math.floor(lunarLongitude / 12) + 1;
}

// Определение Чакры по Титхи (разбиваем 30 Титхи на 7 Чакр)
function getChakraFromTithi(tithi: number): number {
    return Math.floor((tithi - 1) / 4.29) + 1;
}

// Чакра по 52-дневному биоритму
function getChakra52Cycle(birthDate: string, currentDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date(currentDate);
    const daysPassed = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor((daysPassed % 52) / 7.43) + 1;
}

// Чакра года (по году рождения)
function getChakraFromYear(date: string): number {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}

// Чакра по дню недели (Вара)
function getChakraFromWeekday(date: string): number {
    const weekday = new Date(date).getDay(); // 0 = воскресенье, 6 = суббота
    return (weekday % 7) + 1;
}

// **🔥 Обновленный персонализированный метод расчета Чакры дня**
export function getPersonalChakraDay(birthDate: string, currentDate: string, moonDegree: number): number {
    const yearChakra = getChakraFromYear(birthDate);
    const cycleChakra = getChakra52Cycle(birthDate, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const chakraTitthi = getChakraFromTithi(tithi);
    const chakraWeekday = getChakraFromWeekday(currentDate);
    const chakraMoon = getChakraFromTithi(Math.floor(moonDegree / 12) + 1);

    const chakraDay = Math.round(
        (yearChakra * 0.3) +
        (cycleChakra * 0.3) +
        (chakraTitthi * 0.2) +
        (chakraWeekday * 0.1) +
        (chakraMoon * 0.1)
    );

    return chakraDay > 7 ? 7 : chakraDay;
}

export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
  // 🔹 Сопоставление накшатра (1–27) → чакра (1–7)
  const nakshatraToChakra = [
    1, 1, 1,  // Ашвини, Бхарани, Криттика
    2, 2, 2,  // Рохини, Мригашира, Ардра
    3, 3, 3,  // Пунарвасу, Пушья, Ашлеша
    4, 4, 4,  // Магха, Пурвапхалгуни, Уттарапхалгуни
    5, 5, 5,  // Хаста, Читра, Свати
    6, 6, 6,  // Вишакха, Анурадха, Джештха
    7, 7, 7,  // Мула, Пурвашадха, Уттарашадха
    1, 1, 1   // Шравана, Дхаништха, Шатабхиша (снова 1–3 накшатры — 1 чакра)
  ];

  const sunNakshatraIndex = Math.floor(sunDegree / (360 / 27));
  const moonNakshatraIndex = Math.floor(moonDegree / (360 / 27));

  const solarChakra = nakshatraToChakra[sunNakshatraIndex] || 1;
  const lunarChakra = nakshatraToChakra[moonNakshatraIndex] || 1;

  // 🔸 Получаем данные о пятнах и бурях
  const solarEntry = solarActivity.find(entry => entry.d === dateOfBirth);
  const kpEntry = kpIndex.find(entry => entry.d === dateOfBirth);

  const solarValue = solarEntry ? solarEntry.a : 0;
  const kpValue = kpEntry ? kpEntry.k : 0;

  const normSolar = Math.min(solarValue, 1);        // уже нормализовано
  const normKp = Math.min(kpValue / 9, 1);          // нормализуем в диапазон 0–1

  // 🔸 Определяем фазу чакры рождения
  let chakraPhaseIndex = 0; // 0 = balance, 1 = excess, 2 = block

  if ([1, 3, 5].includes(solarChakra)) {
    if (normSolar >= 0.66) chakraPhaseIndex = 1;       // excess
    else if (normSolar <= 0.33) chakraPhaseIndex = 2;  // block
  } else if ([2, 4, 6].includes(solarChakra)) {
    if (normKp >= 0.66) chakraPhaseIndex = 1;
    else if (normKp <= 0.33) chakraPhaseIndex = 2;
  } else {
    chakraPhaseIndex = 0; // для 7 чакры — всегда balance (или можешь иначе решить)
  }

  const chakraSun = chakrasData.chakras[solarChakra - 1];
  const chakraMoon = chakrasData.chakras[lunarChakra - 1];
  const chakraPhaseKeys = ['balance', 'excess', 'block'];
  const chakraPhaseKey = chakraPhaseKeys[chakraPhaseIndex];

  const chakraPhase = chakraSun.states[chakraPhaseKey];

  const yearChakra = getChakraFromYear(dateOfBirth);
  const dayChakra = getPersonalChakraDay(dateOfBirth, currentDate, moonDegree);

  return {
    result: {
      birth: {
        chakraNumber: solarChakra,
        chakraEmoji: chakraSun.emoji,
        chakraTitle: chakraSun.title,
        chakraName: chakraSun.name,
        inner: chakraPhase.inner,
        outer: chakraPhase.outer,
        relationship: chakraPhase.relationship,
        link: chakraSun.link,
        lovelink: chakraSun.lovelink,
        lunarDescription: chakraMoon.desc,
        lunarEmoji: chakraMoon.emoji,
        lunarNumber: lunarChakra,
        lunarTitle: chakraMoon.title,
        lunarName: chakraMoon.name
      },
      currentPath: chakrasData.chakras[yearChakra - 1].path,
      today: `${chakrasData.chakras[dayChakra - 1].name} и ${chakrasData.chakras[lunarChakra - 1].name}`,
      todayText: chakrasData.chakras[dayChakra - 1].day
    }
  };
}


export function analyzeQuery(answers: boolean[]) {
    const yearQuarter = getChakraFromYear(new Date().toISOString().split("T")[0]);

    let interpretation = "";
    let growthVector = "";
    let queryOrganicity: string[] = [];

    // Определяем, какие чакры выбраны пользователем
    const selectedChakras = answers
        .map((answer, index) => (answer ? index + 1 : null))
        .filter((index) => index !== null) as number[];

    if (selectedChakras.length === 1) {
        interpretation = "Сегодняшний день поддерживает вас в этом направлении.";
    } else if (selectedChakras.length === 0) {
        interpretation = "Вы не выбрали ни одного направления, сложно сделать вывод.";
    } else {
        interpretation = "Ваш запрос сочетает несколько направлений, что делает его сложнее для анализа.";
    }

    let chakraMatches = 0;
    let movementDescriptions: string[] = [];
    
    selectedChakras.forEach((chakra) => {
        if (chakra === yearQuarter) {
            movementDescriptions.push("полностью соответствует вашему текущему пути");
            chakraMatches++;
        } else if (chakra === yearQuarter + 1) {
            movementDescriptions.push("ведет вас вперед по пути развития");
            chakraMatches++;
        } else if (chakra === yearQuarter - 1) {
            movementDescriptions.push("возвращает вас к прошлым энергиям");
        } else {
            movementDescriptions.push("не соответствует вашему текущему пути");
        }
    });

    if (movementDescriptions.length > 0) {
        growthVector = `Этот вопрос ${movementDescriptions.join(", ")}.`;
    } else {
        growthVector = "Этот запрос может быть важен, но он уводит вас в сторону.";
    }

    // Заполняем queryOrganicity без дублирования одинаковых фраз
    selectedChakras.forEach((chakra) => {
        if (chakra === yearQuarter) {
            queryOrganicity.push("естественный и актуальный");
        } else if (chakra === yearQuarter + 1) {
            queryOrganicity.push("помогает вам развиваться");
        } else if (chakra === yearQuarter - 1) {
            queryOrganicity.push("связан с прошлым опытом");
        } else {
            queryOrganicity.push("не имеет прямого отношения к вашему текущему пути");
        }
    });

    // Убираем дубли
    queryOrganicity = [...new Set(queryOrganicity)];

    return { interpretation, growthVector, queryOrganicity };
}
export { getCurrentTithi, getChakraFromTithi };
