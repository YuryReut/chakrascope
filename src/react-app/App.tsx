import { useState } from "react";
import { getBirthChakra, analyzeQuery } from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");
    const [showEQ7, setShowEQ7] = useState(false);

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const result = getBirthChakra(birthDate, today, 120, 240);
        setBirthChakra(result.result);
    };

    return (
        <div>
            <h1>Чакроскоп</h1>

            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <button onClick={handleCheckChakra}>Рассчитать</button>

            {birthChakra && <p>{birthChakra}</p>}

            {birthChakra && (
                <button onClick={() => setShowEQ7(true)}>Твои эмоции дня</button>
            )}

            {showEQ7 && <p>Функционал эмоций будет добавлен.</p>}
        </div>
    );
}

export default App;
