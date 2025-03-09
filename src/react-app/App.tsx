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
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Чакроскоп</h1>
            <label>Введите Дату Рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <button onClick={handleCheckChakra}>Рассчитать</button>
            {birthChakra && <pre>{birthChakra}</pre>}
        </div>
    );
}

export default App;
