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
        🔆 Твоя основная чакра (Энергия Солнца в момент рождения):
        ${chakraSun.emoji} ${solarChakra}-й Чакра (${chakraSun.name}) 
        
        🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        
        🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        
        ❤️ Отношения: ${chakraSun.phases[0].relationship}  
        
        Сейчас энергия Солнца проходит (по 52-дневному циклу): в ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-й Чакре (${chakrasData.chakras[cycleChakra - 1].name})  
       
        Лунная энергия (в момент рождения) в ${chakraMoon.emoji} ${lunarChakra}-й Чакре (${chakraMoon.name}),
        а сейчас (по циклу Титхи) в ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-й Чакре (${chakrasData.chakras[lunarChakra - 1].name})  

        Сейчас у тебя день ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-й Чакры (${chakrasData.chakras[dayChakra - 1].name}) 
        В твой год ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры (${chakrasData.chakras[yearChakra - 1].name})
        `,
        logs: debugLogs
    };
}
