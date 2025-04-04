import chakrasData from "./chakras.json";
import solarActivity from "../api/solarActivityModel.json";
import kpIndex from "../api/kpIndex.json";

// 🔸 Соответствие: накшатра (1–27) → чакра (1–7)
export const nakshatraToChakra = [
  1, 2, 3,  // 1. Ашвини, 2. Бхарани, 3. Криттика
  5, 7, 3,  // 4. Рохини, 5. Мригашира, 6. Ардра
  4, 6, 6,  // 7. Пунавасу, 8. Пушья, 9. Ашлеша
  1, 2, 4,  // 10. Магха, 11. Пурва Пхалгуни, 12. Уттара Пхалгуни
  5, 3, 6,  // 13. Хаста, 14. Читра, 15. Свати
  3, 4, 1,  // 16. Вишакха, 17. Анурадха, 18. Джештха
  7, 5, 7,  // 19. Мула, 20. Пурва Ашадха, 21. Уттара Ашадха
  7, 5, 7,  // 22. Шравана, 23. Дхаништха, 24. Шатабхиша
  1, 7, 7   // 25. Пурва Бхадрапада, 26. Уттара Бхадрапада, 27. Ревати
];

export const nakshatraNames = [
  "Ашвини", "Бхарани", "Криттика", "Рохини", "Мригашира", "Ардра",
  "Пунавасу", "Пушья", "Ашлеша", "Магха", "Пурва Пхалгуни", "Уттара Пхалгуни",
  "Хаста", "Читра", "Свати", "Вишакха", "Анурадха", "Джештха",
  "Мула", "Пурва Ашадха", "Уттара Ашадха", "Шравана", "Дхаништха", "Шатабхиша",
  "Пурва Бхадрапада", "Уттара Бхадрапада", "Ревати"
];

export const nakshatraPostIds = [
    "DH7_GNDxmc2", "DH7-yo0RL32", "DH7-39BxDVm", "DH7_ZuRx-9U", "DH7_-YwRUTD",
    "DH7-6cvR4c_", "DH7_MdwxBMq", "DH7_ykXRAR6", "DH7_2DyRsqk", "DH7_JdyRDD3",
    "DH7-0xOxTA2", "DH7_dlzRFCF", "DH7_DBqxoMy", "DH7-9mnx66d", "DH8AAxIx1Ku",
    "DH8AYlHxXRm", "DH7_fdexsrV", "DH7_PL6R-Ns", "DH7_5rSRthF", "DH7_rGjRlmp",
    "DH7_kVgRr5P", "DH7_vr4xCOp", "DH7_tF9xo9d", "DH7_oPBxOGh", "DH78ngkR04m",
    "DH7_UlDx8b4", "DH7-_ykxKmK"
  ];
// Чакра года (по году рождения)
function getChakraFromYear(date: string): number {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}


// **🔥 Обновленный персонализированный метод расчета Чакры дня**
export function getPersonalChakraDay(sunDegree: number): number {

  const sunNakshatraIndex = Math.floor(sunDegree / (360 / 27));
  const sunChakra = nakshatraToChakra[sunNakshatraIndex] || 1;

  return sunChakra;
}

import chakrasData from "./chakras.json";
import nakshatraToChakra from "./nakshatraToChakra.json";

export function getBirthChakra(birthDate, sunDegree, moonDegree) {
  const nakshatraIndex = Math.floor(sunDegree / (360 / 27));
  const lunarNakshatraIndex = Math.floor(moonDegree / (360 / 27));

  const chakraNumber = nakshatraToChakra[nakshatraIndex];
  const lunarChakraNumber = nakshatraToChakra[lunarNakshatraIndex];

  const chakra = chakrasData.chakras.find(c => c.id === chakraNumber);
  const lunarChakra = chakrasData.chakras.find(c => c.id === lunarChakraNumber);

  const todayNakshatraName = chakra.nakshatraNames[nakshatraIndex % chakra.nakshatraNames.length];
  const todayNakshatraLink = chakra.nakshatraLinks[nakshatraIndex % chakra.nakshatraLinks.length];

  const todayLunarNakshatraName = lunarChakra.nakshatraNames[lunarNakshatraIndex % lunarChakra.nakshatraNames.length];
  const todayLunarNakshatraLink = lunarChakra.nakshatraLinks[lunarNakshatraIndex % lunarChakra.nakshatraLinks.length];

  const result = {
    birth: {
      chakraNumber,
      chakraEmoji: chakra.emoji,
      chakraTitle: chakra.title,
      chakraName: chakra.name,
      inner: chakra.states.balance.inner,
      outer: chakra.states.balance.outer,
      relationship: chakra.states.balance.relationship,
      link: chakra.link,
      lovelink: chakra.lovelink,
      lunarDescription: lunarChakra.desc,
      lunarEmoji: lunarChakra.emoji,
      lunarNumber: lunarChakra.id,
      lunarTitle: lunarChakra.title,
      lunarName: lunarChakra.name,
      nakshatraInstagram: chakra.nakshatraLinks[nakshatraIndex % chakra.nakshatraLinks.length],
      nakshatraName: todayNakshatraName,
      nakshatraLink: todayNakshatraLink
    },
    currentPath: chakra.path,
    today: `${chakra.name} и ${lunarChakra.name}`,
    todayText: chakra.day,
    chakraPeriod: chakraNumber,
    chakraDay: lunarChakraNumber,
    todayNakshatraName,
    todayNakshatraLink,
    todayLunarNakshatraName,
    todayLunarNakshatraLink
  };

  return { result };
}

function convertToJulianDate(dateString: string): string {
  const date = new Date(dateString);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return `${date.getFullYear()}-${dayOfYear.toString().padStart(3, "0")}`;
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
