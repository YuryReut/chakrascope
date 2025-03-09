import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");

    const handleCheckChakra = () => {
        if (!birthDate) return;

        const result = getBirthChakra(birthDate);
        setBirthChakra(result);
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

            {birthChakra && (
                <div style={{ marginTop: "20px", fontSize: "inherit" }}>
                    {birthChakra}
                </div>
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
