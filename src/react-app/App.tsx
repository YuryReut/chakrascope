import { useState } from "react";
import {
  getBirthChakra,
  analyzeQuery,
  getPersonalChakraDay,
  getCurrentTithi,
  getChakraFromTithi
} from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";
import day_EQ7 from "../api/dayEQ7_data.json";

type ChakraName = 'Муладхара' | 'Свадхистхана' | 'Манипура' | 'Анахата' | 'Вишудха' | 'Аджна' | 'Сахасрара';

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
    const [birthChakra, setBirthChakra] = useState<{
    birth: {
        chakraNumber: number;
        chakraEmoji: string;
        chakraTitle: string;
        chakraName: string;
        inner: string;
        outer: string;
        relationship: string;
        link: string;
        lovelink: string;
        lunarDescription: string;
        lunarEmoji: string;
        lunarNumber: number;
        lunarTitle: string;
        lunarName: string;
    };
    currentPath: string;
    today: string;
} | null>(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(0);
    const [queryResult, setQueryResult] = useState<null | {
        interpretation: string;
        growthVector: string;
        queryOrganicity: string[];
    }>(null);
    const [questionConfirmed, setQuestionConfirmed] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    // 🔹 Состояния для диалога про эмоции дня 
const [showEmotionDialog, setShowEmotionDialog] = useState(false);
const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
const [emotionAnalysis, setEmotionAnalysis] = useState<string | null>(null);
const [currentStep, setCurrentStep] = useState<'sun' | 'moon' | 'result'>('sun');
const [sunState, setSunState] = useState<'balance' | 'excess' | 'block' | null>(null);
const [moonState, setMoonState] = useState<'balance' | 'excess' | 'block' | null>(null);
const [chakraNameSun, setChakraNameSun] = useState<ChakraName | null>(null);
const [chakraNameMoon, setChakraNameMoon] = useState<ChakraName | null>(null);    
console.log(selectedEmotion, moonState); // временно, чтобы убрать ошибки
    
// 🔹 Обработка выбора состояния чакры
const handleStateSelect = (state: 'balance' | 'excess' | 'block') => {
    if (currentStep === 'sun') {
        setSunState(state);
        setCurrentStep('moon');
    } else if (currentStep === 'moon') {
        setMoonState(state);
        setCurrentStep('result');

        const chakrasToday = birthChakra?.today.split(' и ');
        
        if (!chakrasToday || chakrasToday.length !== 2) {
            setEmotionAnalysis('⚠️ Ошибка определения чакр дня.');
            return;
        }

        const [chakraNameSun, chakraNameMoon] = chakrasToday as [ChakraName, ChakraName];

        const chakraInfoSun = day_EQ7.chakras[chakraNameSun];
        const chakraInfoMoon = day_EQ7.chakras[chakraNameMoon];

        if (!chakraInfoSun || !chakraInfoMoon) {
            setEmotionAnalysis('⚠️ Ошибка загрузки данных для чакр дня.');
            return;
        }

        setEmotionAnalysis(
            `☀️ По Солнцу (${chakraNameSun}): ${chakraInfoSun.sun_recommendations[sunState!]}\n🌙 По Луне (${chakraNameMoon}): ${chakraInfoMoon.moon_recommendations[state]}`
        );
    }
};

const startEmotionDialog = () => {
    if (birthChakra?.today) {
        const chakrasToday = birthChakra.today.split(" и ");
        if (chakrasToday.length === 2) {
            setChakraNameSun(chakrasToday[0] as ChakraName);
            setChakraNameMoon(chakrasToday[1] as ChakraName);
        }
    }

    setShowEmotionDialog(true);
    setSelectedEmotion(null);
    setEmotionAnalysis(null);
    setCurrentStep('sun');
    setSunState(null);
    setMoonState(null);
};

  const handleCheckChakra = () => {
    const today = new Date().toISOString().split("T")[0];
    const formattedDate = convertToJulianDate(birthDate);

    const solarEntry = solarData.find(entry => entry.Date === formattedDate);
    const lunarEntry = lunarData.find(entry => entry.Date === formattedDate);

    if (!solarEntry || !lunarEntry) {
        setBirthChakra({ 
              birth: {
                chakraNumber: 0,
                chakraEmoji: "❌",
                chakraTitle: "Ошибка",
                chakraName: "Ошибка данных",
                inner: "Ошибка даты",
                outer: "Дата вне диапазона",
                relationship: "Нет данных",
                link: "#",
                lovelink: "#",
                lunarDescription: "Нет данных",
                lunarEmoji: "❌",
                lunarNumber: 0,
                lunarTitle: "Ошибка",
                lunarName: "Ошибка данных"
              }, 
              currentPath: "Дата вне диапазона данных!", 
              today: "" 
            });
        return;
    }

    const sunDegree = solarEntry.Solar_Longitude;
    const moonDegree = lunarEntry.Lunar_Longitude;

    const result = getBirthChakra(birthDate, today, sunDegree, moonDegree);
    setBirthChakra(result.result);

    // 🔹 Добавляем расчет чакр по солнцу и луне
    const chakraNameMap = {
        1: "Муладхара",
        2: "Свадхистхана",
        3: "Манипура",
        4: "Анахата",
        5: "Вишудха",
        6: "Аджна",
        7: "Сахасрара"
    };

    const chakraNumberSun = getPersonalChakraDay(birthDate, today, moonDegree);
    const chakraNumberMoon = getChakraFromTithi(getCurrentTithi(moonDegree));

    setChakraNameSun(chakraNameMap[chakraNumberSun as keyof typeof chakraNameMap] as ChakraName);
    setChakraNameMoon(chakraNameMap[chakraNumberMoon as keyof typeof chakraNameMap] as ChakraName);
};


    const startQuestionnaire = () => {
        setShowQuestions(true);
        setQuestionConfirmed(false);
        setCurrentQuestion(0);
        setAnswers(Array(QUESTIONS.length).fill(null));
        setShowAnalysis(false);
        setQueryResult(null);
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

    const handleGetAnswer = () => {
        const analysis = analyzeQuery(answers);
        setQueryResult(analysis);
        setShowAnalysis(true);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100vw",
            textAlign: "center",
            fontFamily: "inherit",
            color: "black",
            padding: "20px",
            boxSizing: "border-box",
            backgroundColor: "#ffffff"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                maxWidth: "700px",
                margin: "20px auto",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <h1>Чакроскоп</h1>
                <p>Чакроскоп — это твой уникальный энергетический портрет. Он показывает, как движется твоя внутренняя энергия и как это влияет на тебя прямо сейчас.</p>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /> <button onClick={handleCheckChakra}>Рассчитать</button>

            {birthChakra && (
                <div>
                    {/* Блок 1 - С чем ты пришел в мир */}
                    <div style={{
                            backgroundColor: "#ffffff",
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            marginBottom: "15px",
                            textAlign: "left"
                        }}>
                        <h4>🔆 С чем ты пришел в этот мир:</h4>
                        <p>
                          🔆 Твоя основная чакра — {birthChakra.birth.chakraEmoji} {birthChakra.birth.chakraNumber}-й чакры {birthChakra.birth.chakraTitle} ({birthChakra.birth.chakraName}) → <a 
                              href={birthChakra.birth.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: "inherit", textDecoration: "none" }}
                            >
                              Подробнее
                            </a>
                            <br />
                          🌀 Внутреннее ощущение: {birthChakra.birth.inner}<br />
                          🌍 Как это проявляется в жизни: {birthChakra.birth.outer}<br />
                          ❤️ В любви и отношениях: {birthChakra.birth.relationship} → <a 
                              href={birthChakra.birth.lovelink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: "inherit", textDecoration: "none" }}
                            >
                              Подробнее
                            </a>
                          <br /><br />
                          🌙 Твое восприятие мира — {birthChakra.birth.lunarDescription} из {birthChakra.birth.lunarEmoji} {birthChakra.birth.lunarNumber}-й Чакры {birthChakra.birth.lunarTitle} ({birthChakra.birth.lunarName}).
                        </p>
                    </div>
                    {/* Блок 2 - Сегодня */}
                    <div style={{
                            backgroundColor: "#ffffff",
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            marginBottom: "15px",
                            textAlign: "left"
                        }}>
                        <h4>📅 Сегодня твой день:</h4>
                        <p>{birthChakra.today}</p>
                        <button onClick={startEmotionDialog}>Твое восприятие сегодня</button>
                    </div>

                    {/* Блок 3 - Твой путь сейчас */}
                    <div style={{
                            backgroundColor: "#ffffff",
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            marginBottom: "15px",
                            textAlign: "left"
                        }}>
                        <h4>🛤️ Твой путь сейчас:</h4>
                        <p>{birthChakra.currentPath}</p>
                        <button onClick={startQuestionnaire}>Задать вопрос</button>
                    </div>
                <p>
              2025 © R&D проект Юры Реута{' '}
              <a
                href="https://www.instagram.com/nowyoucanseelove/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Now you can see love
              </a>
            </p>
                </div>
            )}
            </div>    
{/* 🔹 Диалог "Твое восприятие сегодня" */}
{showEmotionDialog && birthChakra && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "90%",
      width: "500px",
      textAlign: "center",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      color: "#000"
    }}>
      {currentStep === 'sun' && chakraNameSun && day_EQ7.chakras[chakraNameSun] && (
        <>
          <p>
            Как ты ощущаешь состояние своей чакры дня <b>по Солнцу</b> ({chakraNameSun}) прямо сейчас?
          </p>
          <button onClick={() => handleStateSelect("balance")}>
            ✅ В балансе<br /><small>{day_EQ7.chakras[chakraNameSun].states.balance}</small>
          </button>
          <button onClick={() => handleStateSelect("excess")}>
            🌊 В потоке (избыток)<br /><small>{day_EQ7.chakras[chakraNameSun].states.excess}</small>
          </button>
          <button onClick={() => handleStateSelect("block")}>
            ⛔️ В блоке<br /><small>{day_EQ7.chakras[chakraNameSun].states.block}</small>
          </button>
        </>
      )}

      {currentStep === 'moon' && chakraNameMoon && day_EQ7.chakras[chakraNameMoon] && (
        <>
          <p>
            Как ты ощущаешь состояние своей чакры дня <b>по Луне</b> ({chakraNameMoon}) прямо сейчас?
          </p>
          <button onClick={() => handleStateSelect("balance")}>
            ✅ В балансе<br /><small>{day_EQ7.chakras[chakraNameMoon].states.balance}</small>
          </button>
          <button onClick={() => handleStateSelect("excess")}>
            🌊 В потоке (избыток)<br /><small>{day_EQ7.chakras[chakraNameMoon].states.excess}</small>
          </button>
          <button onClick={() => handleStateSelect("block")}>
            ⛔️ В блоке<br /><small>{day_EQ7.chakras[chakraNameMoon].states.block}</small>
          </button>
        </>
      )}

      {currentStep === 'result' && emotionAnalysis && (
        <>
          <p style={{ whiteSpace: 'pre-line' }}>{emotionAnalysis}</p>
          <button onClick={() => setShowEmotionDialog(false)}>Закрыть</button>
        </>
      )}

      {(!chakraNameSun || !chakraNameMoon || !day_EQ7.chakras[chakraNameSun] || !day_EQ7.chakras[chakraNameMoon]) && (
        <>
          <p>⚠️ Данные о чакрах дня не загружены корректно.</p>
          <button onClick={() => setShowEmotionDialog(false)}>Закрыть</button>
        </>
      )}
    </div>
  </div>
)}

