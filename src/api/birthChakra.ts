import solarData from "./solar.json";
import lunarData from "./lunar.json";

function convertDateToJulian(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const start = new Date(year, 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return `${year}-${String(dayOfYear).padStart(3, "0")}`;
}

export function getBirthChakra(dateOfBirth: string) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    const searchDate = convertDateToJulian(dateOfBirth);
    debugLogs.push(`📅 Преобразованная дата для поиска: ${searchDate}`);

    const solarEntry = solarData.find((entry: { Date: string }) => entry.Date === searchDate);
    const lunarEntry = lunarData.find((entry: { Date: string }) => entry.Date === searchDate);

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
