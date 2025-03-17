import { useState } from "react";
import { getBirthChakra, analyzeQuery } from "../api/birthChakra";
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

const QUESTIONS = [
    "Этот вопрос связан с материальной стороной жизни?",
    "Он касается ваших эмоций и желаний?",
    "Этот вопрос про силу воли и достижение целей?",
    "Он связан с отношениями и сердечными чувствами?",
    "Этот вопрос касается самовыражения и творчества?",
    "Он затрагивает интуицию и внутреннее видение?",
    "Этот вопрос про глубокое понимание и осознание?"
];

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(0);
    const [queryResult, setQueryResult] = useState(null);
    const [questionConfirmed, setQuestionConfirmed] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const formattedDate = convertToJulianDate(birthDate);

        const solarEntry = solarData.find(entry => entry.Date === formattedDate);
        const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

        if (!solarEntry || !lunarEntry) {
            setBirthChakra({ birth: "❌ Ошибка", currentPath: "Дата вне диапазона данных!", today: "" });
            return;
        }

        const sunDegree = solarEntry.Solar_Longitude;
        const moonDegree = lunarEntry.Lunar_Longitude;

        const result = getBirthChakra(birthDate, today, sunDegree, moonDegree);
        setBirthChakra(result.result);
    };

    const handleAnswer = (answer: boolean) => {
        if (currentQuestion !== null) {
            const newAnswers = [...answers];
            newAnswers[currentQuestion] = answer;
            setAnswers(newAnswers);

            if (currentQuestion < QUESTIONS.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setCurrentQuestion(null);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Чакроскоп</h1>
                <input className="mb-4 p-2 border rounded" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                <button className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600" onClick={handleCheckChakra}>Рассчитать</button>
                
                {showQuestions && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            {currentQuestion !== null ? (
                                <>
                                    <p className="mb-4">{QUESTIONS[currentQuestion]}</p>
                                    <button className="bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 mr-2" onClick={() => handleAnswer(true)}>Да</button>
                                    <button className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600" onClick={() => handleAnswer(false)}>Нет</button>
                                </>
                            ) : (
                                <>
                                    <p>Опрос завершён. Анализируем...</p>
                                    <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600" onClick={() => setShowQuestions(false)}>Закрыть</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
