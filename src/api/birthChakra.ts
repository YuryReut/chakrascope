import solarData from "./solar.json";
import lunarData from "./lunar.json";

interface ChakraEntry {
    Date: string; // В исходных данных дата указана с большой буквы
    Solar_Longitude?: number;
    Lunar_Longitude?: number;
}

// Функция для нахождения ближайшей даты в данных
function findChakraData(date: string, data: ChakraEntry[], key: "Solar_Longitude" | "Lunar_Longitude"): number | null {
    const entry = data.find((row) => row.Date === date);
    return entry ? entry[key] ?? null : null;
}

// Основная функция для определения чакры рождения
export function getBirthChakra(dateOfBirth: string) {
    const sunDegree = findChakraData(dateOfBirth, solarData as ChakraEntry[], "Solar_Longitude");
    const moonDegree = findChakraData(dateOfBirth, lunarData as ChakraEntry[], "Lunar_Longitude");

    return {
        sunDegree: sunDegree !== null ? `${sunDegree}°` : "Дата вне диапазона данных",
        moonDegree: moonDegree !== null ? `${moonDegree}°` : "Дата вне диапазона данных",
    };
}
