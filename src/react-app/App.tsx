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

            {birthChakra && birthChakra.sun && birthChakra.moon ? (
                <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block" }}>
                    <h3>🌞 Чакра Солнца</h3>
                    <p><strong>{birthChakra.sun.chakra} – {birthChakra.sun.title}</strong></p>
                    <p>Фаза {birthChakra.sun.phase}: {birthChakra.sun.description.inner}</p>
                    <ul>
                        <li><strong>Внутренне:</strong> {birthChakra.sun.description.inner}</li>
                        <li><strong>Внешне:</strong> {birthChakra.sun.description.outer}</li>
                        <li><strong>В отношениях:</strong> {birthChakra.sun.description.relationship}</li>
                    </ul>

                    <h3>🌙 Чакра Луны</h3>
                    <p><strong>{birthChakra.moon.chakra} – {birthChakra.moon.title}</strong></p>
                    <p>Фаза {birthChakra.moon.phase}: {birthChakra.moon.description.inner}</p>
                    <ul>
                        <li><strong>Внутренне:</strong> {birthChakra.moon.description.inner}</li>
                        <li><strong>Внешне:</strong> {birthChakra.moon.description.outer}</li>
                        <li><strong>В отношениях:</strong> {birthChakra.moon.description.relationship}</li>
                    </ul>
                </div>
            ) : (
                <p>❌ Ошибка: Чакра не найдена! Проверьте дату рождения.</p>
            )}

            <h3>Отладочные сообщения:</h3>
            <ul style={{ textAlign: "left", display: "inline-block" }}>
                {debugLogs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
