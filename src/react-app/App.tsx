import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState<string | null>(null);

    const handleCheckChakra = () => {
        const currentDate = new Date().toISOString().split("T")[0]; // Текущая дата в формате YYYY-MM-DD
        const result = getBirthChakra(birthDate, currentDate);
        setBirthChakra(result.result);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Чакроскоп</h1>

            <h2>Определение чакры по натальной карте</h2>
            <label>Дата рождения:</label>
            <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                style={{ margin: "10px", padding: "5px" }} 
            />

            <button onClick={handleCheckChakra} style={{ padding: "10px 20px", fontSize: "16px" }}>
                🔍 Проверить чакру
            </button>

            {birthChakra && (
                <div style={{
                    textAlign: "left",
                    marginTop: "20px",
                    padding: "15px",
                    background: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                }}>
                    <h3>📜 Твой Чакроскоп</h3>
                    <pre style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        fontSize: "16px",
                        lineHeight: "1.5"
                    }}>
                        {birthChakra}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;
