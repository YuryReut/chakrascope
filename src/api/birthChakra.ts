import chakrasData from "./chakras.json";
import dayEQ7Data from "./dayEQ7_data.json";

// Определение Титхи (Лунного дня)
function getCurrentTithi(lunarLongitude: number): number {
    return Math.floor(lunarLongitude / 12) + 1;
}

// Определение Чакры по Титхи (разбиваем 30 Титхи на 7 Чакр)
function getChakraFromTithi(tithi: number): string {
    const chakraIndex = Math.floor((tithi - 1) / 4.29);
    return Object.keys(chakrasData.chakras)[chakraIndex] || "Муладхара"; // Дефолтное значение
}

// Чакра по 52-дневному биоритму
function getChakra52Cycle(birthDate: string, currentDate: string): string {
    const birth = new Date(birthDate);
    const now = new Date(currentDate);
    const daysPassed = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const chakraIndex = Math.floor((daysPassed % 52) / 7.43);
    return Object.keys(chakrasData.chakras)[chakraIndex] || "Муладхара";
}

// Чакра года (по году рождения)
function getChakraFromYear(date: string): string {
    const year = new Date(date).getFullYear();
    return Object.keys(chakrasData.chakras)[(year - 1950) % 7] || "Муладхара";
}

// Чакра по дню недели (Вара)
function getChakraFromWeekday(date: string): string {
    const weekday = new Date(date).getDay(); // 0 = воскресенье, 6 = суббота
    return Object.keys(chakrasData.chakras)[weekday % 7] || "Муладхара";
}

// **🔥 Определение Чакры дня**
function getPersonalChakraDay(birthDate: string, currentDate: string, moonDegree: number): string {
    const yearChakra = getChakraFromYear(birthDate);
    const cycleChakra = getChakra52Cycle(birthDate, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const chakraTitthi = getChakraFromTithi(tithi);
    const chakraWeekday = getChakraFromWeekday(currentDate);
    const chakraMoon = getChakraFromTithi(Math.floor(moonDegree / 12) + 1);

    const chakraOptions = [yearChakra, cycleChakra, chakraTitthi, chakraWeekday, chakraMoon];
    return chakraOptions[Math.floor(Math.random() * chakraOptions.length)]; // Выбираем случайную чакру из рассчитанных
}

// **🔥 Получение состояния чакры дня**
export function getDayChakraState(sunChakra: string, moonChakra: string, sunState: string, moonState: string) {
    const sunDesc = dayEQ7Data.chakras[sunChakra]?.states[sunState] || "Описание отсутствует";
    const moonDesc = dayEQ7Data.chakras[moonChakra]?.states[moonState] || "Описание отсутствует";

    return {
        actions: `Твои действия: ${dayEQ7Data.chakras[sunChakra]?.sun_recommendations[sunState] || "Нет рекомендаций"}`,
        understanding: `Твое понимание: ${dayEQ7Data.chakras[moonChakra]?.moon_recommendations[moonState] || "Нет рекомендаций"}`,
        sunDescription: sunDesc,
        moonDescription: moonDesc,
    };
}

// **🔥 Основная функция Чакроскопа**
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
