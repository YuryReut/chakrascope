import { useState } from "react";
import {
  getBirthChakra,
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

function App() {
  const [birthDate, setBirthDate] = useState("2000-12-31");
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
    todayText: string;
} | null>(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const [questionStep, setQuestionStep] = useState<'intro' | 'select' | 'result'>('intro');
    const [showBirthDetails, setShowBirthDetails] = useState(false);
    const [queryResult, setQueryResult] = useState<null | {
        interpretation: string;
        growthVector: string;
        queryOrganicity: string[];
        todayPerception: string;
    }>(null);

    // 🔹 Состояния для диалога про эмоции дня 
const [showEmotionDialog, setShowEmotionDialog] = useState(false);
const [emotionAnalysis, setEmotionAnalysis] = useState<string | null>(null);
const [currentStep, setCurrentStep] = useState<'intro' | 'sun' | 'moon' | 'result'>('intro');
const [sunState, setSunState] = useState<'balance' | 'excess' | 'block' | null>(null);
const [chakraNameSun, setChakraNameSun] = useState<ChakraName | null>(null);
const [chakraNameMoon, setChakraNameMoon] = useState<ChakraName | null>(null);    
const [moonState, setMoonState] = useState<'balance' | 'excess' | 'block' | null>(null);
void moonState;
// 🔹 Как ты воспринимаешь вопрос сегодня — по чакре дня


const [isEmotionStepCompleted, setIsEmotionStepCompleted] = useState(false);
const [showEmotionReminder, setShowEmotionReminder] = useState(false);    
void queryResult;
  
// 🔹 Обработка выбора состояния чакры
const handleStateSelect = (state: 'balance' | 'excess' | 'block') => {
    if (currentStep === 'sun') {
        setSunState(state);
        setCurrentStep('moon');
    } else if (currentStep === 'moon') {
        setMoonState(state);
        setCurrentStep('result');

        if (!chakraNameSun || !chakraNameMoon) {
            setEmotionAnalysis('⚠️ Ошибка определения чакр дня.');
            return;
        }

        const chakraInfoSun = day_EQ7.chakras[chakraNameSun as ChakraName];
        const chakraInfoMoon = day_EQ7.chakras[chakraNameMoon as ChakraName];

        if (!chakraInfoSun || !chakraInfoMoon) {
            setEmotionAnalysis('⚠️ Ошибка загрузки данных для чакр дня.');
            return;
        }

        setEmotionAnalysis(
          `☀️ В действиях: ${chakraInfoSun.sun_recommendations[sunState!]}\n` +
          `🌙 В эмоциях: ${chakraInfoMoon.moon_recommendations[state]}`
        );

        // ✅ Ставим флаг — состояние дня пройдено
        setIsEmotionStepCompleted(true);
    }
};

const startEmotionDialog = () => {
    if (birthChakra?.today) {
        const chakrasToday = birthChakra.today.split(" и ");
        if (chakrasToday.length === 2) {
            setChakraNameSun(chakrasToday[0].trim() as ChakraName);
            setChakraNameMoon(chakrasToday[1].trim() as ChakraName);
        }
    }

    setShowEmotionDialog(true);
    setEmotionAnalysis(null);
    setCurrentStep('intro');
    setSunState(null);
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
              today: "",
              todayText: ""
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
        setQueryResult(null);
    };

    const generateQueryResult = (chakraIndex: number) => {
      const chakraLabels = [
        "Материальное, безопасность",
        "Эмоции, желания",
        "Достижения, сила воли",
        "Отношения, чувства",
        "Творчество, выражение",
        "Интуиция, образы",
        "Единство, духовность"
      ];
      const interpretation = chakraLabels[chakraIndex];

      let todayPerception = "Ты можешь доверять своему ощущению — оно достаточно ясное.";
        if (moonState === "block") {
          todayPerception = "Сегодня ты, скорее всего, не сможешь чётко почувствовать суть этого вопроса.";
        } else if (moonState === "excess") {
          todayPerception = "Есть риск переоценить значимость этого вопроса — будь внимательнее к ощущениям.";
        }


      let organicityText = "Это не совсем естественная для тебя тема — может быть сложнее понять, как с ней быть.";
      if (birthChakra) {
        const chakraLineMap = {
          1: "male", 3: "male", 5: "male", 7: "female",
          2: "female", 4: "female", 6: "female"
        };
        const birth = birthChakra.birth.chakraNumber;
        const birthLine = chakraLineMap[birth === 7 ? 2 : birth as keyof typeof chakraLineMap];
        const questionLine = chakraLineMap[(chakraIndex + 1) as keyof typeof chakraLineMap];
        if (birthLine === questionLine) {
          organicityText = "Это естественная для тебя тема — ты легко ориентируешься в этом направлении.";
        }
      }

      let vectorText = "Сейчас это направление не является ключевым для твоего роста.";
      if (birthChakra) {
        const chakraLineMap = {
          1: "male", 3: "male", 5: "male", 7: "female",
          2: "female", 4: "female", 6: "female"
        };
        const yearChakra = parseInt(birthChakra.currentPath.match(/\d/)?.[0] || "0");
        const yearLine = chakraLineMap[yearChakra === 7 ? 2 : yearChakra as keyof typeof chakraLineMap];
        const questionLine = chakraLineMap[(chakraIndex + 1) as keyof typeof chakraLineMap];
        if (yearLine === questionLine) {
          if (chakraIndex + 1 < yearChakra) {
            vectorText = "Этот вопрос возвращает тебя к уже пройденным темам — в этом нет ничего плохого.";
          } else if (chakraIndex + 1 === yearChakra) {
            vectorText = "Ты как раз в той точке — этот вопрос точно соответствует твоему внутреннему пути.";
          } else {
            vectorText = "Это может ощущаться как вызов — но он идёт в верном направлении.";
          }
        }
      }
      
      return {
        interpretation,
        todayPerception,
        queryOrganicity: [organicityText],
        growthVector: vectorText
      };
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
          <style>
  {`
    button {
      background-color: #fff;
      color: #000;
      border: 1px solid #000;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 16px;
      cursor: pointer;
      margin: 6px;
      transition: background-color 0.2s ease;
    }

    button:hover {
      background-color: #f0f0f0;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-top: 10px;
    }

    .button-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: stretch;
      margin-top: 10px;
    }
  `}
</style>

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
              <h1 style={{ fontWeight: 200, fontSize: "32px", marginBottom: "10px" }}>Чакроскоп</h1>
             <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
              <label style={{ marginRight: "10px" }}>
                Введите дату рождения:
                <input 
                  type="date" 
                  value={birthDate} 
                  onChange={(e) => setBirthDate(e.target.value)} 
                  style={{ 
                    marginLeft: "10px",
                    padding: "8px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    color: "#000",
                    minWidth: "180px"
                  }} 
                />
              </label>
              <button
                onClick={handleCheckChakra}
                style={{
                  padding: "8px 16px",
                  fontSize: "18px",
                  border: "1px solid #000",
                  backgroundColor: "transparent",
                  color: "#000",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                →
              </button>
            </div>
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
                    <h4>База</h4>
                    <p>
                      🔆 | {birthChakra.birth.chakraEmoji} : Твоя основная чакра — {birthChakra.birth.chakraNumber}-я чакра {birthChakra.birth.chakraTitle} ({birthChakra.birth.chakraName}) →{' '}
                      <a href={birthChakra.birth.link} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>Подробнее</a>
                    </p>
                    <p>
                      ❤️ : {birthChakra.birth.relationship} →{' '}
                      <a href={birthChakra.birth.lovelink} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>Подробнее</a>
                    </p>
                  
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowBirthDetails(!showBirthDetails);
                      }}
                      style={{
                        display: "inline-block",
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#0077cc",
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      {showBirthDetails ? "Скрыть" : "Подробнее"}
                    </a>

                    {showBirthDetails && (
                      <div style={{ marginTop: "10px" }}>
                      <p>Для тебя внутри — {birthChakra.birth.inner}.</p>
                      <p>Снаружи, в твоих действиях — {birthChakra.birth.outer}.</p>
                      <p>🌙 | {birthChakra.birth.lunarEmoji} : {birthChakra.birth.lunarDescription}</p>
                    </div>
                    )}
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
                    <h4>Сегодня</h4>
                    <p>{birthChakra.todayText}</p>
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
                        <h4>Твой 2025-й</h4>
                        <p>{birthChakra.currentPath}</p>
                        <button
                          onClick={() => {
                            if (isEmotionStepCompleted) {
                              startQuestionnaire();
                            } else {
                              setShowEmotionReminder(true);
                            }
                          }}
                          style={{
                            opacity: isEmotionStepCompleted ? 1 : 0.5,
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                            marginTop: "10px"
                          }}
                        >
                          Задать вопрос
                        </button>
                    </div>
                </div>
            )}
            </div>
  <div style={{
    marginTop: "20px",
    maxWidth: "700px",
    width: "100%",
    textAlign: "center",
    fontSize: "65%",
    lineHeight: "1.5",
    color: "#000"
}}>
  <p>
  Чакроскоп — это инструмент самопознания, который соединяет древнее знание о чакрах с реальными астрономическими данными о Солнце и Луне.
  Он помогает понять, какие энергии активны в тебе сегодня, какие процессы формируют твой год и какие внутренние ритмы ведут тебя с самого начала.
  Это способ мягко взглянуть на своё состояние, уловить ритмы жизни и начать лучше чувствовать себя — без мистики, просто наблюдая.{' '} 
    <a
      href="https://dzen.ru/a/Z-D7Rnsxljt7vFYY"
      target="_blank"
      rel="noopener noreferrer"
    >
      Подробнее на Дзене
    </a>  
</p>
<p style={{ marginTop: "10px" }}>
  Все ответы в Чакроскопе — это не точные предсказания и не профессиональные рекомендации, а приглашение к самонаблюдению и честному внутреннему диалогу.
  Этот инструмент не заменяет медицинскую, психологическую или юридическую помощь.
</p>
  <p style={{ marginTop: "10px" }}>
    2025 © Non Profit R&D by{' '} 
    <a
      href="https://dzen.ru/a/Z-C6rxkJ3HED4O81"
      target="_blank"
      rel="noopener noreferrer"
    >
      Now You Can See Love
    </a> {' '}
    <a
      href="https://www.instagram.com/nowyoucanseelove/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Now You Can See Love
    </a>
  </p>
</div>

{showEmotionReminder && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    color: "#000",
    padding: "20px",
    borderRadius: "10px",
    boxSizing: "border-box",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    textAlign: "center",
    width: "100%",
    maxWidth: "90vw"
  }}>
    <p style={{ marginBottom: "15px" }}>
      🔁 Чтобы задать вопрос, сначала уточни своё состояние дня.
    </p>
    <button
      onClick={() => {
        setShowEmotionReminder(false);
        startEmotionDialog();
      }}
     >
      Перейти к состоянию дня
    </button>
  </div>
)}
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
    alignItems: "center",
    zIndex: 999
  }}>
    <div style={{
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      width: "100%",
      maxWidth: "90vw",
      boxSizing: "border-box",
      textAlign: "center",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      color: "#000"
    }}>

      {/* Этап 0 — вступительный текст */}
      {currentStep === 'intro' && (
        <>
          <p>🙏</p>
          <p style={{ marginBottom: "20px", whiteSpace: "pre-line" }}>
           Наше восприятие часто бывает искажено — под влиянием гормонов, эмоций и автоматических реакций.  
Только в состоянии глубокой концентрации или медитации оно становится по-настоящему ясным.  
Каждый день активируются определённые уровни нервной и энергетической системы, влияющие на то, как мы действуем и чувствуем.  
Осознавая, через какой центр ты воспринимаешь происходящее сегодня, ты можешь лучше понять свои эмоции и интерпретировать свои действия.  
Этот процесс не даёт готовых ответов, но помогает настроиться на себя и почувствовать, что действительно важно именно сейчас.
            </p>
          <button onClick={() => setCurrentStep('sun')}>
            Уточнить состояние
          </button>
        </>
      )}

      {/* Этап 1 — состояние по Солнцу */}
      {currentStep === 'sun' && chakraNameSun && day_EQ7.chakras[chakraNameSun] && (
        <>
          <p>Что больше описывает твои <b>действия</b> сегодня?</p>
          <div className="button-column">
          <button onClick={() => handleStateSelect("balance")}>🙂 {day_EQ7.chakras[chakraNameSun].states.balance}</button>
          <button onClick={() => handleStateSelect("excess")}>😵 {day_EQ7.chakras[chakraNameSun].states.excess}</button>
          <button onClick={() => handleStateSelect("block")}>😶 {day_EQ7.chakras[chakraNameSun].states.block}</button>
        </div>
       </>
      )}

      {/* Этап 2 — состояние по Луне */}
      {currentStep === 'moon' && chakraNameMoon && day_EQ7.chakras[chakraNameMoon] && (
        <>
          <p>Что лучше описывает твои <b>эмоции</b> сегодня?</p>
          <div className="button-column">
          <button onClick={() => handleStateSelect("balance")}>🙂 {day_EQ7.chakras[chakraNameMoon].states.balance}</button>
          <button onClick={() => handleStateSelect("excess")}>😵 {day_EQ7.chakras[chakraNameMoon].states.excess}</button>
          <button onClick={() => handleStateSelect("block")}>😶 {day_EQ7.chakras[chakraNameMoon].states.block}</button>
          </div>
        </>
      )}

      {/* Этап 3 — результат */}
      {currentStep === 'result' && emotionAnalysis && (
        <>
          <p><b>Рекомендации:</b></p>
          <p style={{ whiteSpace: 'pre-line' }}>{emotionAnalysis}</p>
          <div className="button-row">
            <button onClick={() => setShowEmotionDialog(false)}>Закрыть</button>
          </div>
        </>
      )}

      {/* Ошибка — если данных нет */}
      {(!chakraNameSun || !chakraNameMoon || !day_EQ7.chakras[chakraNameSun] || !day_EQ7.chakras[chakraNameMoon]) && (
        <>
          <p>⚠️ Данные о чакрах дня не загружены корректно.</p>
          <div className="button-row">
            <button onClick={() => setShowEmotionDialog(false)}>Закрыть</button>
          </div>
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
    alignItems: "center",
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: "white",
      padding: "20px",
      width: "100%",
      maxWidth: "90vw",
      borderRadius: "10px",
      boxSizing: "border-box",
      textAlign: "center",
      color: "#000"
    }}>
    {questionStep === 'intro' && (
        <>
          <p>🙌</p>
          <p style={{ marginBottom: "20px" }}>
            Этот инструмент не даёт готового ответа. Его задача — помочь тебе услышать себя и убрать внешний шум.
Это пространство для саморефлексии — когда хочется сделать выбор, который действительно твой.
Он подходит для решений, эффект от которых длится дольше естественного биоритма — больше 52 дней.
Иногда полезно просто понаблюдать за своим вопросом в тишине — или посвятить ему немного времени в медитации.<br />
⚠️ Если ситуация требует срочного действия (например, по здоровью, деньгам или документам) — лучше использовать другие инструменты.
<br />
Дай себе момент. Ответ уже может быть внутри.
          </p>
          <button onClick={() => setQuestionStep('select')}>Определить вопрос</button>
          <div className="button-row" style={{ marginTop: "20px" }}>
            <button onClick={() => setShowQuestions(false)}>Отмена</button>
          </div>
        </>
      )}

      {questionStep === 'select' && (
        <>
          <p style={{ marginBottom: "20px" }}>
            Выбери только одну сферу жизни к которой относится твой вопрос
          </p>
         <div className="button-column">
          {/* 🔴 Муладхара */}
          <button onClick={() => { setQueryResult(generateQueryResult(0)); setQuestionStep('result'); }}>
            Про безопасность, дом и деньги
          </button>
        
          {/* 🟠 Свадхистхана */}
          <button onClick={() => { setQueryResult(generateQueryResult(1)); setQuestionStep('result'); }}>
            Про чувства, удовольствие и тело
          </button>
        
          {/* 🟡 Манипура */}
          <button onClick={() => { setQueryResult(generateQueryResult(2)); setQuestionStep('result'); }}>
            Про цель, силу и развитие
          </button>
        
          {/* 🟢 Анахата */}
          <button onClick={() => { setQueryResult(generateQueryResult(3)); setQuestionStep('result'); }}>
            Про любовь, близость и связь
          </button>
        
          {/* 🔵 Вишудха */}
          <button onClick={() => { setQueryResult(generateQueryResult(4)); setQuestionStep('result'); }}>
            Про самовыражение, творчество и право на голос
          </button>
        
          {/* 🟣 Аджна */}
          <button onClick={() => { setQueryResult(generateQueryResult(5)); setQuestionStep('result'); }}>
            Про интуицию, доверие себе и выбор пути
          </button>
        
          {/* ⚪ Сахасрара */}
          <button onClick={() => { setQueryResult(generateQueryResult(6)); setQuestionStep('result'); }}>
            Про доверие жизни, отпускание контроля и внутреннюю опору
          </button>
        </div>

        </>
      )}

      {questionStep === 'result' && queryResult && (
        <>
          <p><strong>Рекомендации</strong></p>
          <p>
            {queryResult.todayPerception}
          </p>
          <p>
            {queryResult.queryOrganicity[0]}
          </p>
          <p>
            {queryResult.growthVector}
          </p>
          <div className="button-row">
            <button onClick={() => {
              setShowQuestions(false);
              setQuestionStep('intro');
            }}>Закрыть</button>
          </div>
        </>
      )}
    </div>
  </div>
)}
        </div>
    );
}

export default App;
