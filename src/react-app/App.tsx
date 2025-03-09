import { useState } from "react";
import { getDailyChakra } from "../api/dailyChakra";
import { getBirthChakra } from "../api/birthChakra";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [birthCity, setBirthCity] = useState("Москва");
    const [birthChakra, setBirthChakra] = useState("");

    const handleCheckChakra = async () => {
        if (!birthDate) {
            alert("Введите дату рождения");
            return;
        }

        const [year, month, day] = birthDate.split("-").map(Number);

        if (!year || !month || !day) {
            alert("Неверный формат даты");
            return;
        }

        const chakra = getBirthChakra(day, month, year);
        setBirthChakra(chakra);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Чакроскоп</h1>
            <p>Сегодня день: <strong>{getDailyChakra()}</strong></p>

            <h2>Определение чакры по натальной карте</h2>
            <label>Дата рождения:</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

            <label>Время рождения:</label>
            <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />

            <label>Город рождения:</label>
            <select value={birthCity} onChange={(e) => setBirthCity(e.target.value)}>
                <option>Москва</option>
                <option>Санкт-Петербург</option>
                <option>Минск</option>
                <option>Киев</option>
                <option>Алматы</option>
                <option>Бишкек</option>
                <option>Ташкент</option>
                <option>Новосибирск</option>
                <option>Екатеринбург</option>
                <option>Нью-Йорк</option>
                <option>Лондон</option>
                <option>Дубай</option>
            </select>

            <button onClick={handleCheckChakra}>Проверить чакру</button>

            {birthChakra && <p>Чакра рождения: <strong>{birthChakra}</strong></p>}
        </div>
    );
}

export default App;