{/* 🔹 Диалог "Задать вопрос" */}
            {showQuestions && (
                <div style={{
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center"
                    }}>
                    {!questionConfirmed ? (
                        <>
                            <p>Тестовый режим. Сформулируйте свой вопрос.</p>
                            <button onClick={() => setQuestionConfirmed(true)}>Готово</button>
                        </>
                    ) : currentQuestion !== null ? (
                        <>
                            <p>{QUESTIONS[currentQuestion]}</p>
                            <button onClick={() => handleAnswer(true)}>Да</button>
                            <button onClick={() => handleAnswer(false)}>Нет</button>
                        </>
                    ) : !showAnalysis ? (
                        <>
                            <p>Ваш вопрос описан.</p>
                            <button onClick={handleGetAnswer}>Получить ответ</button>
                        </>
                    ) : queryResult ? (
                        <div>
                            <p>📜 <b>Вы понимаете сам вопрос как:</b> {queryResult.interpretation}</p>
                            <p>🔄 <b>Этот вопрос про:</b> {queryResult.growthVector}</p>
                            <p>🌱 <b>Для вас этот вопрос:</b> {queryResult.queryOrganicity.join(", ")}</p>
                            <button onClick={() => setShowQuestions(false)}>Закрыть</button>
                        </div>
                    ) : null}
                </div>
              </div>
            )}
        </div>
    );
}

export default App;
