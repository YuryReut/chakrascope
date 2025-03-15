import chakrasData from "./chakras.json";
import dayEQ7Data from "./dayEQ7_data.json";

// Определение типов
type ChakraState = "balance" | "excess" | "block";

export type EQ7Response = {
    solarAction: string;
    lunarPerception: string;
};

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

// Чакра по дню недели
function getChakraFromWeekday(date: string): number {
    const weekday = new Date(date).getDay();
    return (weekday % 7) + 1;
}

// Определение персональной Чакры дня
function getPersonalChakraDay(birthDate: string, currentDate: string, moonDegree: number): number {
    const cycleChakra = getChakra52Cycle(birthDate, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const chakraTitthi = getChakraFromTithi(tithi);
    const chakraWeekday = getChakraFromWeekday(currentDate);
    const chakraMoon = getChakraFromTithi(Math.floor(moonDegree / 12) + 1);

    const chakraDay = Math.round(
        (cycleChakra * 0.3) +
        (chakraTitthi * 0.2) +
        (chakraWeekday * 0.1) +
        (chakraMoon * 0.1)
    );

    return chakraDay > 7 ? 7 : chakraDay;
}

export function getBirthChakra(dateOfBirth: string, currentDate: string, sunDegree: number, moonDegree: number) {
    const cycleChakra = getChakra52Cycle(dateOfBirth, currentDate);
    const tithi = getCurrentTithi(moonDegree);
    const lunarChakra = getChakraFromTithi(tithi);
    const solarChakra = getChakraFromTithi(Math.floor(sunDegree / 12) + 1);
    const dayChakra = getPersonalChakraDay(dateOfBirth, currentDate, moonDegree);

    return {
        result: `
        🔆 Ты действуешь из ${chakrasData.chakras[solarChakra - 1].emoji} ${solarChakra}-й чакры ${chakrasData.chakras[solarChakra - 1].title}.
        🌙 Лунная энергия — ${chakrasData.chakras[lunarChakra - 1].emoji} ${lunarChakra}-я чакра.
        📅 Сегодняшняя чакра дня — ${chakrasData.chakras[dayChakra - 1].emoji} ${dayChakra}-я чакра.
        `,
        solarChakra,
        lunarChakra
    };
}

// ** Исправленный анализ ответов EQ7 **
export function analyzeEQ7Responses(solarChakra: number, lunarChakra: number, responses: boolean[]): EQ7Response {
    const solarKey = Object.keys(dayEQ7Data.chakras)[solarChakra - 1];
    const lunarKey = Object.keys(dayEQ7Data.chakras)[lunarChakra - 1];

    const solarState: ChakraState = responses.slice(0, 3).includes(true)
        ? (responses[0] ? "balance" : responses[1] ? "excess" : "block")
        : "balance";

    const lunarState: ChakraState = responses.slice(3, 6).includes(true)
        ? (responses[3] ? "balance" : responses[4] ? "excess" : "block")
        : "balance";

    return {
        solarAction: dayEQ7Data.chakras[solarKey]?.sun_recommendations[solarState] || "Нет данных",
        lunarPerception: dayEQ7Data.chakras[lunarKey]?.moon_recommendations[lunarState] || "Нет данных"
    };
}
