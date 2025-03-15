import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";
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
    const [showEQTest, setShowEQTest] = useState(false);
    const [answers, setAnswers] = useState<{ [key: string]: keyof typeof dayEQ7Data.chakras.states }>({});
    const [eqResult, setEQResult] = useState<{ action: string; perception: string } | null>(null);

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

    const startEQTest = () => {
        setShowEQTest(true);
        setAnswers({});
        setEQResult(null);
    };

    const handleAnswer = (chakra: keyof typeof dayEQ7Data.chakras, state: keyof typeof dayEQ7Data.chakras["Муладхара"].states) => {
        setAnswers(prev => ({ ...prev, [chakra]: state }));
    };

    const processEQResult = () => {
        const sunChakra = answers["Солнечная"];
        const moonChakra = answers["Лунная"];
        const action = dayEQ7Data.chakras[sunChakra]?.sun_recommendations[sunChakra] || "Нет данных";
        const perception = dayEQ7Data.chakras[moonChakra]?.moon_recommendations[moonChakra] || "Нет данных";
        setEQResult({ action, perception });
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Чакроскоп</h1>
            <label>Введите дату рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <button onClick={handleCheckChakra}>Рассчитать</button>

            {birthChakra && (
                <div>
                    <p>{birthChakra}</p>
                    <button onClick={startEQTest}>Твой день</button>
                </div>
            )}

            {showEQTest && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
                    <h2>Как ты ощущаешь сегодняшний день?</h2>
                    <button onClick={() => processEQResult()}>Начать опрос</button>

                    {Object.keys(dayEQ7Data.chakras).map((chakra) => (
                        <div key={chakra}>
                            <h3>{chakra}</h3>
                            {Object.keys(dayEQ7Data.chakras[chakra as keyof typeof dayEQ7Data.chakras].states).map((state) => (
                                <button key={state} onClick={() => handleAnswer(chakra as keyof typeof dayEQ7Data.chakras, state as keyof typeof dayEQ7Data.chakras["Муладхара"].states)}>
                                    {dayEQ7Data.chakras[chakra as keyof typeof dayEQ7Data.chakras].states[state as keyof typeof dayEQ7Data.chakras["Муладхара"].states]}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {eqResult && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
                    <h2>Твой день</h2>
                    <p><strong>Твои действия:</strong> {eqResult.action}</p>
                    <p><strong>Твоё понимание:</strong> {eqResult.perception}</p>
                    <button onClick={() => setShowEQTest(false)}>Закрыть</button>
                </div>
            )}
        </div>
    );
}

export default App;
