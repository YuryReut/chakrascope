import { useState } from "react";
import { getBirthChakra } from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";
import day_EQ7 from "../api/dayEQ7_data.json";
import chakraCompatibilityRaw from "../api/chakras_compatibility.json";
import rawDayCouple from "../api/dayCouple.json";

const dayCouple: Record<string, Record<string, DayCoupleAdvice>> = rawDayCouple;

type CompatibilityDetails = {
  how: string;
  not: string;
};

type DayCoupleAdvice = {
  toOther: string;
  fromOther: string;
};

type ChakraCompatibilityEntry = {
  summary: string;
  details: {
    [key: string]: CompatibilityDetails;
  };
};

const chakraCompatibility: Record<string, Record<string, ChakraCompatibilityEntry>> = chakraCompatibilityRaw;

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
  const [hasChangedBirthDate, setHasChangedBirthDate] = useState(false);
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
        sprint: string;
        day: string;
        lunarDescription: string;
        lunarEmoji: string;
        lunarNumber: number;
        lunarTitle: string;
        lunarName: string;
        nakshatraInstagram: string;
        nakshatraName: string;
        nakshatraLink: string;
      };
      currentPath: string;
      today: string;
      todayText: string;
      chakraPeriodLink: string;
      chakraDayLink: string;
      todayNakshatraName: string;
      todayNakshatraLink: string;
    } | null>(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const [questionStep, setQuestionStep] = useState<'intro' | 'select' | 'result'>('intro');
    const [showBirthDetails, setShowBirthDetails] = useState(false);
    const [showTodayDetails, setShowTodayDetails] = useState(false);
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

// 🔹 Совместимость с партнёром
const [showCompatibilityPopup, setShowCompatibilityPopup] = useState(false);
const [partnerBirthDate, setPartnerBirthDate] = useState("2000-12-31");
const [hasChangedPartnerDate, setHasChangedPartnerDate] = useState(false);
const [dayAdvice, setDayAdvice] = useState<DayCoupleAdvice | null>(null);  
const [compatibilityText, setCompatibilityText] = useState<{
  summary: string;
  chakra1?: {
    how: string;
    not: string;
  };
  chakra2?: {
    how: string;
    not: string;
  };
  chakra3?: {
    how: string;
    not: string;
  };
  exactMatch?: boolean;
  promoCode?: string | null;
} | null>(null);

const [openBlock, setOpenBlock] = useState<"chakra1" | "chakra2" | "chakra3" | null>("chakra1");
const [dayAdvice, setDayAdvice] = useState<DayCoupleAdvice | null>(null);

async function generatePromoCode(date1: string, date2: string): Promise<string> {
  const sortedDates = [date1, date2].sort();
  const timestamp = Math.floor(Date.now() / 1000); // секунды

  // Упрощённое кодирование: YYMMDD → base36
  const toBase36Date = (dateStr: string) => {
    const parts = dateStr.split('-');
    const compact = parts[0].slice(2) + parts[1] + parts[2]; // YYMMDD
    return parseInt(compact, 10).toString(36).toUpperCase(); // base36
  };

  const d1 = toBase36Date(sortedDates[0]);
  const d2 = toBase36Date(sortedDates[1]);
  const ts = timestamp.toString(36).toUpperCase();

  const payload = `${d1}-${d2}-${ts}`;
  const secret = "7f0f1aa34d1e20aaab1fd8480db04175bbcc416e8d236039c0fb3e5ce5c48f98";

  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const data = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const shortSig = hashHex.substring(0, 8).toUpperCase();

  return `${d1}-${d2}-${ts}-${shortSig}`;
}

const [showDateAlert, setShowDateAlert] = useState<string | null>(null);  
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

const handleCalculateCompatibility = async () => {
  if (!hasChangedPartnerDate) {
    setShowDateAlert("Пожалуйста, выбери дату рождения партнёра.");
    return;
  }
  if (!partnerBirthDate || !birthChakra) return;

//  const today = new Date().toISOString().split("T")[0];
  const formattedPartnerDate = convertToJulianDate(partnerBirthDate);

  const solarEntry = solarData.find(entry => entry.Date === formattedPartnerDate);
  const lunarEntry = lunarData.find(entry => entry.Date === formattedPartnerDate);

  if (!solarEntry || !lunarEntry) {
    setCompatibilityText({
      summary: "Не удалось определить чакру партнёра.",
    });
    return;
  }

  const sunDegree = solarEntry.Solar_Longitude;
  const moonDegree = lunarEntry.Lunar_Longitude;

  const result = getBirthChakra(partnerBirthDate, sunDegree, moonDegree);
  const partnerChakraNumber = result.result.birth.chakraNumber;
  const yourChakraNumber = birthChakra.birth.chakraNumber;

  const pairData = chakraCompatibility[yourChakraNumber.toString()]?.[partnerChakraNumber.toString()];
  const isExactMatch = yourChakraNumber === partnerChakraNumber;

  if (!pairData) {
    setCompatibilityText({
      summary: "Нет данных о совместимости.",
    });
    return;
  }

  const { summary, details } = pairData;

  const chakra1 = details?.["1"];
  const chakra2 = details?.["2"];
  const chakra3 = details?.["3"];

 const promoCode = isExactMatch ? await generatePromoCode(birthDate, partnerBirthDate) : null;

  const todayChakraNumber = birthChakra.birth.lunarNumber;
  const isPerceptionDay = todayChakraNumber % 2 === 0;

  const lunarChakraNumber = birthChakra.birth.lunarNumber;
  const solarChakraNumber = birthChakra.birth.chakraNumber;
  
  const chakraKey1 = isPerceptionDay ? lunarChakraNumber : solarChakraNumber;
  const chakraKey2 = isPerceptionDay ? partnerChakraNumber : lunarChakraNumber;

  
  const advice = dayCouple[chakraKey1.toString()]?.[chakraKey2.toString()] || null;
  setDayAdvice(advice);

  const advice = dayCouple[chakraKey1.toString()]?.[chakraKey2.toString()];
  setDayAdvice(advice);

setCompatibilityText({
  summary,
  chakra1,
  chakra2,
  chakra3,
  exactMatch: isExactMatch,
  promoCode
});
};

const handleCheckChakra = () => {
  if (!hasChangedBirthDate) {
    setShowDateAlert("Пожалуйста, выбери дату рождения перед расчётом.");
    return;
  }

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
      sprint: "Нет данных",
      day: "Нет данных",
      lunarDescription: "Нет данных",
      lunarEmoji: "❌",
      lunarNumber: 0,
      lunarTitle: "Ошибка",
      lunarName: "Ошибка данных",
      nakshatraInstagram: "#",
      nakshatraName: "Ошибка",
      nakshatraLink: "#"
    },
    currentPath: "Дата вне диапазона данных!",
    today: "",
    todayText: "",
    chakraPeriodLink: "#",
    chakraDayLink: "#",
    todayNakshatraName: "Ошибка",
    todayNakshatraLink: "#"
  });
  return;
}
  
  const sunDegree = solarEntry.Solar_Longitude;
  const moonDegree = lunarEntry.Lunar_Longitude;

  const result = getBirthChakra(birthDate, sunDegree, moonDegree);

  setBirthChakra(result.result);

  setChakraNameSun(result.result.today.split(" и ")[0] as ChakraName);
  setChakraNameMoon(result.result.today.split(" и ")[1] as ChakraName);
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
           <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "10px", margin: "20px 0" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <label style={{ fontSize: "0.8em", marginBottom: "4px" }}>
                Введите дату рождения:
              </label>
              <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setHasChangedBirthDate(true);
                }}
                style={{ 
                  padding: "8px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                  color: "#000",
                  minWidth: "180px"
                }} 
              />
            </div>
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
                {/* Блок 1 — Твоя основная чакра */}
