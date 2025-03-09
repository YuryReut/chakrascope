function getBirthChakra(day, month, year) {
    // Складываем цифры даты рождения
    let sum = day + month + year;
    
    // Преобразуем число в сумму его цифр (нумерологическое сокращение)
    while (sum > 9) {
        sum = String(sum).split('').reduce((acc, num) => acc + parseInt(num), 0);
    }

    // Соотносим с чакрами (циклично 1-7)
    let chakra = (sum % 7) || 7; // Если 0, то 7-я чакра

    return `Чакра рождения: ${chakra}`;
}

// Пример: 10 февраля 1990
console.log(getBirthChakra(10, 2, 1990)); // Выведет чакру рождения
