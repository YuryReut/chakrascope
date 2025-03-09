import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");

    const handleCheckChakra = () => {
        if (!birthDate) return;

        // Разбираем дату в формате DD-MM-YYYY
        const [day, month, year] = birthDate.split("-").map(Number);
        const formattedDate = new Date(year, month - 1, day);

        // Преобразуем в формат YYYY-DDD (год + порядковый день в году)
        const startOfYear = new Date(year, 0, 0);
        const diff = formattedDate.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        const formattedBirthDate = `${year}-${dayOfYear}`;

        const today = new Date().toISOString().split("T")[0];
        const sunDegree = Math.random() * 360; // Заменить на реальные данные
        const moonDegree = Math.random() * 360; // Заменить на реальные данные
        const result = getBirthChakra(formattedBirthDate, today, sunDegree, moonDegree);

        setBirthChakra(result.result);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center",
            fontFamily: "inherit"
        }}>
            <h1>Чакроскоп</h1>

            <label style={{ marginBottom: "10px" }}>
                Введите дату рождения:
            </label>

            <input 
                type="text"
                placeholder="DD-MM-YYYY"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{
                    padding: "8px",
                    marginBottom: "15px",
                    textAlign: "center"
                }} 
            />

            <button 
                onClick={handleCheckChakra} 
                style={{
                    padding: "10px 20px",
                    cursor: "pointer"
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
                    marginTop: "20px"
                }}>
                    {birthChakra}
                </pre>
            )}

            <footer style={{ marginTop: "30px" }}>
                <a href="https://instagram.com/nowyoucanseelove" target="_blank" rel="noopener noreferrer">
                    This is the way
                </a>
            </footer>
        </div>
    );
}

export default App;
