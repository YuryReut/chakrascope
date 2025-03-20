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
        birth: {
            text: string;
            inner: string;
            outer: string;
            relationship: { text: string; linkText: string; url: string };
            moon: string;
        };
        currentPath: string;
        today: string;
    } | null>(null);

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const formattedDate = convertToJulianDate(birthDate);

        const solarEntry = solarData.find(entry => entry.Date === formattedDate);
        const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

        if (!solarEntry || !lunarEntry) {
            setBirthChakra({ 
                birth: {
                    text: "❌ Ошибка",
                    inner: "Дата вне диапазона данных!",
                    outer: "",
                    relationship: { text: "", linkText: "", url: "" },
                    moon: ""
                },
                currentPath: "Дата вне диапазона данных!", 
                today: "" 
            });
            return;
        }

        const sunDegree = solarEntry.Solar_Longitude;
        const moonDegree = lunarEntry.Lunar_Longitude;

        const result = getBirthChakra(birthDate, today, sunDegree, moonDegree);
        setBirthChakra(result.result);
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

            {birthChakra && (
                <div>
                    {/* Блок 1 - С чем ты пришел в мир */}
                    <div style={{
                        backgroundColor: "#ffffff",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "15px",
                        textAlign: "left"
                    }}>
                        <h4>🔆 С чем ты пришел в этот мир:</h4>
                        <p>{birthChakra.birth.text}</p>
                        <p>{birthChakra.birth.inner}</p>
                        <p>{birthChakra.birth.outer}</p>
                        <p>
                            {birthChakra.birth.relationship.text}
                            <a href={birthChakra.birth.relationship.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                                {birthChakra.birth.relationship.linkText}
                            </a>
                        </p>
                        <p>{birthChakra.birth.moon}</p>
                    </div>

                    {/* Блок 2 - Сегодня */}
                    <div style={{
                        backgroundColor: "#ffffff",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "15px",
                        textAlign: "left"
                    }}>
                        <h4>📅 Сегодня твой день про это:</h4>
                        <p>{birthChakra.today}</p>
                    </div>

                    {/* Блок 3 - Твой путь сейчас */}
                    <div style={{
                        backgroundColor: "#ffffff",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "15px",
                        textAlign: "left"
                    }}>
                        <h4>🛤️ Твой путь сейчас:</h4>
                        <p>{birthChakra.currentPath}</p>
                    </div>
                </div>
            )}
            </div>    
        </div>
    );
}

export default App;
