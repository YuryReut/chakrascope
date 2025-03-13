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
    const [answers, setAnswers] = useState(Array(7).fill(null));
    const [analysisResult, setAnalysisResult] = useState(null);

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

    const handleAnswerChange = (index: number, answer: boolean) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const handleAnalyzeQuery = () => {
        const queryQuarters = answers.map((ans, idx) => (ans ? idx + 1 : null)).filter(q => q !== null);
        const result = analyzeQuery(queryQuarters);
        setAnalysisResult(result);
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
                style={{
                    padding: "10px 20px",
                    fontSize: "1em",
                    cursor: "pointer"
                }}
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

            {birthChakra && !showQuestions && (
                <button onClick={() => setShowQuestions(true)} style={{ marginTop: "20px" }}>
                    Задать вопрос
                </button>
            )}

            {showQuestions && (
                <div style={{
                    position: "fixed", 
                    top: 0, left: 0, width: "100vw", height: "100vh", 
                    backgroundColor: "rgba(0,0,0,0.7)",
                    display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{ background: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                        <h2>Ответьте на 7 вопросов</h2>
                        {answers.map((_, idx) => (
                            <div key={idx}>
                                <p>Вопрос {idx + 1}</p>
                                <button onClick={() => handleAnswerChange(idx, true)}>Да</button>
                                <button onClick={() => handleAnswerChange(idx, false)}>Нет</button>
                            </div>
                        ))}
                        <button onClick={handleAnalyzeQuery} style={{ marginTop: "15px" }}>
                            Получить ответ
                        </button>
                    </div>
                </div>
            )}

            {analysisResult && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h3>Результат анализа</h3>
                    <p>{analysisResult.interpretation}</p>
                    <p>{analysisResult.growthVector}</p>
                </div>
            )}
        </div>
    );
}

export default App;
