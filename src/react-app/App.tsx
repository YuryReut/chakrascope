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

    const handleAnswerChange = (answer: boolean) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
        
        if (currentQuestionIndex < QUESTIONS.length - 1) {
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
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Чакроскоп</h1>
            <label>Введите дату рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <button onClick={handleCheckChakra}>Рассчитать</button>

            {birthChakra && <p>{birthChakra}</p>}

            {birthChakra && !showQuestions && !analysisResult && (
                <button onClick={() => setShowQuestions(true)}>Задать вопрос</button>
            )}

            {showQuestions && (
                <div>
                    <p>{QUESTIONS[currentQuestionIndex]}</p>
                    <button onClick={() => handleAnswerChange(true)}>Да</button>
                    <button onClick={() => handleAnswerChange(false)}>Нет</button>
                </div>
            )}

            {analysisResult && (
                <div>
                    <h3>Результат анализа</h3>
                    <p>{analysisResult.interpretation}</p>
                    <p>{analysisResult.growthVector}</p>
                    <button onClick={() => {
                        setShowQuestions(false);
                        setShowQuestionPrompt(false);
                        setAnalysisResult(null);
                        setAnswers(Array(7).fill(null));
                        setCurrentQuestionIndex(0);
                    }}>Задать новый вопрос</button>
                </div>
            )}
        </div>
    );
}

export default App;
