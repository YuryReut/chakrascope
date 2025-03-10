import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";

function convertToJulianDate(dateString: string): string {
    const date = new Date(dateString);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return `${date.getFullYear()}-${dayOfYear.toString().padStart(3, "0")}`;
}

function formatDisplayDate(isoDate: string): string {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`; // Преобразуем в DD.MM.YYYY
}

function parseDisplayDate(displayDate: string): string {
    if (!displayDate) return "";
    const [day, month, year] = displayDate.split(".");
    return `${month}-${day}-${year}`; // Преобразуем обратно в MM-DD-YYYY
}

function App() {
    const [birthDate, setBirthDate] = useState("");

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBirthDate(parseDisplayDate(e.target.value)); // Храним в MM-DD-YYYY
    };

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const formattedDate = convertToJulianDate(birthDate); // Преобразуем в YYYY-DDD

        const solarEntry = solarData.find(entry => entry.Date === formattedDate);
        const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

        if (!solarEntry || !lunarEntry) {
            alert("❌ Ошибка: Дата вне диапазона данных!");
            return;
        }

        const sunDegree = solarEntry.Solar_Longitude;
        const moonDegree = lunarEntry.Lunar_Longitude;

        const result = getBirthChakra(birthDate, today, sunDegree, moonDegree);
        alert(result.result);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            textAlign: "center",
            fontFamily: "inherit",
            padding: "20px",
            boxSizing: "border-box"
        }}>
            <h1>Чакроскоп</h1>

            <label style={{ marginBottom: "10px", fontSize: "1em" }}>
                Введите дату рождения:
            </label>

            <input 
                type="text"
                value={formatDisplayDate(birthDate)} 
                onChange={handleDateChange} 
                placeholder="ДД.ММ.ГГГГ"
                style={{
                    padding: "8px",
                    fontSize: "1em",
                    marginBottom: "15px",
                    backgroundColor: "#ffffff",
                    textAlign: "center"
                }} 
            />

            <button 
                onClick={handleCheckChakra} 
                style={{
                    padding: "10px 20px",
                    fontSize: "1em",
                    cursor: "pointer"
                }}
            >
                Рассчитать
            </button>

            <footer style={{ marginTop: "30px", fontSize: "1em" }}>
                <a href="https://instagram.com/nowyoucanseelove" target="_blank" rel="noopener noreferrer">
                    Now You Can See Love
                </a>
            </footer>
        </div>
    );
}

export default App;
