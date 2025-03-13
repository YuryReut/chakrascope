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
    "Этот вопрос связан с материальной стабильностью и безопасностью?",
    "Этот вопрос касается эмоций и желаний?",
    "Этот вопрос затрагивает цели, силу воли и достижения?",
    "Этот вопрос связан с чувствами, любовью и принятием?",
    "Этот вопрос касается выражения себя и творчества?",
    "Этот вопрос связан с интуицией и видением будущего?",
    "Этот вопрос касается осознания и глубинного понимания?"
];

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");
    const [showQuestionPrompt, setShowQuestionPrompt] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(boolean | null)[]>(Array(7).fill(null));
    const [analysisResult, setAnalysisResult] = useState<{ interpretation: string; growthVector: string; queryOrganicity: string[] } | null>(null);

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

    const startQuestionProcess = () => {
        setShowQuestionPrompt(true);
    };

    const handleStartQuestions = () => {
        setShowQuestionPrompt(false);
        setShowQuestions(true);
        setCurrentQuestionIndex(0);
        setAnswers(Array(7).fill(null));
        setAnalysisResult(null);
    };

    const handleAnswerChange = (answer: boolean) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
        
        if (currentQuestionIndex < 6) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleAnalyzeQuery();
        }
    };

    const handleAnalyzeQuery = () => {
        if (answers.includes(null)) return;
        const queryQuarters = answers.map((ans, idx) => (ans ? idx + 1 : null)).filter(q => q !== null) as number[];
        const result = analyzeQuery(queryQuarters);
        setAnalysisResult(result);
        setShowQuestions(false);
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

            {birthChakra && !showQuestionPrompt && !showQuestions && !analysisResult && (
                <button onClick={startQuestionProcess} style={{ marginTop: "20px" }}>
                    Задать вопрос
                </button>
            )}

            {showQuestionPrompt && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <p>Сформулируйте свой вопрос для себя</p>
                    <button onClick={handleStartQuestions}>Получить ответ</button>
                </div>
            )}

            {analysisResult && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h3>Результат анализа</h3>
                    <p>{analysisResult.interpretation}</p>
                    <p>{analysisResult.growthVector}</p>
                    <button onClick={startQuestionProcess} style={{ marginTop: "15px" }}>Задать новый вопрос</button>
                </div>
            )}
        </div>
    );
}

export default App;
