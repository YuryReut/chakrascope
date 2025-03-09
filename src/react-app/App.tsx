import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState<string | null>(null);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const handleCheckChakra = () => {
        const result = getBirthChakra(birthDate);

        if (typeof result.result === "string") {
            setBirthChakra(result.result);
        } else {
            setBirthChakra(JSON.stringify(result.result, null, 2));
        }
        
        setDebugLogs(result.logs || []);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Чакроскоп</h1>

            <h2>Определение чакры по натальной карте</h2>
            <label>Дата рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

            <button onClick={handleCheckChakra}>Проверить чакру</button>

            {birthChakra && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#f4f4f4", borderRadius: "5px" }}>
                    <p><strong>Чакра рождения:</strong></p>
                    <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{birthChakra}</pre>
                </div>
            )}

            {debugLogs.length > 0 && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#fff3cd", borderRadius: "5px" }}>
                    <h3>Отладочные сообщения:</h3>
                    <ul>
                        {debugLogs.map((log, index) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
