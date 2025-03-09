import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const handleCheckChakra = () => {
        const result = getBirthChakra(birthDate);
        setBirthChakra(result.result);
        setDebugLogs(result.logs);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Чакроскоп</h1>

            <h2>Определение чакры по натальной карте</h2>
            <label>Дата рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

            <button onClick={handleCheckChakra}>Проверить чакру</button>

            {birthChakra && <p>Чакра рождения: <strong>{JSON.stringify(birthChakra)}</strong></p>}

            <h3>Отладочные сообщения:</h3>
            <ul>
                {debugLogs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
