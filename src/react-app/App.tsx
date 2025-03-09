// src/App.tsx

import React, { useEffect, useState } from 'react';
import './App.css';
import getChakraOfTheDay from './dailyChakra'; // Импортируем утилиту для определения чакры дня

const App: React.FC = () => {
  const [chakra, setChakra] = useState<string>('');

  useEffect(() => {
    const chakraOfTheDay = getChakraOfTheDay(); // Получаем чакру дня
    setChakra(chakraOfTheDay);
  }, []);

  return (
    <div className="App">
      <h1>Сегодняшняя чакра дня: {chakra}</h1> {/* Отображаем чакру дня */}
    </div>
  );
}

export default App;
