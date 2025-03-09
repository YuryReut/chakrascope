import fs from 'fs';
import path from 'path';

// Путь к CSV-файлам
const solarPath = path.join(__dirname, 'solar.csv');
const lunarPath = path.join(__dirname, 'lunar.csv');

// Функция чтения CSV в объект
function readCSV(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const result = {};
    lines.forEach(line => {
        const [date, degrees] = line.split(',');
        result[date] = parseFloat(degrees);
    });
    return result;
}

// Загружаем данные
const solarData = readCSV(solarPath);
const lunarData = readCSV(lunarPath);

// Функция для определения чакры
function getChakra(degrees) {
    const chakras = ['Муладхара', 'Свадхистхана', 'Манипура', 'Анахата', 'Вишудха', 'Аджна', 'Сахасрара'];
    const index = Math.floor(degrees / 51.43) % 7;
    return chakras[index];
}

// Основная функция расчета чакры рождения
export function getBirthChakra(dateOfBirth) {
    if (!solarData[dateOfBirth] || !lunarData[dateOfBirth]) {
        return 'Дата вне диапазона данных';
    }
    
    const sunDegrees = solarData[dateOfBirth];
    const moonDegrees = lunarData[dateOfBirth];
    
    const sunChakra = getChakra(sunDegrees);
    const moonChakra = getChakra(moonDegrees);
    
    return {
        sunChakra,
        moonChakra
    };
}
