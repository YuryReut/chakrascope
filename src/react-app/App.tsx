import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState<string>("");
    const [birthChakra, setBirthChakra] = useState<string | null>(null);

    // Функция для преобразования даты в формат YYYY-DDD
    const formatDateToYearDay = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const startOfYear = new Date(year, 0, 0);
        const diff = date.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return `${year}-${dayOfYear}`;
    };

    const handleCheckChakra = () => {
        if (!birthDate) return;

        const formattedDate = formatDateToYearDay(birthDate);
        const todayFormatted = formatDateToYearDay(new Date().toISOString().split("T")[0]);

        const result = getBirthChakra(formattedDate, todayFormatted);
        setBirthChakra(JSON.stringify(result, null, 2));
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            padding: "0 20px"
        }}>
            <h1>Чакроскоп</h1>

            <label style={{ marginBottom: "10px", fontSize: "inherit" }}>
                Введите дату рождения:
            </label>

            <input 
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{
                    padding: "8px",
                    marginBottom: "15px",
                    fontSize: "inherit"
                }} 
            />

            <button 
                onClick={handleCheckChakra} 
                style={{
                    padding: "8px 20px",
                    cursor: "pointer",
                    fontSize: "inherit"
                }}
            >
                Рассчитать
            </button>

            {birthChakra && (
                <pre style={{
                    textAlign: "left",
                    maxWidth: "600px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginTop: "20px",
                    fontSize: "inherit"
                }}>
                    {birthChakra}
                </pre>
            )}

            <footer style={{ marginTop: "30px", fontSize: "inherit" }}>
                © 2025 <a href="https://instagram.com/nowyoucanseelove" target="_blank" rel="noopener noreferrer">
                    IG nowyoucanseelove
                </a>
            </footer>
        </div>
    );
}

export default App;
