import { useState } from "react";
import { getBirthChakra, analyzeQuery } from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";
import dayEQ7Data from "../api/dayEQ7_data.json";

function convertToJulianDate(dateString: string): string {
    const date = new Date(dateString);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return `${date.getFullYear()}-${dayOfYear.toString().padStart(3, "0")}`;
}

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");
    const [showDayEQ7, setShowDayEQ7] = useState(false);
    const [solarChakraState, setSolarChakraState] = useState("");
    const [lunarChakraState, setLunarChakraState] = useState("");
    const [dayEQ7Result, setDayEQ7Result] = useState<null | { actions: string; understanding: string }>(null);

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const formattedDate = convertToJulianDate(birthDate);

        const solarEntry = solarData.find(entry => entry.Date === formattedDate);
        const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

        if (!solarEntry || !lunarEntry) {
            setBirthChakra("❌ Ошибка: Дата вне диапазона данных!");
            return;
        }

        const sunDegree = solarEntry.Solar_Longitude;
        const moonDegree = lunarEntry.Lunar_Longitude;

        const result = getBirthChakra(birthDate, today, sunDegree, moonDegree);
        setBirthChakra(result.result);
    };

    const startDayEQ7 = () => {
        setShowDayEQ7(true);
        setSolarChakraState("");
        setLunarChakraState("");
        setDayEQ7Result(null);
    };

    const handleDayEQ7Answer = () => {
        if (!solarChakraState || !lunarChakraState) return;

        const solarChakraData = dayEQ7Data.chakras[solarChakraState];
        const lunarChakraData = dayEQ7Data.chakras[lunarChakraState];

        setDayEQ7Result({
            actions: solarChakraData.sun_recommendations[solarChakraState],
            understanding: lunarChakraData.moon_recommendations[lunarChakraState]
        });
    };

    return (
        <div style={{ textAlign: "center", fontFamily: "inherit", color: "black", padding: "20px" }}>
            <h1>Чакроскоп</h1>

            <div>
                <label>Введите дату рождения:</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                <button onClick={handleCheckChakra}>Рассчитать</button>
            </div>

            {birthChakra && (
                <div>
                    {birthChakra}
                    <button onClick={startDayEQ7}>Твой день</button>
                </div>
            )}

            {showDayEQ7 && (
                <div>
                    {!dayEQ7Result ? (
                        <>
                            <p>Как ты ощущаешь сегодняшний день?</p>
                            <button onClick={handleDayEQ7Answer}>Начать опрос</button>

                            <p>Выбери состояние солнечной чакры:</p>
                            <select onChange={(e) => setSolarChakraState(e.target.value)}>
                                <option value="">Выбрать...</option>
                                <option value="balance">Баланс</option>
                                <option value="excess">Избыток</option>
                                <option value="block">Блок</option>
                            </select>

                            <p>Выбери состояние лунной чакры:</p>
                            <select onChange={(e) => setLunarChakraState(e.target.value)}>
                                <option value="">Выбрать...</option>
                                <option value="balance">Баланс</option>
                                <option value="excess">Избыток</option>
                                <option value="block">Блок</option>
                            </select>

                            <button onClick={handleDayEQ7Answer}>Ответить</button>
                        </>
                    ) : (
                        <>
                            <p>📜 <b>Твои действия:</b> {dayEQ7Result.actions}</p>
                            <p>🔄 <b>Твое понимание:</b> {dayEQ7Result.understanding}</p>
                            <button onClick={() => setShowDayEQ7(false)}>Закрыть</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
