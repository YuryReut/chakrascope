import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");

    // Функция форматирования даты в YYYY-DDD
    const formatDateToYearDay = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const startOfYear = new Date(year, 0, 0);
        const diff = date.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return `${year}-${String(dayOfYear).padStart(3, "0")}`;
    };

    const handleCheckChakra = () => {
        if (!birthDate) return;

        const formattedDate = formatDateToYearDay(birthDate);
        const todayFormatted = formatDateToYearDay(new Date().toISOString().split("T")[0]);

        const result = getBirthChakra(formattedDate, todayFormatted);
        console.log(result);
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

            <label style={{ fontSize: "inherit", marginBottom: "10px" }}>
                Введите дату рождения:
            </label>

            <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{
                    padding: "8px",
                    fontSize: "inherit",
                    marginBottom: "15px",
                    textAlign: "center"
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

            <footer style={{ marginTop: "30px", fontSize: "inherit" }}>
                © 2025 <a href="https://instagram.com/nowyoucanseelove" target="_blank" rel="noopener noreferrer">
                    IG nowyoucanseelove
                </a>
            </footer>
        </div>
    );
}

export default App;
