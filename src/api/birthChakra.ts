import chakrasData from "./chakras.json";
import dayEQ7Data from "./dayEQ7_data.json";

// Определение Титхи (Лунного дня)
function getCurrentTithi(lunarLongitude) {
    return Math.floor(lunarLongitude / 12) + 1;
}

// Определение Чакры по Титхи (разбиваем 30 Титхи на 7 Чакр)
function getChakraFromTithi(tithi) {
    return Math.floor((tithi - 1) / 4.29) + 1;
}

// Чакра по 52-дневному биоритму
function getChakra52Cycle(birthDate, currentDate) {
    const birth = new Date(birthDate);
    const now = new Date(currentDate);
    const daysPassed = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
    return Math.floor((daysPassed % 52) / 7.43) + 1;
}

// Чакра года (по году рождения)
function getChakraFromYear(date) {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}

// Чакра по дню недели (Вара)
function getChakraFromWeekday(date) {
    const weekday = new Date(date).getDay();
    return (weekday % 7) + 1;
}

// Определение персональной Чакры дня
function getPersonalChakraDay(birthDate, currentDate, moonDegree) {
    const yearChakra = getChakraFromYear(birthDate);
    const cycleChakra = getChakra52Cycle(birthDate, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const chakraTitthi = getChakraFromTithi(tithi);
    const chakraWeekday = getChakraFromWeekday(currentDate);
    const chakraMoon = getChakraFromTithi(Math.floor(moonDegree / 12) + 1);

    const chakraDay = Math.round(
        (yearChakra * 0.3) +
        (cycleChakra * 0.3) +
        (chakraTitthi * 0.2) +
        (chakraWeekday * 0.1) +
        (chakraMoon * 0.1)
    );

    return chakraDay > 7 ? 7 : chakraDay;
}

export function getBirthChakra(dateOfBirth, currentDate, sunDegree, moonDegree) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    const yearChakra = getChakraFromYear(dateOfBirth);
    const cycleChakra = getChakra52Cycle(dateOfBirth, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const lunarChakra = getChakraFromTithi(tithi);
    const solarChakra = getChakraFromTithi(Math.floor(sunDegree / 12) + 1);
    const dayChakra = getPersonalChakraDay(dateOfBirth, currentDate, moonDegree);

    return {
        result: `
        🔆 Ты действуешь из ${chakrasData.chakras[solarChakra - 1].emoji} ${solarChakra}-й чакры ${chakrasData.chakras[solarChakra - 1].title} (${chakrasData.chakras[solarChakra - 1].name}).
        🌀 Внутреннее ощущение: ${chakrasData.chakras[solarChakra - 1].phases[0].inner}  
        🌍 Внешнее проявление: ${chakrasData.chakras[solarChakra - 1].phases[0].outer}  
        ❤️ В отношениях: ${chakrasData.chakras[solarChakra - 1].phases[0].relationship}  
        
        📆 Для тебя это год про ${chakrasData.chakras[yearChakra - 1].desc} из ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры ${chakrasData.chakras[yearChakra - 1].title} (${chakrasData.chakras[yearChakra - 1].name}).
        🔄 Прямо сейчас, по 52-дневному циклу, энергия Солнца дает тебе ${chakrasData.chakras[cycleChakra - 1].desc} через ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-ю Чакру ${chakrasData.chakras[cycleChakra - 1].title} (${chakrasData.chakras[cycleChakra - 1].name}).  
       
        🌙 Лунная энергия:  
        Твое восприятие реальности — это ${chakrasData.chakras[lunarChakra - 1].desc} благодаря ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-й Чакре ${chakrasData.chakras[lunarChakra - 1].title} (${chakrasData.chakras[lunarChakra - 1].name}).
        
        📅 Сегодня:
        Твои решения в фокусе ${chakrasData.chakras[dayChakra - 1].desc} из ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-й Чакры ${chakrasData.chakras[dayChakra - 1].title} (${chakrasData.chakras[dayChakra - 1].name}). 
        С эмоциональной точки зрения, реальность ощущается как ${chakrasData.chakras[lunarChakra - 1].desc}, потому что энергия в ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-ой Чакре ${chakrasData.chakras[lunarChakra - 1].title} (${chakrasData.chakras[lunarChakra - 1].name}).
        `,
        logs: debugLogs,
        solarChakra,
        lunarChakra
    };
}

export function analyzeEQ7Responses(solarChakra, lunarChakra, responses) {
    const solarState = responses.slice(0, 3).includes(true) ? (responses[0] ? "balance" : responses[1] ? "excess" : "block") : "balance";
    const lunarState = responses.slice(3, 6).includes(true) ? (responses[3] ? "balance" : responses[4] ? "excess" : "block") : "balance";
    
    return {
        solarAction: dayEQ7Data.chakras[solarChakra].sun_recommendations[solarState],
        lunarPerception: dayEQ7Data.chakras[lunarChakra].moon_recommendations[lunarState]
    };
}
