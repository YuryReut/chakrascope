import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState<any>(null);
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

            {birthChakra && typeof birthChakra === "object" ? (
                <div>
                    <h3>Результат</h3>
                    <p><strong>Чакра:</strong> {birthChakra.chakra} - {birthChakra.name} ({birthChakra.title})</p>
                    <p><strong>Фаза:</strong> {birthChakra.phase}</p>
                    <p><strong>Внутреннее ощущение:</strong> {birthChakra.inner}</p>
                    <p><strong>Внешнее проявление:</strong> {birthChakra.outer}</p>
                    <p><strong>Отношения:</strong> {birthChakra.relationship}</p>
                </div>
            ) : (
                <p>{birthChakra}</p>
            )}

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
