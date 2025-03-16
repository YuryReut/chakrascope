
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
    const [birthChakra, setBirthChakra] = useState<{
    birth: string;
    currentPath: string;
    today: string;
} | null>(null);
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
           setBirthChakra({ birth: "❌ Ошибка", currentPath: "Дата вне диапазона данных!", today: "" });
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
                setCurrentQuestion(null); // Все вопросы заданы, теперь показываем кнопку "Получить ответ"
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
        backgroundColor: "#ffffff"
    }}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "700px",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
            <h1 style={{ fontSize: "2em", marginBottom: "10px" }}>Чакроскоп</h1>
            <p style={{ fontSize: "1em", color: "#666", marginBottom: "20px" }}>
                Это как гороскоп, только твой персональный. Он рассказывает о том, 
                <a 
                    href="https://www.instagram.com/reel/DG_9shMhIVk/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "none" }}
                >
                    как
                </a> в тебе течёт энергия.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <label style={{ fontSize: "1em" }}>Введите дату рождения:</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ padding: "8px", fontSize: "1em", backgroundColor: "#ffffff" }} />
                <button onClick={handleCheckChakra} style={{ padding: "8px 16px", fontSize: "1em", cursor: "pointer" }}>Рассчитать</button>
            </div>

            {birthChakra && (
               <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%"
}}>
    {/* Блок 1 - Ты сформирован от рождения как */}
    <div style={{
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "15px", // Увеличил отступ между блоками
        width: "90%", // Центрирование белых блоков
        textAlign: "left"
    }}>
        <h4>🔹 Ты сформирован от рождения как:</h4>
        <p style={{ whiteSpace: "pre-wrap" }}>{birthChakra.birth}</p>
    </div>

    {/* Блок 2 - Твой путь сейчас */}
    <div style={{
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "15px", // Добавил отступ
        width: "90%", // Центрирование
        textAlign: "left"
    }}>
        <h4>🛤️ Твой путь сейчас:</h4>
        <p style={{ whiteSpace: "pre-wrap" }}>{birthChakra.currentPath}</p>
    </div>

    {/* Блок 3 - Сегодня */}
    <div style={{
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        width: "90%", // Центрирование
        textAlign: "left"
    }}>
        <h4>📅 Сегодня, день определяет тебя как:</h4>
        <p style={{ whiteSpace: "pre-wrap" }}>{birthChakra.today}</p>
    </div>
</div>

            )}
        </div>
    </div>
);

}

export default App;
