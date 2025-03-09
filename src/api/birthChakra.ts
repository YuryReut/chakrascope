import chakrasData from "../api/chakras.json";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";

export function getBirthChakra(dateOfBirth: string) {
    let debugLogs: string[] = [];
    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    // Ищем данные в solar.json и lunar.json
    const solarEntry = solarData.find(entry => entry.Date === dateOfBirth);
    const lunarEntry = lunarData.find(entry => entry.Date === dateOfBirth);

    if (!solarEntry || !lunarEntry) {
        debugLogs.push("🚨 Ошибка: Дата вне диапазона данных!");
        return { result: "Дата вне диапазона данных", logs: debugLogs };
    }

    debugLogs.push(`🌞 Градусы Солнца: ${solarEntry.Solar_Longitude}`);
    debugLogs.push(`🌙 Градусы Луны: ${lunarEntry.Lunar_Longitude}`);

    // Определяем чакры и фазы
    const sunChakra = getChakraAndPhase(solarEntry.Solar_Longitude);
    const moonChakra = getChakraAndPhase(lunarEntry.Lunar_Longitude);

    debugLogs.push(`✅ Чакра Солнца: ${sunChakra.chakra}, фаза ${sunChakra.phase}`);
    debugLogs.push(`✅ Чакра Луны: ${moonChakra.chakra}, фаза ${moonChakra.phase}`);

    return {
        result: {
            sun: sunChakra,
            moon: moonChakra
        },
        logs: debugLogs
    };
}

// Функция для вычисления чакры и фазы
function getChakraAndPhase(degree: number) {
    const chakraIndex = Math.floor(degree / 51.4286); // 360° / 7 чакр
    const padaIndex = Math.floor((degree % 51.4286) / (51.4286 / 4)); // 4 пады

    const chakra = chakrasData.chakras[chakraIndex]; // Берём чакру по индексу
    const phase = chakra.phases[padaIndex]; // Фаза по паде

    return {
        chakra: chakra.name,
        title: chakra.title,
        phase: padaIndex + 1,
        description: {
            inner: phase.inner,
            outer: phase.outer,
            relationship: phase.relationship
        }
    };
}
