export async function getBirthChakra(date: string, time: string, location: string) {
  const apiUrl = `https://api.example.com/astro?date=${date}&time=${time}&location=${location}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data.chakra;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return null;
  }
}
