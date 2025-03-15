import { useState } from "react";
import { getBirthChakra, analyzeEQ7Responses } from "../api/birthChakra";
import solarData from "../api/solar.json";
import lunarData from "../api/lunar.json";

function App() {
    const [birthDate, setBirthDate] = useState("");
    const [birthChakra, setBirthChakra] = useState<{ result: string, solarChakra: number, lunarChakra: number } | null>(null);
    const [showEQ7, setShowEQ7] = useState(false);
    const [eq7Answers, setEQ7Answers] = useState(Array(6).fill(null));
    const [eq7Step, setEQ7Step] = useState(0);
    const [eq7Result, setEQ7Result] = useState<EQ7Response | null>(null);

    const handleCheckChakra = () => {
        const today = new Date().toISOString().split("T")[0];
        const result = getBirthChakra(birthDate, today, 180, 120);
        setBirthChakra(result);
    };

    const startEQ7 = () => {
        setShowEQ7(true);
        setEQ7Step(0);
        setEQ7Answers(Array(6).fill(null));
        setEQ7Result(null);
    };

    const handleEQ7Answer = (answer: boolean) => {
        const newAnswers = [...eq7Answers];
        newAnswers[eq7Step] = answer;
        setEQ7Answers(newAnswers);

        if (eq7Step < 5) {
            setEQ7Step(eq7Step + 1);
        } else if (birthChakra) {
            const result = analyzeEQ7Responses(birthChakra.solarChakra, birthChakra.lunarChakra, newAnswers);
            setEQ7Result(result);
        }
    };
}
