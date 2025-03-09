import axios from "https://cdn.skypack.dev/axios";

const cityCoordinates: Record<string, { lat: number, lon: number }> = {
    "Москва": { lat: 55.7558, lon: 37.6173 },
    "Санкт-Петербург": { lat: 59.9343, lon: 30.3351 },
    "Минск": { lat: 53.9006, lon: 27.5590 },
    "Киев": { lat: 50.4501, lon: 30.5234 },
    "Алматы": { lat: 43.2220, lon: 76.8512 },
    "Бишкек": { lat: 42.8746, lon: 74.5698 },
    "Ташкент": { lat: 41.2995, lon: 69.2401 },
    "Новосибирск": { lat: 55.0084, lon: 82.9357 },
    "Екатеринбург": { lat: 56.8389, lon: 60.6057 },
    "Нью-Йорк": { lat: 40.7128, lon: -74.0060 },
    "Лондон": { lat: 51.5074, lon: -0.1278 },
    "Дубай": { lat: 25.276987, lon: 55.296249 }
};

const chakras: Record<string, string> = {
    "Сатурн": "Муладхара",
    "Юпитер": "Свадхистхана",
    "Марс": "Манипура",
    "Венера": "Анахата",
    "Меркурий": "Вишудха",
    "Луна": "Аджна",
    "Солнце": "Сахасрара"
};

// API для расчета натальной карты (используем астрологический сервис)
const ASTRO_API_URL = "https://api.astrologyapi.com/v1/planets";
const ASTRO_API_KEY = "YOUR_ASTRO_API_KEY";  // Нужно получить API-ключ

export async function getBirthChakra(date: string, time: string, city: string): Promise<string> {
    if (!cityCoordinates[city]) {
        return "Город не найден в списке";
    }

    const { lat, lon } = cityCoordinates[city];

    try {
        const response = await axios.post(ASTRO_API_URL, {
            date,
            time,
            lat,
            lon
        }, {
            headers: { "Authorization": `Bearer ${ASTRO_API_KEY}` }
        });

        const planets = response.data;
        let dominantPlanet = "Солнце"; // По умолчанию

        // Ищем доминирующую планету
        if (planets.length > 0) {
            dominantPlanet = planets[0].name;
        }

        return chakras[dominantPlanet] || "Не удалось определить чакру";
    } catch (error) {
        console.error("Ошибка получения данных:", error);
        return "Ошибка при расчете натальной карты";
    }
}
