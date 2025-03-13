import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";
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
    const [queryResult, setQueryResult] = useState<{ interpretation: string, growthVector: string, queryOrganicity: string } | null>(null);
    const [questionConfirmed, setQuestionConfirmed] = useState(false);

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
        setQuestionConfirmed(true);
        setCurrentQuestion(0);
    };

    const handleAnswer = (answer: boolean) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion!] = answer;
        setAnswers(newAnswers);

        if (currentQuestion! < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion! + 1);
        } else {
            setCurrentQuestion(null);
            setQueryResult({
                interpretation: "Вы понимаете сам вопрос как...",
                growthVector: "Этот вопрос про...",
                queryOrganicity: "Для вас этот вопрос..."
            });
        }
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
            padding: "20px",
            boxSizing: "border-box",
            backgroundColor: "#ffffff"
        }}>
            <h1 style={{ fontSize: "2em", marginBottom: "10px" }}>Чакроскоп</h1>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <label style={{ fontSize: "1em" }}>Введите дату рождения:</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ padding: "8px", fontSize: "1em", backgroundColor: "#cccccc" }} />
                <button onClick={handleCheckChakra} style={{ padding: "8px 16px", fontSize: "1em", cursor: "pointer" }}>Рассчитать</button>
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
                    padding: "15px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "1.1em",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                    {birthChakra}
                </div>
            )}

            {showQuestions && (
                <div>
                    {currentQuestion !== null ? (
                        <>
                            <p>{QUESTIONS[currentQuestion]}</p>
                            <button onClick={() => handleAnswer(true)}>Да</button>
                            <button onClick={() => handleAnswer(false)}>Нет</button>
                        </>
                    ) : (
                        queryResult && (
                            <>
                                <p>📜 {queryResult.interpretation}</p>
                                <p>🔄 {queryResult.growthVector}</p>
                                <p>🌱 {queryResult.queryOrganicity}</p>
                            </>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
