// src/api/dailyChakra.ts

const getChakraOfTheDay = (): string => {
  const daysOfWeek = [
    "Муладхара",   // Понедельник
    "Свадхистхана", // Вторник
    "Манипура",     // Среда
    "Анахата",      // Четверг
    "Вишудха",      // Пятница
    "Аджна",        // Суббота
    "Сахасрара"     // Воскресенье
  ];

  const today = new Date();
  const dayOfWeek = today.getDay(); // Метод getDay() возвращает день недели (0 - воскресенье, 1 - понедельник и т.д.)

  return daysOfWeek[dayOfWeek];
};

export default getChakraOfTheDay;
