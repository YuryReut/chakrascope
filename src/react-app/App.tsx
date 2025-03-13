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
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
    const [queryResult, setQueryResult] = useState("");
    const [questionConfirmed, setQuestionConfirmed] = useState(false);
    const [showFinalResult, setShowFinalResult] = useState(false);

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
        setCurrentQuestion(null);
        setAnswers(Array(QUESTIONS.length).fill(null));
        setQueryResult("");
        setShowFinalResult(false);
    };

    const confirmQuestion = () => {
        setQuestionConfirmed(true);
        setCurrentQuestion(0); // Начинаем опрос с первого вопроса
    };

    const handleAnswer = (answer: boolean) => {
        const newAnswers = [...answers];
        if (currentQuestion !== null) {
            newAnswers[currentQuestion] = answer;
            setAnswers(newAnswers);
        }

        if (currentQuestion !== null && currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Все 7 вопросов заданы, показываем кнопку "Получить ответ"
            setCurrentQuestion(null);
            setShowFinalResult(true);
        }
    };

    const handleGetAnswer = () => {
        const result = analyzeQuery(answers);
        setQueryResult(result);
        setShowFinalResult(false);
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

            {birthChakra && !showQuestions && !queryResult && (
                <button onClick={startQuestionnaire} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}>Задать вопрос</button>
            )}

            {showQuestions && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                    textAlign: "center"
                }}>
                    {!questionConfirmed ? (
                        <>
                            <p>Сформулируйте свой вопрос.</p>
                            <button onClick={confirmQuestion} style={{ padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}>Готово</button>
                        </>
                    ) : currentQuestion !== null ? (
                        <>
                            <p>Опишите свой вопрос:</p>
                            <p>{QUESTIONS[currentQuestion]}</p>
                            <button onClick={() => handleAnswer(true)} style={{ margin: "10px", padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}>Да</button>
                            <button onClick={() => handleAnswer(false)} style={{ margin: "10px", padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}>Нет</button>
                        </>
                    ) : showFinalResult ? (
                        <>
                            <p>Ваш вопрос описан.</p>
                            <button onClick={handleGetAnswer} style={{ padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}>Получить ответ</button>
                        </>
                    ) : (
                        <>
                            <p>{queryResult}</p>
                            <button onClick={() => setShowQuestions(false)} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}>Закрыть</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
