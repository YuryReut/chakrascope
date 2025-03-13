import chakrasData from "./chakras.json";

// Функция для вычисления Титхи (Лунного дня)
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

// Чакра года (цикл 7 лет)
function getChakraFromYear(date: string): number {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}

// Чакра по дню недели (Вара)
function getChakraFromWeekday(date: string): number {
    const weekday = new Date(date).getDay(); // 0 = воскресенье, 6 = суббота
    return (weekday % 7) + 1;
}

// 🔥 Новый метод расчета Чакры дня (персонализированный)
function getPersonalChakraDay(birthDate: string, currentDate: string, sunDegree: number, moonDegree: number): number {
    // Чакра года (долгосрочный вектор развития)
    const yearChakra = getChakraFromYear(birthDate);

    // Чакра 52-дневного цикла (среднесрочное влияние)
    const cycleChakra = getChakra52Cycle(birthDate, currentDate);

    // Чакра по Титхи (эмоциональное влияние дня)
    const tithi = getCurrentTithi(moonDegree);
    const chakraTitthi = getChakraFromTithi(tithi);

    // Чакра по дню недели (планетарное влияние)
    const chakraWeekday = getChakraFromWeekday(currentDate);

    // Чакра по Луне (подсознательное влияние)
    const chakraMoon = getChakraFromTithi(Math.floor(moonDegree / 12) + 1);

    // 🔥 Персонализированный расчет Чакры дня
    const chakraDay = Math.round(
        (yearChakra * 0.3) +  // Чакра года (30%)
        (cycleChakra * 0.3) + // Чакра 52-дневного цикла (30%)
        (chakraTitthi * 0.2) + // Титхи (20%)
        (chakraWeekday * 0.1) + // День недели (10%)
        (chakraMoon * 0.1) // Чакра по Луне (10%)
    );

    return chakraDay > 7 ? 7 : chakraDay; // Коррекция, чтобы не выйти за пределы 1-7
}

// 🔥 Основная функция получения Чакроскопа с учетом персональной Чакры дня
export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    // Чакра года
    const yearChakra = getChakraFromYear(dateOfBirth);

    // 52-дневный цикл
    const cycleChakra = getChakra52Cycle(dateOfBirth, currentDate);

    // Чакра по Титхи (лунному циклу)
    const tithi = getCurrentTithi(moonDegree);
    const lunarChakra = getChakraFromTithi(tithi);

    // Чакры по Солнцу и Луне
    const solarChakra = getChakraFromTithi(Math.floor(sunDegree / 12) + 1);
    const chakraSun = chakrasData.chakras[solarChakra - 1];
    const chakraMoon = chakrasData.chakras[lunarChakra - 1];

    // 🔥 Персонализированная Чакра дня
    const dayChakra = getPersonalChakraDay(dateOfBirth, currentDate, sunDegree, moonDegree);

    return {
        result: `
        🔆 Ты действуешь из ${chakraSun.emoji} ${solarChakra}-й чакры ${chakraSun.title} (${chakraSun.name}).
        Это твоя основная чакра, энергия Солнца в момент рождения раскрывает в тебе:
        🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        ❤️ В отношениях: ${chakraSun.phases[0].relationship}  
        
        📆 Для тебя это год про ${chakrasData.chakras[yearChakra - 1].desc} из ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры ${chakrasData.chakras[yearChakra - 1].title} (${chakrasData.chakras[yearChakra - 1].name}).
        🔄 Прямо сейчас, по 52-дневному циклу, энергия Солнца дает тебе ${chakrasData.chakras[cycleChakra - 1].desc} через ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-ю Чакру ${chakrasData.chakras[cycleChakra - 1].title} (${chakrasData.chakras[cycleChakra - 1].name}).  
       
        🌙 Лунная энергия:  
        Твое восприятие реальности — это ${chakraMoon.desc} благодаря ${chakraMoon.emoji} ${lunarChakra}-й Чакре ${chakraMoon.title} (${chakraMoon.name}).
        
        📅 Сегодня решения в фокусе ${chakrasData.chakras[dayChakra - 1].desc} из ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-й Чакры ${chakrasData.chakras[dayChakra - 1].title} (${chakrasData.chakras[dayChakra - 1].name}). 
        С эмоциональной точки зрения, реальность ощущается как ${chakrasData.chakras[lunarChakra - 1].desc}, потому что энергия в ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-ой Чакре ${chakrasData.chakras[lunarChakra - 1].title} (${chakrasData.chakras[lunarChakra - 1].name}).
        
        `,
        logs: debugLogs
    };
}
