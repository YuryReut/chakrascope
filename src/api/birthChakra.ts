import chakrasData from "./chakras.json";
import dayEQ7Data from "./dayEQ7_data.json";

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

// **🔥 Персонализированный метод расчета Чакры дня**
function getPersonalChakraDay(birthDate: string, currentDate: string, moonDegree: number): number {
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
    const yearChakra = getChakraFromYear(dateOfBirth);
    const cycleChakra = getChakra52Cycle(dateOfBirth, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const lunarChakra = getChakraFromTithi(tithi);
    const solarChakra = getChakraFromTithi(Math.floor(sunDegree / 12) + 1);
    const chakraSun = chakrasData.chakras[solarChakra - 1];
    const chakraMoon = chakrasData.chakras[lunarChakra - 1];
    const dayChakra = getPersonalChakraDay(dateOfBirth, currentDate, moonDegree);

    return {
        solarChakra,
        lunarChakra,
        result: `
        🔆 Ты действуешь из ${chakraSun.emoji} ${solarChakra}-й чакры ${chakraSun.title} (${chakraSun.name}).
        🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        ❤️ В отношениях: ${chakraSun.phases[0].relationship}  
        
        📆 Для тебя это год про ${chakrasData.chakras[yearChakra - 1].desc} из ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры ${chakrasData.chakras[yearChakra - 1].title}.
        🔄 По 52-дневному циклу, энергия Солнца сейчас в ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-й Чакре ${chakrasData.chakras[cycleChakra - 1].title}.
       
        🌙 Лунная энергия:  
        Твое восприятие реальности — ${chakraMoon.desc} благодаря ${chakraMoon.emoji} ${lunarChakra}-й Чакре ${chakraMoon.title}.
        
        📅 Сегодня:
        Твои решения в фокусе ${chakrasData.chakras[dayChakra - 1].desc} из ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-й Чакры ${chakrasData.chakras[dayChakra - 1].title}.
        `
    };
}

// **Функция для получения рекомендаций по состоянию дня**
export function getDayEQ7Recommendations(solarChakra: number, lunarChakra: number, solarState: string, lunarState: string) {
    const solarChakraName = Object.keys(dayEQ7Data.chakras)[solarChakra - 1];
    const lunarChakraName = Object.keys(dayEQ7Data.chakras)[lunarChakra - 1];
    
    const solarRecommendation = dayEQ7Data.chakras[solarChakraName]?.sun_recommendations?.[solarState] || "Нет данных";
    const lunarRecommendation = dayEQ7Data.chakras[lunarChakraName]?.moon_recommendations?.[lunarState] || "Нет данных";

    return {
        actions: solarRecommendation,
        understanding: lunarRecommendation
    };
}
