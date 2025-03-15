import chakrasData from "./chakras.json";
import dayEQ7Data from "./dayEQ7_data.json";

// Определение Титхи (Лунного дня)
function getCurrentTithi(lunarLongitude: number): number {
    return Math.floor(lunarLongitude / 12) + 1;
}

// Определение Чакры по Титхи
function getChakraFromTithi(tithi: number): string {
    const chakraKeys = Object.keys(chakrasData.chakras);
    return chakraKeys[Math.floor((tithi - 1) / 4.29)] || chakraKeys[0];
}

// Чакра по 52-дневному биоритму
function getChakra52Cycle(birthDate: string, currentDate: string): string {
    const birth = new Date(birthDate);
    const now = new Date(currentDate);
    const daysPassed = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const chakraKeys = Object.keys(chakrasData.chakras);
    return chakraKeys[Math.floor((daysPassed % 52) / 7.43)] || chakraKeys[0];
}

// Чакра года
function getChakraFromYear(date: string): string {
    const year = new Date(date).getFullYear();
    const chakraKeys = Object.keys(chakrasData.chakras);
    return chakraKeys[(year - 1950) % chakraKeys.length];
}

// Чакра по дню недели
function getChakraFromWeekday(date: string): string {
    const weekday = new Date(date).getDay();
    const chakraKeys = Object.keys(chakrasData.chakras);
    return chakraKeys[weekday % chakraKeys.length];
}

// Получение Чакры дня
function getPersonalChakraDay(birthDate: string, currentDate: string, moonDegree: number): string {
    const yearChakra = getChakraFromYear(birthDate);
    const cycleChakra = getChakra52Cycle(birthDate, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const chakraTitthi = getChakraFromTithi(tithi);
    const chakraWeekday = getChakraFromWeekday(currentDate);
    const chakraMoon = getChakraFromTithi(Math.floor(moonDegree / 12) + 1);
    
    return chakraTitthi; // Основная чакра дня
}

// Определение состояния чакры дня
export function getDayChakraState(sunChakra: string, moonChakra: string, sunState: keyof typeof dayEQ7Data.chakras["Муладхара"].states, moonState: keyof typeof dayEQ7Data.chakras["Муладхара"].states) {
    return {
        actions: `Твои действия: ${dayEQ7Data.chakras[sunChakra]?.sun_recommendations[sunState] || "Нет рекомендаций"}`,
        understanding: `Твое понимание: ${dayEQ7Data.chakras[moonChakra]?.moon_recommendations[moonState] || "Нет рекомендаций"}`,
        sunDescription: dayEQ7Data.chakras[sunChakra]?.states[sunState] || "Описание отсутствует",
        moonDescription: dayEQ7Data.chakras[moonChakra]?.states[moonState] || "Описание отсутствует",
    };
}

// Основная функция Чакроскопа
export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
    let debugLogs: string[] = [];
    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    const yearChakra = getChakraFromYear(dateOfBirth);
    const cycleChakra = getChakra52Cycle(dateOfBirth, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const lunarChakra = getChakraFromTithi(tithi);
    const solarChakra = getChakraFromTithi(Math.floor(sunDegree / 12) + 1);
    const chakraSun = chakrasData.chakras[solarChakra];
    const chakraMoon = chakrasData.chakras[lunarChakra];
    const dayChakra = getPersonalChakraDay(dateOfBirth, currentDate, moonDegree);

    return {
        result: `
        🔆 Ты действуешь из ${chakraSun.emoji} ${solarChakra}-й чакры ${chakraSun.title} (${chakraSun.name}).
        🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        ❤️ В отношениях: ${chakraSun.phases[0].relationship}  
        
        📆 Для тебя это год про ${chakrasData.chakras[yearChakra].desc} из ${chakrasData.chakras[yearChakra].emoji} ${yearChakra}-й Чакры ${chakrasData.chakras[yearChakra].title} (${chakrasData.chakras[yearChakra].name}).
        🔄 Прямо сейчас, по 52-дневному циклу, энергия Солнца дает тебе ${chakrasData.chakras[cycleChakra].desc} через ${chakrasData.chakras[cycleChakra].emoji} ${cycleChakra}-ю Чакру ${chakrasData.chakras[cycleChakra].title} (${chakrasData.chakras[cycleChakra].name}).  
       
        🌙 Лунная энергия:  
        Твое восприятие реальности — это ${chakraMoon.desc} благодаря ${chakraMoon.emoji} ${lunarChakra}-й Чакре ${chakraMoon.title} (${chakraMoon.name}).
        
        📅 Сегодня:
        Твои решения в фокусе ${chakrasData.chakras[dayChakra].desc} из ${chakrasData.chakras[dayChakra].emoji} ${dayChakra}-й Чакры ${chakrasData.chakras[dayChakra].title} (${chakrasData.chakras[dayChakra].name}). 
        С эмоциональной точки зрения, реальность ощущается как ${chakrasData.chakras[lunarChakra].desc}, потому что энергия в ${chakrasData.chakras[lunarChakra].emoji} ${lunarChakra}-ой Чакре ${chakrasData.chakras[lunarChakra].title} (${chakrasData.chakras[lunarChakra].name}).
        `,
        logs: debugLogs
    };
}
