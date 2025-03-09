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

function getChakraFromDate(date: string): number {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}

export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    // Чакра года (по году рождения)
    const yearChakra = getChakraFromDate(dateOfBirth);

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
        Сейчас день ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры (${chakrasData.chakras[yearChakra - 1].name}) в год ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры

        Прямо сейчас твоя:
        ⚡ Энергия изменений: ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-я Чакра (${chakrasData.chakras[cycleChakra - 1].name})  
        🌙 Энергия существования: ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-я Чакра (${chakrasData.chakras[lunarChakra - 1].name})  

        От рождения у тебя:
        🔆 Энергия, которая движет тебя вперед в ${chakraSun.emoji} ${solarChakra}-й Чакре (${chakraSun.name})  
        \t- 🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        \t- 🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        \t- ❤️ Отношения: ${chakraSun.phases[0].relationship}  

        🌙 Ты живешь из ${chakraMoon.emoji} ${lunarChakra}-й Чакры (${chakraMoon.name})  
        \t- 🌀 Внутреннее ощущение: ${chakraMoon.phases[0].inner}  
        \t- 🌍 Внешнее проявление: ${chakraMoon.phases[0].outer}  
        \t- ❤️ Отношения: ${chakraMoon.phases[0].relationship}  
        `,
        logs: debugLogs
    };
}
