import solarDataRaw from "./solar.json";
import lunarDataRaw from "./lunar.json";

// Определение типов
interface ChakraEntry {
    Date: string;
    Solar_Longitude?: number;
    Lunar_Longitude?: number;
}

// Преобразуем данные в массив (если вдруг импортируется объект)
const solarData: ChakraEntry[] = Array.isArray(solarDataRaw) ? solarDataRaw : Object.values(solarDataRaw);
const lunarData: ChakraEntry[] = Array.isArray(lunarDataRaw) ? lunarDataRaw : Object.values(lunarDataRaw);

export function getBirthChakra(dateOfBirth: string) {
    let debugLogs: string[] = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    const solarEntry = solarData.find(entry => entry.Date === dateOfBirth);
    const lunarEntry = lunarData.find(entry => entry.Date === dateOfBirth);

    debugLogs.push(`🌞 Найденная запись для Солнца: ${solarEntry ? JSON.stringify(solarEntry) : "❌ Дата не найдена"}`);
    debugLogs.push(`🌙 Найденная запись для Луны: ${lunarEntry ? JSON.stringify(lunarEntry) : "❌ Дата не найдена"}`);

    if (!solarEntry || !lunarEntry) {
        debugLogs.push("🚨 Ошибка: Дата вне диапазона данных!");
        return {
            result: "Дата вне диапазона данных",
            logs: debugLogs
        };
    }

    const sunDegree = solarEntry.Solar_Longitude ?? "❌ Нет данных";
    const moonDegree = lunarEntry.Lunar_Longitude ?? "❌ Нет данных";

    debugLogs.push(`✅ Итог: Градусы Солнца: ${sunDegree} | Градусы Луны: ${moonDegree}`);

    return {
        result: {
            sunDegree,
            moonDegree
        },
        logs: debugLogs
    };
}
