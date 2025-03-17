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

    const [showEmotionDialog, setShowEmotionDialog] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [emotionAnalysis, setEmotionAnalysis] = useState<string | null>(null);

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

    const handleEmotionSelect = (emotion: string) => {
        setSelectedEmotion(emotion);
        setEmotionAnalysis(`🔥 Действия как ${emotion}. 💡 Понимание как ${emotion}.`);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100vw",
            backgroundColor: "#f5f5f5",
            padding: "20px",
            boxSizing: "border-box",
            textAlign: "center"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                maxWidth: "700px",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <h1>Чакроскоп</h1>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: "20px" }}>
                    Чакроскоп — это твой уникальный энергетический портрет. Он показывает,  
                    <a href="https://www.instagram.com/reel/DG_9shMhIVk/" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                        как
                    </a> движется твоя внутренняя энергия и какие силы влияют на тебя прямо сейчас.
                </p>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ padding: "8px", fontSize: "1em" }} />
                <button onClick={handleCheckChakra} style={{ marginTop: "10px" }}>Рассчитать</button>
            </div>

            {birthChakra && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "left",
                    maxWidth: "700px",
                    marginTop: "20px"
                }}>
                    <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", marginBottom: "15px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                        <h4>🔆 С чем ты пришел в этот мир:</h4>
                        <p>{birthChakra.birth}</p>
                    </div>

                    <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", marginBottom: "15px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                        <h4>📅 Сегодня твой день про это:</h4>
                        <p>{birthChakra.today}</p>
                        <button onClick={() => setShowEmotionDialog(true)} style={{ marginTop: "10px" }}>Твое восприятие сегодня</button>
                    </div>

                    <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                        <h4>🛤️ Твой путь сейчас:</h4>
                        <p>{birthChakra.currentPath}</p>
                        <button onClick={startQuestionnaire} style={{ marginTop: "10px" }}>Задать вопрос</button>
                    </div>
                </div>
            )}

            {showEmotionDialog && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)"
                }}>
                    <p>Уточни, как ты ощущаешь себя:</p>
                    <button onClick={() => handleEmotionSelect("спокойствие")}>Спокойствие</button>
                    <button onClick={() => handleEmotionSelect("радость")}>Радость</button>
                    <button onClick={() => handleEmotionSelect("вдохновение")}>Вдохновение</button>
                    {selectedEmotion && <p>{emotionAnalysis}</p>}
                    <button onClick={() => setShowEmotionDialog(false)}>Закрыть</button>
                </div>
            )}
        </div>
    );
}

export default App;