<div style={{ 
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  marginBottom: "15px",
  textAlign: "left"
}}>
  <p>🔆 : Твоя основная чакра: <strong>{birthChakra.birth.chakraName}</strong>, {birthChakra.birth.chakraNumber}-я чакра {birthChakra.birth.chakraTitle}
  <br />
  {birthChakra.birth.outer} →  <a href={birthChakra.birth.link} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
      {birthChakra.birth.chakraEmoji} Подробнее
  </a></p>
 <div style={{ textAlign: "right" }}>
   <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setShowBirthDetails(!showBirthDetails);
    }}
    style={{
      display: "inline-block",
      marginTop: "10px",
      fontSize: "12px",
      color: "#0077cc",
      textDecoration: "underline",
      cursor: "pointer"
    }}
  >
    {showBirthDetails ? "Скрыть" : "Еще"}
  </a>
</div>
  {showBirthDetails && (
    <div style={{ marginTop: "10px" }}>
      <p><strong>Для тебя внутри</strong><br />
        {birthChakra.birth.inner}.</p>
      <p><strong>Снаружи, в твоих действиях</strong><br />
        {birthChakra.birth.outer}.</p>
      <p>
        <strong>Период рождения</strong><br />
        Cвязан с энергией звезд накшатры {" "}
        <a
          href={birthChakra.birth.nakshatraInstagram}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {birthChakra.birth.nakshatraName}
        </a>
      </p>
      <p>🌙 : {birthChakra.birth.lunarDescription} →{" "}
       <a
    href={birthChakra.chakraDayLink}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "inherit", textDecoration: "none" }}
  >
    {birthChakra.birth.lunarEmoji} Подробнее
  </a></p>
    </div>
  )}
