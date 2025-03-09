import solarData from "./solar.json";
import lunarData from "./lunar.json";

export function getBirthChakra(dateOfBirth: string) {
    let debugLogs: string[] = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    // Преобразуем JSON в массив (если он импортируется как объект)
    const solarArray = Array.isArray(solarData) ? solarData : Object.values(solarData);
    const lunarArray = Array.isArray(lunarData) ? lunarData : Object.values(lunarData);

    const solarEntry = solarArray.find((entry: any) => entry.Date === dateOfBirth);
    const lunarEntry = lunarArray.find((entry: any) => entry.Date === dateOfBirth);

    debugLogs.push(`🌞 Найденная запись для Солнца: ${solarEntry ? JSON.stringify(solarEntry) : "❌ Дата не найдена"}`);
    debugLogs.push(`🌙 Найденная запись для Луны: ${lunarEntry ? JSON.stringify(lunarEntry) : "❌ Дата не найдена"}`);

    if (!solarEntry || !lunarEntry) {
        debugLogs.push("🚨 Ошибка: Дата вне диапазона данных!");
        return {
            result: "Дата вне диапазона данных",
            logs: debugLogs
        };
    }

    debugLogs.push(`✅ Итог: Градусы Солнца: ${solarEntry.Solar_Longitude} | Градусы Луны: ${lunarEntry.Lunar_Longitude}`);

    return {
        result: {
            sunDegree: solarEntry.Solar_Longitude,
            moonDegree: lunarEntry.Lunar_Longitude
        },
        logs: debugLogs
    };
}
