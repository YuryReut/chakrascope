import chakrasData from "./chakras.json";
import solarData from "./solar.json";
import lunarData from "./lunar.json";
import { getCurrent52DayChakra, getCurrentTithiChakra, getEvolutionaryChakra } from "./chakraCycles";

export function getBirthChakra(dateOfBirth: string, currentDate: string) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);
    debugLogs.push(`📅 Текущая дата: ${currentDate}`);

    // Преобразуем дату рождения в нужный формат
    const formattedDate = formatToJulianDate(dateOfBirth);
    debugLogs.push(`📅 Преобразованная дата для поиска: ${formattedDate}`);

    const solarEntry = solarData.find(entry => entry.Date === formattedDate);
    const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

    if (!solarEntry || !lunarEntry) {
        debugLogs.push("🚨 Ошибка: Дата вне диапазона данных!");
        return { result: "Дата вне диапазона данных", logs: debugLogs };
    }

    debugLogs.push(`🌞 Найденная запись для Солнца: ${JSON.stringify(solarEntry)}`);
    debugLogs.push(`🌙 Найденная запись для Луны: ${JSON.stringify(lunarEntry)}`);

    // Определяем чакры рождения
    const sunChakra = getChakraFromDegrees(solarEntry.Solar_Longitude);
    const moonChakra = getChakraFromDegrees(lunarEntry.Lunar_Longitude);
    
    debugLogs.push(`✅ Чакра Солнца: ${sunChakra.id} (${sunChakra.name})`);
    debugLogs.push(`✅ Чакра Луны: ${moonChakra.id} (${moonChakra.name})`);

    // Определяем эволюционную чакру (куда человек должен прийти)
    const evolutionaryChakra = getEvolutionaryChakra(dateOfBirth, currentDate);
    debugLogs.push(`📍 Эволюционная чакра: ${evolutionaryChakra.id} (${evolutionaryChakra.name})`);

    // Определяем текущие энергии
    const chakra52 = getCurrent52DayChakra(currentDate);
    const chakraTithi = getCurrentTithiChakra(currentDate);
    
    debugLogs.push(`🔆 52-дневная чакра: ${chakra52.id} (${chakra52.name})`);
    debugLogs.push(`🌊 Титхи чакра: ${chakraTithi.id} (${chakraTithi.name})`);

    // Собираем финальный результат
    const result = `
### 🔮 **Твой эволюционный путь**  
📍 **Сейчас ориентировочно ты должен быть в** ${evolutionaryChakra.emoji} **${evolutionaryChakra.id}-ой Чакре (${evolutionaryChakra.name}) – ${evolutionaryChakra.title}**  

---

### ⚡ **Прямо сейчас твои энергии**  
🔆 **Энергия изменений в чакре** – ${chakra52.emoji} **${chakra52.id}-ой Чакре (${chakra52.name}) – ${chakra52.title}**  
🌊 **Энергия существования в чакре** – ${chakraTithi.emoji} **${chakraTithi.id}-ой Чакре (${chakraTithi.name}) – ${chakraTithi.title}**  

---

### 🏛️ **От рождения у тебя**  
🔆 **Энергия, которая движет тебя вперед в** ${sunChakra.emoji} **${sunChakra.id}-ой Чакре (${sunChakra.name}) – ${sunChakra.title}**  
  - 🌀 **Внутреннее ощущение:** ${sunChakra.phases[0].inner}  
  - 🌍 **Внешнее проявление:** ${sunChakra.phases[0].outer}  
  - ❤️ **Отношения:** ${sunChakra.phases[0].relationship}  

🌙 **Ты живешь из** ${moonChakra.emoji} **${moonChakra.id}-ой Чакры (${moonChakra.name}) – ${moonChakra.title}**  
  - 🌀 **Внутреннее ощущение:** ${moonChakra.phases[0].inner}  
  - 🌍 **Внешнее проявление:** ${moonChakra.phases[0].outer}  
  - ❤️ **Отношения:** ${moonChakra.phases[0].relationship}  
`;

    return { result, logs: debugLogs };
}

// Функция для конвертации даты в формат для поиска
function formatToJulianDate(date: string): string {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return `${d.getFullYear()}-${String(dayOfYear).padStart(3, "0")}`;
}

// Функция для определения чакры по градусам
function getChakraFromDegrees(degrees: number) {
    const chakras = chakrasData.chakras;
    const index = Math.floor(degrees / (360 / 7)); // Разбиваем круг на 7 чакр
    return chakras[index % 7]; // Чакры идут по кругу
}
