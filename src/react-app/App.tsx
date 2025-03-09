import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const sunDegree = Math.random() * 360; // Заменить на реальные данные
        const moonDegree = Math.random() * 360; // Заменить на реальные данные
        const result = getBirthChakra(birthDate, today, sunDegree, moonDegree);
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
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{ fontSize: "28px" }}>Чакроскоп</h1>

            <label style={{ fontSize: "22px", marginBottom: "10px" }}>
                Введите дату рождения:
            </label>

            <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                style={{
                    fontSize: "22px",
                    padding: "10px",
                    marginBottom: "15px"
                }} 
            />

            <button 
                onClick={handleCheckChakra} 
                style={{
                    fontSize: "22px",
                    padding: "12px 25px",
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
                    marginTop: "20px",
                    fontSize: "22px"
                }}>
                    {birthChakra}
                </pre>
            )}

            <footer style={{ marginTop: "30px", fontSize: "18px" }}>
                (с) 2025 <a href="https://instagram.com/nowyoucanseelove" target="_blank" rel="noopener noreferrer">
                    IG nowyoucanseelove
                </a>
            </footer>
        </div>
    );
}

export default App;
