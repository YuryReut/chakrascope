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

const QUESTIONS = [
    "Этот вопрос связан с материальной стороной жизни?",
    "Он касается ваших эмоций и желаний?",
    "Этот вопрос про силу воли и достижение целей?",
    "Он связан с отношениями и сердечными чувствами?",
    "Этот вопрос касается самовыражения и творчества?",
    "Он затрагивает интуицию и внутреннее видение?",
    "Этот вопрос про глубокое понимание и осознание?"
];

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");
    const [showQuestions, setShowQuestions] = useState(false);
    const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(0);
    const [queryResult, setQueryResult] = useState<null | {
        interpretation: string;
        growthVector: string;
        queryOrganicity: string[];
    }>(null);
    const [questionConfirmed, setQuestionConfirmed] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);

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

    const startQuestionnaire = () => {
        setShowQuestions(true);
        setQuestionConfirmed(false);
        setCurrentQuestion(0);
        setAnswers(Array(QUESTIONS.length).fill(null));
        setShowAnalysis(false);
        setQueryResult(null);
    };

    const handleAnswer = (answer: boolean) => {
        const newAnswers = [...answers];
        if (currentQuestion !== null) {
            newAnswers[currentQuestion] = answer;
            setAnswers(newAnswers);

            if (currentQuestion < QUESTIONS.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setCurrentQuestion(null);
            }
        }
    };

    const handleGetAnswer = () => {
        const analysis = analyzeQuery(answers);
        setQueryResult(analysis);
        setShowAnalysis(true);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100vw",
            textAlign: "center",
            fontFamily: "inherit",
            color: "black",
            padding: "20px",
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5"
        }}>
            <h1 style={{ fontSize: "2em", marginBottom: "5px" }}>Чакроскоп</h1>
            <p style={{ fontSize: "1em", color: "#666", marginBottom: "20px" }}>
                Это как гороскоп, только твой персональный. Он рассказывает о том, как в тебе течёт энергия.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <label style={{ fontSize: "1em" }}>Введите дату рождения:</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                    style={{ padding: "8px", fontSize: "1em", backgroundColor: "#ffffff", border: "1px solid #ccc", borderRadius: "5px" }} />
                <button onClick={handleCheckChakra}
                    style={{ padding: "8px 16px", fontSize: "1em", cursor: "pointer", border: "none", backgroundColor: "#4CAF50", color: "white", borderRadius: "5px" }}>
                    Рассчитать
                </button>
            </div>

            {birthChakra && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    maxWidth: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    color: "black",
                    fontSize: "1.1em",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                    <h3>Ты сформирован от рождения как:</h3>
                    <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", width: "100%", textAlign: "left", border: "1px solid #ddd", marginBottom: "10px" }}>
                        {birthChakra.split("📆")[0]}
                    </div>

                    <h3>Твой путь сейчас:</h3>
                    <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", width: "100%", textAlign: "left", border: "1px solid #ddd", marginBottom: "10px" }}>
                        {birthChakra.split("📆")[1]?.split("🌙")[0]}
                    </div>

                    <h3>Сегодня, день определяет тебя как:</h3>
                    <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", width: "100%", textAlign: "left", border: "1px solid #ddd" }}>
                        {birthChakra.split("🌙")[1]}
                    </div>
                </div>
            )}

            {birthChakra && !showQuestions && (
                <button onClick={startQuestionnaire}
                    style={{ marginTop: "20px", padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}>
                    Задать вопрос
                </button>
            )}

            {showQuestions && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    color: "black",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                    textAlign: "center"
                }}>
                    {currentQuestion !== null ? (
                        <>
                            <p>{QUESTIONS[currentQuestion]}</p>
                            <button onClick={() => handleAnswer(true)}>Да</button>
                            <button onClick={() => handleAnswer(false)}>Нет</button>
                        </>
                    ) : (
                        <button onClick={handleGetAnswer}>Получить ответ</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
