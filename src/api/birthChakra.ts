import chakrasData from "./chakras.json";
import solarData from "./solar.json";
import lunarData from "./lunar.json";

export function getBirthChakra(dateOfBirth: string) {
    let debugLogs: string[] = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    // Преобразуем дату в формат YYYY-DOY (где DOY — день в году)
    const birthDate = new Date(dateOfBirth);
    const year = birthDate.getFullYear();
    const startOfYear = new Date(year, 0, 0);
    const dayOfYear = Math.floor((birthDate.getTime() - startOfYear.getTime()) / 86400000);
    const formattedDate = `${year}-${String(dayOfYear).padStart(3, "0")}`;

    debugLogs.push(`📅 Преобразованная дата для поиска: ${formattedDate}`);

    const solarEntry = solarData.find(entry => entry.Date === formattedDate);
    const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

    debugLogs.push(`🌞 Найденная запись для Солнца: ${solarEntry ? JSON.stringify(solarEntry) : "❌ Дата не найдена"}`);
    debugLogs.push(`🌙 Найденная запись для Луны: ${lunarEntry ? JSON.stringify(lunarEntry) : "❌ Дата не найдена"}`);

    if (!solarEntry || !lunarEntry) {
        debugLogs.push("🚨 Ошибка: Дата вне диапазона данных!");
        return {
            result: "Дата вне диапазона данных",
            logs: debugLogs
        };
    }

    const sunDegree = solarEntry.Solar_Longitude;
    const moonDegree = lunarEntry.Lunar_Longitude;

    // Определяем чакру по Солнцу и фазу по Луне (7 чакр равномерно по 360 градусам)
    const chakraId = Math.floor((sunDegree / 360) * 7) + 1;
    const phaseId = Math.floor((moonDegree / 360) * 4) + 1;

    const chakra = chakrasData.chakras.find(c => c.id === chakraId);
    const phase = chakra?.phases.find(p => p.id === phaseId);

    if (!chakra || !phase) {
        debugLogs.push("🚨 Ошибка: Не удалось определить чакру или фазу!");
        return {
            result: "Ошибка расчёта",
            logs: debugLogs
        };
    }

    debugLogs.push(`✅ Итог: Чакра ${chakraId} (${chakra.name} - ${chakra.title}), Фаза ${phaseId}`);
    debugLogs.push(`🌀 Внутреннее ощущение: ${phase.inner}`);
    debugLogs.push(`🌍 Внешнее проявление: ${phase.outer}`);
    debugLogs.push(`❤️ Отношения: ${phase.relationship}`);

    return {
        result: {
            chakra: chakraId,
            name: chakra.name,
            title: chakra.title,
            phase: phaseId,
            inner: phase.inner,
            outer: phase.outer,
            relationship: phase.relationship
        },
        logs: debugLogs
    };
}
