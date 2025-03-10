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

    // Чакра дня
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
        🌟 **Твоя основная чакра:** ${chakraSun.emoji} ${solarChakra}-я Чакра (${chakraSun.name})  
        \t- 🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        \t- 🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        \t- ❤️ Отношения: ${chakraSun.phases[0].relationship}  

        🔄 **Текущие энергии:**  
        ⚡ Энергия изменений (52-дневный цикл): ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-я Чакра (${chakrasData.chakras[cycleChakra - 1].name})  
        🌙 Энергия существования (Титхи): ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-я Чакра (${chakrasData.chakras[lunarChakra - 1].name})  

        📅 **Дополнительные ритмы:**  
        🏵️ Чакра года: ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-я Чакра (${chakrasData.chakras[yearChakra - 1].name})  
        🔅 Чакра дня: ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-я Чакра (${chakrasData.chakras[dayChakra - 1].name})  
        `,
        logs: debugLogs
    };
}
