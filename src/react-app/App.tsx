import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");
    
    const handleCheckChakra = () => {
        const currentDate = new Date().toISOString().split("T")[0]; // Текущая дата в формате YYYY-MM-DD
        const result = getBirthChakra(birthDate, currentDate);
        setBirthChakra(result.result);
    };

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh", 
            textAlign: "center", 
            flexDirection: "column" 
        }}>
            <h1>Чакроскоп</h1>

            <label style={{ fontSize: "1.2em", marginBottom: "8px" }}>Введите дату рождения:</label>
            <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                style={{ fontSize: "1.2em", padding: "8px", marginBottom: "12px" }}
            />

            <button 
                onClick={handleCheckChakra} 
                style={{ fontSize: "1.2em", padding: "10px 20px", cursor: "pointer" }}
            >
                Рассчитать
            </button>

            {birthChakra && (
                <div style={{ marginTop: "20px", maxWidth: "600px", textAlign: "center", whiteSpace: "pre-line" }}>
                    {birthChakra}
                </div>
            )}

            <footer style={{ position: "absolute", bottom: "10px", fontSize: "1em", textAlign: "center" }}>
                <a href="https://www.instagram.com/nowyoucanseelove" target="_blank" rel="noopener noreferrer">
                    This is the way
                </a>
            </footer>
        </div>
    );
}

export default App;
