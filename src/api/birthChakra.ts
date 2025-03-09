import chakrasData from "./chakras.json";

// Функция для определения чакры по градусам
function getChakraByDegree(degree: number) {
    const index = Math.floor((degree % 360) / (360 / 7)); // 7 чакр равномерно по 360°
    return chakrasData.chakras[index]; 
}

// Функция расчета чакры года (по Солнечному циклу)
function getChakraOfYear(birthDate: string, currentDate: string) {
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date(currentDate).getFullYear();
    const yearDifference = currentYear - birthYear;
    const chakraIndex = (yearDifference % 7); // 7-летний цикл
    return chakrasData.chakras[chakraIndex]; 
}

// Функция расчета чакры дня (по Лунному циклу)
function getChakraOfDay(currentDate: string) {
    const dayOfYear = Math.floor((new Date(currentDate).getTime() / (1000 * 60 * 60 * 24)) % 7);
    return chakrasData.chakras[dayOfYear]; 
}

// Главная функция расчета чакр
export function getBirthChakra(birthDate: string, currentDate: string, sunDegree: number, moonDegree: number) {
    let debugLogs = [];

    const chakraOfYear = getChakraOfYear(birthDate, currentDate);
    const chakraOfDay = getChakraOfDay(currentDate);
    const solarChakra = getChakraByDegree(sunDegree);
    const lunarChakra = getChakraByDegree(moonDegree);

    return `
    🔆 Ты ориентирован сейчас на ${chakraOfYear.emoji} ${chakraOfYear.id}-ой Чакре (${chakraOfYear.name}) – ${chakraOfYear.title}

    ☀️ Энергия изменений в ${chakraOfDay.emoji} ${chakraOfDay.id}-ой Чакре (${chakraOfDay.name}) – ${chakraOfDay.title}

    🌙 Энергия существования в ${lunarChakra.emoji} ${lunarChakra.id}-ой Ч