</div>

<div style={{
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  marginBottom: "15px",
  textAlign: "left"
}}>
  <p>👁 : <strong>Сегодня</strong> {birthChakra.todayText} 
    {" "}→{" "} 
    <a
      href={birthChakra.chakraDayLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "inherit", textDecoration: "none" }}
    >
     {birthChakra.birth.lunarEmoji} Подробнее
    </a>
  </p>
<div style={{ textAlign: "right" }}>
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setShowTodayDetails(!showTodayDetails);
    }}
    style={{
      display: "inline-block",
      fontSize: "12px",
      color: "#0077cc",
      marginTop: "10px",
      textDecoration: "underline",
      cursor: "pointer"
    }}
  >
    {showTodayDetails ? "Скрыть" : "Еще"}
  </a>
</div>
  {showTodayDetails && (
    <div style={{ marginTop: "10px" }}>
      <p><strong>Период по накшатре{" "}
        <a
          href={birthChakra.todayNakshatraLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {birthChakra.todayNakshatraName}
        </a>
      </strong><br />
        {birthChakra.birth.sprint}
        {" "}→{" "}
        <a
          href={birthChakra.chakraPeriodLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
        >
         {birthChakra.birth.chakraEmoji} Подробнее 
        </a>
      </p>
      <div style={{ textAlign: "center"}}>
      <button onClick={startEmotionDialog}>Твое восприятие сегодня</button>
      </div>
      <p>
        <strong>Твой {
    new Date().getFullYear() - new Date(birthDate).getFullYear() -
    (
      new Date().getMonth() < new Date(birthDate).getMonth() ||
      (
        new Date().getMonth() === new Date(birthDate).getMonth() &&
        new Date().getDate() < new Date(birthDate).getDate()
      )
        ? 1
        : 0
    )
  }-й год</strong><br />
        {birthChakra.currentPath}
      </p>
      <div style={{ textAlign: "center" }}>
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
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  marginBottom: "15px",
  textAlign: "left"
}}>
  <p>
    ❤️ : {birthChakra.birth.relationship} →{" "}
    <a
      href={birthChakra.birth.lovelink}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      Подробнее
    </a>
  </p>

  <div style={{ justifyContent: "center", display: "flex", alignItems: "flex-end", gap: "10px", marginTop: "10px" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <label style={{ fontSize: "0.8em", marginBottom: "4px" }}>
        Дата рождения партнёра:
      </label>
      <input 
        type="date"
        value={partnerBirthDate}
        onChange={(e) => {
          setPartnerBirthDate(e.target.value);
          setHasChangedPartnerDate(true);
        }}
        style={{
          padding: "8px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#fff",
          color: "#000",
          minWidth: "180px"
        }}
      />
    </div>
    <button
      onClick={handleCalculateCompatibility}
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

  {compatibilityText && (
    <div style={{ marginTop: "20px", textAlign: "left" }}>
      <p><strong>Рекомендации</strong><br />{compatibilityText.summary}</p>

      {compatibilityText.exactMatch && (
        <p>
          💖 Это как раз те отношения, которые стоит сохранить.<br />
          Промокод: <strong>{compatibilityText.promoCode}</strong>
        </p>
      )}
{dayAdvice && (
  <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
    <p><strong>💫 Взаимодействие сегодня:</strong></p>
    <p><strong>Тебе с ним:</strong> {dayAdvice.toOther}</p>
    <p><strong>Ему с тобой:</strong> {dayAdvice.fromOther}</p>
  </div>
)}
      <div style={{ marginTop: "10px" }}>
        <p><strong>Стабильность и безопасность</strong><br />{compatibilityText.chakra1?.how}<br />{compatibilityText.chakra1?.not}</p>
        <p><strong>Эмоции и чувственность</strong><br />{compatibilityText.chakra2?.how}<br />{compatibilityText.chakra2?.not}</p>
        <p><strong>Действия и цели</strong><br />{compatibilityText.chakra3?.how}<br />{compatibilityText.chakra3?.not}</p>
      </div>
    </div>
  )}
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
Все ответы в Чакроскопе — это не точные предсказания и не профессиональные рекомендации, а приглашение к самонаблюдению, интуитивному размышлению и честному внутреннему диалогу.
Чакроскоп предназначен исключительно для рефлексии и не является медицинским, психотерапевтическим или юридическим инструментом.{' '}
 <a
    href="/legal.html"
    target="_blank"
    rel="noopener noreferrer"
  >
    Пользовательское соглашение и политика конфиденциальности
  </a>
</p>
<p style={{ marginTop: "10px" }}>
  2025 © Non Profit R&amp;D by{' '}
  <a
    href="https://dzen.ru/a/Z-C6rxkJ3HED4O81"
    target="_blank"
    rel="noopener noreferrer"
  >
    Юрий Реут
  </a>{' '}
  ·{' '}
  <a
    href="https://www.instagram.com/nowyoucanseelove/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Now You Can See Love
  </a>{' '}
  ·{' '}
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
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
  <span
    onClick={() => setShowEmotionDialog(false)}
    style={{
      cursor: "pointer",
      color: "#999"
    }}
  >
    Закрыть
  </span>
</div>
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
          <p><b>Рекомендации к восприятию сегодняшнего дня:</b></p>
          <p style={{ whiteSpace: 'pre-line' }}>{emotionAnalysis}</p>
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
          
{showCompatibilityPopup && (
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
      position: "relative", 
      backgroundColor: "#fff",
      padding: "20px",
      width: "100%",
      maxWidth: "90vw",
      borderRadius: "10px",
      boxSizing: "border-box",
      textAlign: "center",
      color: "#000"
    }}>

<div style={{ position: "relative", paddingTop: "30px", marginBottom: "10px", textAlign: "center" }}>
  <button
    onClick={() => {
      setShowCompatibilityPopup(false);
      setCompatibilityText(null);
    }}
    style={{
      position: "absolute",
      top: "0",
      right: "0",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#999"
    }}
  >
    Закрыть
  </button>

  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "10px", marginBottom: "10px", marginTop: "20px" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <label style={{ fontSize: "0.8em", marginBottom: "4px" }}>
        Дата рождения партнёра:
      </label>
      <input 
        type="date"
        value={partnerBirthDate}
        onChange={(e) => {
          setPartnerBirthDate(e.target.value);
          setHasChangedPartnerDate(true);
        }}
        style={{
          padding: "8px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#fff",
          color: "#000",
          minWidth: "180px"
        }}
      />
    </div>
    <button
      onClick={handleCalculateCompatibility}
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
</div>
      
 {compatibilityText && (
     <div style={{ marginTop: "20px", textAlign: "center" }}>
  <p style={{ marginBottom: "10px" }}>
    <strong>Рекомендации</strong><br />
    {compatibilityText.summary}
  </p>
     {compatibilityText.exactMatch && (
  <div style={{
    border: "1px solid #cccccc",
    borderRadius: "12px",
    padding: "15px",
    marginTop: "20px",
    position: "relative"
  }}>
      <a
      href="https://dzen.ru/a/Z-O8E97FOkrOn3na"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "10px",
        right: "15px",
        fontSize: "13px",
        color: "#0077cc",
        textDecoration: "underline"
      }}
    >
      Подробнее
    </a>
    <p>
      💖 Похоже, что это как раз те отношения, которые стоит <br />
    <a
      href="https://web3wed.io/chakras"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontWeight: "bold"
      }}
    >
      сохранить навечно как настоящую любовь →
    </a><br />
       Промокод: <strong>{compatibilityText.promoCode}</strong>
    </p>
  </div>
)}

  {/* 💛 Стабильность */}
<div style={{ marginBottom: "12px", textAlign: "left" }}>
  <p
    onClick={() => setOpenBlock(openBlock === "chakra1" ? null : "chakra1")}
    style={{
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "underline",
      marginBottom: "6px"
    }}
  >
    Стабильность и безопасность
  </p>
  {openBlock === "chakra1" && (
    <p>
      {compatibilityText.chakra1?.how || "—"} <br />
      {compatibilityText.chakra1?.not || "—"}
    </p>
  )}
</div>

{/* 🧡 Эмоции */}
<div style={{ marginBottom: "12px", textAlign: "left" }}>
  <p
    onClick={() => setOpenBlock(openBlock === "chakra2" ? null : "chakra2")}
    style={{
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "underline",
      marginBottom: "6px"
    }}
  >
    Эмоции и чувственность
  </p>
  {openBlock === "chakra2" && (
      <p>
      {compatibilityText.chakra2?.how || "—"} <br />
      {compatibilityText.chakra2?.not || "—"}
      </p>
  )}
</div>

{/* ❤️‍🔥 Действия */}
<div style={{ marginBottom: "12px", textAlign: "left" }}>
  <p
    onClick={() => setOpenBlock(openBlock === "chakra3" ? null : "chakra3")}
    style={{
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "underline",
      marginBottom: "6px"
    }}
  >
    Действия и цели
  </p>
  {openBlock === "chakra3" && (
      <p>
        {compatibilityText.chakra3?.how || "—"}  <br />
        {compatibilityText.chakra3?.not || "—"}
      </p>
  )}
</div>
</div>

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
    <div style={{ textAlign: "right", marginBottom: "10px" }}>
  <span
    onClick={() => {
      setShowQuestions(false);
      setQuestionStep('intro');
    }}
    style={{
      cursor: "pointer",
      color: "#999",
      textDecoration: "underline"
    }}
  >
    Закрыть
  </span>
</div>  
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
          <p><strong>Твое восприятие этого вопроса сегодня</strong></p>
          <p>
            {queryResult.todayPerception}
          </p>
          <p><strong>Рекомендации</strong></p>
          <p>
            {queryResult.queryOrganicity[0]}
          </p>
          <p>
            {queryResult.growthVector}
          </p>
        </>
      )}
    </div>
  </div>
)}
{showDateAlert && (
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
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      color: "#000",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
      maxWidth: "90vw"
    }}>
      <p style={{ marginBottom: "15px" }}>{showDateAlert}</p>
      <div className="button-row">
        <button onClick={() => setShowDateAlert(null)}>Понятно</button>
      </div>
    </div>
  </div>
)}
   </div>
    );
}

export default App;
