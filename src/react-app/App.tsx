import { getDailyChakra } from "../api/dailyChakra"; // Указываем путь к файлу

function App() {
    return (
        <div>
            <h1>Сегодня день {getDailyChakra()}</h1>
        </div>
    );
}

export default App;
