import chakrasData from "./chakras.json";

function getCurrentTithi(lunarLongitude: number): number {
    return Math.floor(lunarLongitude / 12) + 1;
}

function getChakraFromTithi(tithi: number): number {
    return Math.floor((tithi - 1) / 4.29) + 1;
}

function getChakra52Cycle(birthDate: string, currentDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date(currentDate);
    const daysPassed = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor((daysPassed % 52) / 7.43) + 1;
}

function getChakraFromYear(date: string): number {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}

function getChakraFromDay(currentDate: string): number {
    const startDate = new Date(currentDate);
    const dayOfYear = Math.floor((startDate.getTime() / (1000 * 60 * 60 * 24)) % 7);
    return (dayOfYear % 7) + 1; 
}

export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    // Чакра года (по году рождения)
    const yearChakra = getChakraFromYear(dateOfBirth);

    // Чакра дня (расчёт отдельно, исправлено!)
    const dayChakra = getChakraFromDay(currentDate);

    // 52-дневный цикл
    const cycleChakra = getChakra52Cycle(dateOfBirth, currentDate);

    // Чакра по титхи (лунному циклу)
    const tithi = getCurrentTithi(moonDegree);
    const lunarChakra = getChakraFromTithi(tithi);

    // Чакры по Солнцу и Луне
    const solarChakra = getChakraFromTithi(Math.floor(sunDegree / 12) + 1);
    const chakraSun = chakrasData.chakras[solarChakra - 1];
    const chakraMoon = chakrasData.chakras[lunarChakra - 1];

    return {
        result: `
        🔆 Ты действуешь из ${chakraSun.emoji} ${solarChakra}-й чакры ${chakraSun.title} (${chakraSun.name}).
        Это твоя основная чакра, энергия Солнца в момент рождения раскрывает в тебе:
        🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        ❤️ В отношениях: ${chakraSun.phases[0].relationship}  
        
        🔄 Прямо сейчас, по 52-дневному циклу, энергия Солнца дает тебе ${chakrasData.chakras[cycleChakra - 1].desc} через ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-ю Чакру ${chakrasData.chakras[cycleChakra - 1].title} (${chakrasData.chakras[cycleChakra - 1].name}).  
       
        🌙 Лунная энергия:  
        Твое восприятие реальности — это ${chakraMoon.desc} благодаря ${chakraMoon.emoji} ${lunarChakra}-й Чакре ${chakraMoon.title} (${chakraMoon.name}).
        Сейчас, согласно циклу Титхи, реальность ощущается как ${chakrasData.chakras[lunarChakra - 1].desc}, потому что энергия в ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-ой Чакре ${chakrasData.chakras[lunarChakra - 1].title} (${chakrasData.chakras[lunarChakra - 1].name}).  

        📅 Сегодня в фокусе ${chakrasData.chakras[dayChakra - 1].desc} из ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-й Чакры ${chakrasData.chakras[dayChakra - 1].title} (${chakrasData.chakras[dayChakra - 1].name}).  

        📆 Для тебя это год про ${chakrasData.chakras[yearChakra - 1].desc} из ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры ${chakrasData.chakras[yearChakra - 1].title} (${chakrasData.chakras[yearChakra - 1].name}).
        `,
        logs: debugLogs

    };
}
