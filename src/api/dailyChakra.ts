export function getDailyChakra(): string {
    const chakras = [
        "Муладхара",
        "Свадхистхана",
        "Манипура",
        "Анахата",
        "Вишудха",
        "Аджна",
        "Сахасрара"
    ];
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = воскресенье, 1 = понедельник и т.д.
    
    // Приводим 0 (воскресенье) к 7 (чтобы начиналось с Муладхары)
    return chakras[(dayIndex === 0 ? 6 : dayIndex - 1)];
}
