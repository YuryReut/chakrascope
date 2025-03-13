import chakrasData from "./chakras.json";

// Определение Титхи (Лунного дня)
function getCurrentTithi(lunarLongitude: number): number {
    return Math.floor(lunarLongitude / 12) + 1;
}

// Определение Чакры по Титхи (разбиваем 30 Титхи на 7 Чакр)
function getChakraFromTithi(tithi: number): number {
    return Math.floor((tithi - 1) / 4.29) + 1;
}

// Чакра по 52-дневному биоритму
function getChakra52Cycle(birthDate: string, currentDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date(currentDate);
    const daysPassed = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor((daysPassed % 52) / 7.43) + 1;
}

// Чакра года (по году рождения)
function getChakraFromYear(date: string): number {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}

// Чакра по дню недели (Вара)
function getChakraFromWeekday(date: string): number {
    const weekday = new Date(date).getDay(); // 0 = воскресенье, 6 = суббота
    return (weekday % 7) + 1;
}

// **🔥 Обновленный персонализированный метод расчета Чакры дня**
function getPersonalChakraDay(birthDate: string, currentDate: string, moonDegree: number): number {
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

export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
    let debugLogs = [];

    debugLogs.push(`🔹 Входная дата рождения: ${dateOfBirth}`);

    const yearChakra = getChakraFromYear(dateOfBirth);
    const cycleChakra = getChakra52Cycle(dateOfBirth, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const lunarChakra = getChakraFromTithi(tithi);
    const solarChakra = getChakraFromTithi(Math.floor(sunDegree / 12) + 1);
    const chakraSun = chakrasData.chakras[solarChakra - 1];
    const chakraMoon = chakrasData.chakras[lunarChakra - 1];
    const dayChakra = getPersonalChakraDay(dateOfBirth, currentDate, moonDegree);

    return {
        result: `
        🔆 Ты действуешь из ${chakraSun.emoji} ${solarChakra}-й чакры ${chakraSun.title} (${chakraSun.name}).
        🌀 Внутреннее ощущение: ${chakraSun.phases[0].inner}  
        🌍 Внешнее проявление: ${chakraSun.phases[0].outer}  
        ❤️ В отношениях: ${chakraSun.phases[0].relationship}  
        
        📆 Для тебя это год про ${chakrasData.chakras[yearChakra - 1].desc} из ${chakrasData.chakras[yearChakra - 1].emoji} ${yearChakra}-й Чакры ${chakrasData.chakras[yearChakra - 1].title} (${chakrasData.chakras[yearChakra - 1].name}).
        🔄 Прямо сейчас, по 52-дневному циклу, энергия Солнца дает тебе ${chakrasData.chakras[cycleChakra - 1].desc} через ${chakrasData.chakras[cycleChakra - 1].emoji} ${cycleChakra}-ю Чакру ${chakrasData.chakras[cycleChakra - 1].title} (${chakrasData.chakras[cycleChakra - 1].name}).  
       
        🌙 Лунная энергия:  
        Твое восприятие реальности — это ${chakraMoon.desc} благодаря ${chakraMoon.emoji} ${lunarChakra}-й Чакре ${chakraMoon.title} (${chakraMoon.name}).
        
        📅 Сегодня:
        Твои решения в фокусе ${chakrasData.chakras[dayChakra - 1].desc} из ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-й Чакры ${chakrasData.chakras[dayChakra - 1].title} (${chakrasData.chakras[dayChakra - 1].name}). 
        С эмоциональной точки зрения, реальность ощущается как ${chakrasData.chakras[lunarChakra - 1].desc}, потому что энергия в ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-ой Чакре ${chakrasData.chakras[lunarChakra - 1].title} (${chakrasData.chakras[lunarChakra - 1].name}).
        `,
        logs: debugLogs
    };
}

export function analyzeQuery(queryQuarters: number[]) {
    const yearQuarter = getChakraFromYear(new Date().toISOString().split("T")[0]);
    const { birthSunQuarter, birthMoonQuarter } = getUserChakras();

    let interpretation = "";
    let growthVector = "";
    let queryOrganicity: string[] = [];

    if (queryQuarters.length === 1) {
        interpretation = "Сегодняшний день поддерживает вас в этом направлении.";
    } else {
        interpretation = "Ваш запрос сочетает несколько направлений, что делает его сложнее для анализа.";
    }

    queryQuarters.forEach((quarter) => {
        if (quarter === yearQuarter) {
            growthVector = "Этот запрос полностью соответствует вашему текущему пути.";
        } else if (quarter === yearQuarter + 1) {
            growthVector = "Этот запрос ведет вас вперед по пути развития.";
        } else if (quarter === yearQuarter - 1) {
            growthVector = "Этот запрос возвращает вас к прошлым энергиям.";
        } else {
            growthVector = "Этот запрос может быть важен, но он уводит вас в сторону.";
        }
    });

    return { interpretation, growthVector, queryOrganicity };
}
