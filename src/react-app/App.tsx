import { useState } from "react";
import { getBirthChakra, analyzeQuery, analyzeEQ7Responses } from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";

function convertToJulianDate(dateString) {
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

const EQ7_QUESTIONS = [
    "Ты чувствуешь уверенность и стабильность сегодня?",
    "Ты ощущаешь напряжение и контроль?",
    "Ты испытываешь тревогу и страх?",
    "Ты открыт миру и общению сегодня?",
    "Ты слишком зависим от мнения окружающих?",
    "Ты ощущаешь эмоциональную закрытость?"
];

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState("");
    const [showQuestions, setShowQuestions] = useState(false);
    const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [queryResult, setQueryResult] = useState(null);
    const [questionConfirmed, setQuestionConfirmed] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [showEQ7, setShowEQ7] = useState(false);
    const [eq7Answers, setEQ7Answers] = useState(Array(6).fill(null));
    const [eq7Step, setEQ7Step] = useState(0);
    const [eq7Result, setEQ7Result] = useState(null);

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const formattedDate = convertToJulianDate(birthDate);

        const solarEntry = solarData.find(entry => entry.Date === formattedDate);
        const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

        if (!solarEntry || !lunarEntry) {
            setBirthChakra("❌ Ошибка: Дата вне диапазона данных!");
            return;
        }

        const sunDegree = solarEntry.Solar_Longitude;
        const moonDegree = lunarEntry.Lunar_Longitude;

        const result = getBirthChakra(birthDate, today, sunDegree, moonDegree);
        setBirthChakra(result.result);
    };

    const startEQ7 = () => {
        setShowEQ7(true);
        setEQ7Step(0);
        setEQ7Answers(Array(6).fill(null));
        setEQ7Result(null);
    };

    const handleEQ7Answer = (answer) => {
        const newAnswers = [...eq7Answers];
        newAnswers[eq7Step] = answer;
        setEQ7Answers(newAnswers);

        if (eq7Step < 5) {
            setEQ7Step(eq7Step + 1);
        } else {
            const result = analyzeEQ7Responses(birthChakra.solarChakra, birthChakra.lunarChakra, newAnswers);
            setEQ7Result(result);
        }
    };

    return (
        <div>
            <h1>Чакроскоп</h1>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <button onClick={handleCheckChakra}>Рассчитать</button>
            {birthChakra && (
                <div>
                    <p>{birthChakra}</p>
                    <button onClick={startEQ7}>Твой день</button>
                    <button onClick={() => setShowQuestions(true)}>Задать вопрос</button>
                </div>
            )}

            {showEQ7 && !eq7Result && (
                <div>
                    <p>Как ты ощущаешь сегодняшний день?</p>
                    <p>{EQ7_QUESTIONS[eq7Step]}</p>
                    <button onClick={() => handleEQ7Answer(true)}>Да</button>
                    <button onClick={() => handleEQ7Answer(false)}>Нет</button>
                </div>
            )}

            {eq7Result && (
                <div>
                    <p>Твои действия: {eq7Result.solarAction}</p>
                    <p>Твое понимание: {eq7Result.lunarPerception}</p>
                    <button onClick={() => setShowEQ7(false)}>Закрыть</button>
                </div>
            )}

            {showQuestions && (
                <div>
                    {!questionConfirmed ? (
                        <>
                            <p>Тестовый режим. Сформулируйте свой вопрос.</p>
                            <button onClick={() => setQuestionConfirmed(true)}>Готово</button>
                        </>
                    ) : currentQuestion !== null ? (
                        <>
                            <p>Опишите свой вопрос:</p>
                            <p>{QUESTIONS[currentQuestion]}</p>
                            <button onClick={() => handleAnswer(true)}>Да</button>
                            <button onClick={() => handleAnswer(false)}>Нет</button>
                        </>
                    ) : (
                        <>
                            <p>Ваш вопрос обработан.</p>
                            <button onClick={() => setShowQuestions(false)}>Закрыть</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
