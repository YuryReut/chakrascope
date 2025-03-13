import { useState } from "react";
import { getBirthChakra, analyzeQuery } from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";

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
    const [showQuestions, setShowQuestions] = useState(false);
    const [answers, setAnswers] = useState<(boolean | null)[]>(Array(7).fill(null));
    const [queryResult, setQueryResult] = useState<any>(null);

    const questions = [
        "Этот вопрос связан с материальной стабильностью и безопасностью?",
        "Этот вопрос касается эмоций, желаний или привязанностей?",
        "Этот вопрос касается достижений, контроля или силы воли?",
        "Этот вопрос касается любви, принятия и отношений?",
        "Этот вопрос касается выражения себя и создания чего-то нового?",
        "Этот вопрос связан с интуицией, видением или стратегией?",
        "Этот вопрос касается осознания, духовного пути или глобального смысла?"
    ];

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

    const handleAnswer = (index: number, answer: boolean) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = answer;
        setAnswers(updatedAnswers);
    };

    const analyzeRequest = () => {
        const queryQuarters = answers
            .map((answer, index) => answer ? Math.ceil((index + 1) / 2) : null)
            .filter((q) => q !== null) as number[];

        const result = analyzeQuery(queryQuarters);
        setQueryResult(result);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            textAlign: "center",
            fontFamily: "inherit",
            padding: "20px",
            boxSizing: "border-box"
        }}>
            <h1>Чакроскоп</h1>

            <label style={{ marginBottom: "10px", fontSize: "1em" }}>
                Введите дату рождения:
            </label>

            <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                style={{
                    padding: "8px",
                    fontSize: "1em",
                    marginBottom: "15px",
                    backgroundColor: "#cccccc"
                }} 
            />

            <button 
                onClick={handleCheckChakra} 
                style={{ padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}
            >
                Рассчитать
            </button>

            {birthChakra && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    maxWidth: "600px",
                    margin: "20px auto",
                    padding: "10px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "1.1em"
                }}>
                    {birthChakra}
                </div>
            )}

            <button onClick={() => setShowQuestions(true)} style={{ marginTop: "20px" }}>Задать вопрос</button>

            {showQuestions && (
                <div>
                    {questions.map((q, index) => (
                        <div key={index}>
                            <p>{q}</p>
                            <button onClick={() => handleAnswer(index, true)}>Да</button>
                            <button onClick={() => handleAnswer(index, false)}>Нет</button>
                        </div>
                    ))}
                    <button onClick={analyzeRequest} disabled={answers.includes(null)}>Получить ответ</button>
                </div>
            )}

            {queryResult && (
                <div className="query-results">
                    <h3>🔍 Интерпретация:</h3>
                    <p>{queryResult.interpretation}</p>

                    <h3>📈 Вектор развития:</h3>
                    <p>{queryResult.growthVector}</p>

                    <h3>🌱 Органика запроса:</h3>
                    <ul>
                        {queryResult.queryOrganicity.map((text: string, index: number) => (
                            <li key={index}>{text}</li>
                        ))}
                    </ul>
                </div>
            )}

            <footer style={{ marginTop: "30px", fontSize: "1em" }}>
                <a href="https://instagram.com/nowyoucanseelove" target="_blank" rel="noopener noreferrer">
                    Now You Can See Love
                </a>
            </footer>
        </div>
    );
}

export default App;
