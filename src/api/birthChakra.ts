import * as solarData from "./solar.json";
import * as lunarData from "./lunar.json";
import * as chakrasData from "./chakras.json";

// Функция для конвертации "YYYY-MM-DD" → "YYYY-DDD"
function convertToJulian(date: string): string {
    const parsedDate = new Date(date);
    const startOfYear = new Date(parsedDate.getFullYear(), 0, 0);
    const diff = parsedDate.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${parsedDate.getFullYear()}-${dayOfYear.toString().padStart(3, "0")}`;
}

export function getBirthChakra(dateOfBirth: string) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    const julianDate = convertToJulian(dateOfBirth);
    debugLogs.push(`📅 Преобразованная дата для поиска: ${julianDate}`);

    const solarEntry = solarData.find(entry => entry.Date === julianDate);
    const lunarEntry = lunarData.find(entry => entry.Date === julianDate);

    debugLogs.push(`🌞 Найденная запись для Солнца: ${solarEntry ? JSON.stringify(solarEntry) : "❌ Дата не найдена"}`);
    debugLogs.push(`🌙 Найденная запись для Луны: ${lunarEntry ? JSON.stringify(lunarEntry) : "❌ Дата не найдена"}`);

    if (!solarEntry || !lunarEntry) {
        debugLogs.push("🚨 Ошибка: Дата вне диапазона данных!");
        return {
            result: "Дата вне диапазона данных",
            logs: debugLogs
        };
    }

    // Определяем чакру по градусам
    const getChakraInfo = (degree: number) => {
        const chakraIndex = Math.floor(degree / 51.42) % 7; // 360° / 7 чакр
        const phaseIndex = Math.floor((degree % 51.42) / (51.42 / 4)); // Разделение на 4 фазы

        const chakraData = chakrasData[chakraIndex];
        return {
            chakra: chakraData.name,
            title: chakraData.title,
            phase: phaseIndex + 1, // Фаза от 1 до 4
            description: chakraData.phases[phaseIndex]
        };
    };

    const sunChakra = getChakraInfo(solarEntry.Solar_Longitude);
    const moonChakra = getChakraInfo(lunarEntry.Lunar_Longitude);

    debugLogs.push(`✅ Итог: Чакра Солнца – ${sunChakra.chakra} (${sunChakra.title}), фаза ${sunChakra.phase}`);
    debugLogs.push(`✅ Итог: Чакра Луны – ${moonChakra.chakra} (${moonChakra.title}), фаза ${moonChakra.phase}`);

    return {
        result: {
            sun: sunChakra,
            moon: moonChakra
        },
        logs: debugLogs
    };
}
