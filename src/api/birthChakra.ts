import chakrasData from "./chakras.json";

// Определение Титхи (Лунного дня)
function getCurrentTithi(lunarLongitude: number): number {
    return Math.floor(lunarLongitude / 12) + 1;
}

// Определение Чакры по Титхи
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

// Чакра года
function getChakraFromYear(date: string): number {
    const year = new Date(date).getFullYear();
    return ((year - 1950) % 7) + 1;
}

// Чакра по дню недели
function getChakraFromWeekday(date: string): number {
    const weekday = new Date(date).getDay();
    return (weekday % 7) + 1;
}

// Чакра дня (новая логика)
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

// **Основная функция расчета Чакры**
export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
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

        📆 Для тебя это год про ${chakrasData.chakras[yearChakra - 1].desc}.
        🔄 Сейчас, по 52-дневному циклу, энергия Солнца даёт тебе ${chakrasData.chakras[cycleChakra - 1].desc}.  
       
        🌙 Лунная энергия:  
        Твое восприятие реальности — это ${chakraMoon.desc}.
        
        📅 Сегодня:
        Твои решения в фокусе ${chakrasData.chakras[dayChakra - 1].desc}.
        `,
    };
}

// **Добавляем анализ вопросов (вернули в код)**
export function analyzeQuery(answers: boolean[]) {
    const selectedChakras = answers
        .map((answer, index) => (answer ? index + 1 : null))
        .filter((index) => index !== null) as number[];

    let interpretation = "Вы не выбрали ни одного направления.";
    let growthVector = "Этот запрос может быть важен, но он уводит вас в сторону.";
    
    if (selectedChakras.length === 1) {
        interpretation = "Сегодняшний день поддерживает вас в этом направлении.";
    } else if (selectedChakras.length > 1) {
        interpretation = "Ваш запрос сочетает несколько направлений, что делает его сложнее для анализа.";
    }

    return { interpretation, growthVector };
}
