import solarData from "./solar.json";
import lunarData from "./lunar.json";

interface ChakraEntry {
    date: string;
    degrees: number;
    chakra: string;
}

// Функция для нахождения ближайшей даты в данных
function findChakraData(date: string, data: ChakraEntry[]): string {
    const entry = data.find((row) => row.date === date);
    return entry ? entry.chakra : "Дата вне диапазона данных";
}

// Основная функция для определения чакры рождения
export function getBirthChakra(dateOfBirth: string) {
    const sunChakra = findChakraData(dateOfBirth, solarData as ChakraEntry[]);
    const moonChakra = findChakraData(dateOfBirth, lunarData as ChakraEntry[]);

    return {
        sunChakra,
        moonChakra
    };
}
