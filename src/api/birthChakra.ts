import solarDataRaw from "./solar.json";
import lunarDataRaw from "./lunar.json";

// Преобразуем данные в массив
const solarData = Array.isArray(solarDataRaw) ? solarDataRaw : Object.values(solarDataRaw);
const lunarData = Array.isArray(lunarDataRaw) ? lunarDataRaw : Object.values(lunarDataRaw);

export function getBirthChakra(dateOfBirth: string) {
    let debugLogs: string[] = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    const solarEntry = solarData.find((entry: any) => entry.Date === dateOfBirth);
    const lunarEntry = lunarData.find((entry: any) => entry.Date === dateOfBirth);

    debugLogs.push(`🌞 Найденная запись для Солнца: ${solarEntry ? JSON.stringify(solarEntry) : "❌ Дата не найдена"}`);
    debugLogs.push(`🌙 Найденная запись для Луны: ${lunarEntry ? JSON.stringify(lunarEntry) : "❌ Дата не найдена"}`);

    if (!solarEntry || !lunarEntry) {
        debugLogs.push("🚨 Ошибка: Дата вне диапазона данных!");
        return {
            result: "Дата вне диапазона данных",
            logs: debugLogs
        };
    }

    debugLogs.push(`✅ Итог: Градусы Солнца: ${solarEntry["Solar_Longitude"]} | Градусы Луны: ${lunarEntry["Lunar_Longitude"]}`);

    return {
        result: {
            sunDegree: solarEntry["Solar_Longitude"],
            moonDegree: lunarEntry["Lunar_Longitude"]
        },
        logs: debugLogs
    };
}
