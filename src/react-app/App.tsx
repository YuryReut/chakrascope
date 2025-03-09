import { useState } from "react";
import { getDailyChakra } from "../api/dailyChakra";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState<{ sunDegree: string; moonDegree: string } | null>(null);

    const handleCheckChakra = async () => {
        const chakra = getBirthChakra(birthDate);
        setBirthChakra(chakra);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Чакроскоп</h1>
            <p>Сегодня день: <strong>{getDailyChakra()}</strong></p>

            <h2>Определение чакры по натальной карте</h2>
            <label>Дата рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

            <button onClick={handleCheckChakra}>Проверить чакру</button>

            {birthChakra && (
                <p>
                    <strong>Градусы Солнца:</strong> {birthChakra.sunDegree} <br />
                    <strong>Градусы Луны:</strong> {birthChakra.moonDegree}
                </p>
            )}
        </div>
    );
}

export default App;
