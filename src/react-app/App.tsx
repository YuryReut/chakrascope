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
    const [birthChakra, setBirthChakra] = useState<{
        birth: string;
        currentPath: string;
        today: string;
    } | null>(null);

    const [showQuestions, setShowQuestions] = useState(false);
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

    const startEmotionDialog = () => {
        setShowEmotionDialog(true);
        setSelectedEmotion(null);
        setEmotionAnalysis(null);
    };

    const handleEmotionSelect = (emotion: string) => {
        setSelectedEmotion(emotion);
        setEmotionAnalysis(`🔥 Действия как ${emotion}. 💡 Понимание как ${emotion}.`);
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
            backgroundColor: "#ffffff",
            position: "relative"
        }}>
            {/** Затемнение экрана при открытии диалога **/}
            {(showQuestions || showEmotionDialog) && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000
                }} />
            )}

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
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <h1>Чакроскоп</h1>
                <p>Чакроскоп — это твой уникальный энергетический портрет. Он показывает, как движется твоя внутренняя энергия и какие силы влияют на тебя прямо сейчас.</p>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                <button onClick={handleCheckChakra}>Рассчитать</button>
            </div>

            {birthChakra && (
                <div style={{ maxWidth: "700px", width: "100%" }}>
                    <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "15px",
                        textAlign: "left"
                    }}>
                        <h4>🔆 С чем ты пришел в этот мир:</h4>
                        <p>{birthChakra.birth}</p>
                    </div>

                    <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "15px",
                        textAlign: "left"
                    }}>
                        <h4>📅 Сегодня твой день про это:</h4>
                        <p>{birthChakra.today}</p>
                        <button onClick={startEmotionDialog} style={{ marginTop: "10px" }}>Твое восприятие сегодня</button>
                    </div>

                    <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        textAlign: "left"
                    }}>
                        <h4>🛤️ Твой путь сейчас:</h4>
                        <p>{birthChakra.currentPath}</p>
                        <button onClick={() => setShowQuestions(true)} style={{ marginTop: "10px" }}>Задать вопрос</button>
                    </div>
                </div>
            )}

            {/** 🔹 Диалог "Твое восприятие сегодня" **/}
            {showEmotionDialog && (
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
                    zIndex: 1001,
                    textAlign: "center"
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
