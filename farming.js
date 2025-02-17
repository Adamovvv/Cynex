/**
 * Начать фарминг
 */
function startFarming() {
    console.log('startFarming called'); // Добавляем отладочное сообщение
    let farmingTimer = parseInt(localStorage.getItem(getUserKey('farmingTimer'))) || 0;
    if (farmingTimer === 0) {
        // Установить таймер на 8 часов (28800 секунд)
        farmingTimer = 28800;
        localStorage.setItem('farmingTimer', farmingTimer);
        localStorage.setItem('farmingBalance', '0.00');
        localStorage.setItem('farmingActive', 'true'); // Добавляем флаг активности
        startFarmingInterval();
        updateFarmingButtonText(); // Обновляем текст кнопки
    } else {
        alert('Farming in progress. Please wait for the timer to reset.');
    }
}

/**
 * Запустить интервал для обновления таймера фарминга
 */
function startFarmingInterval() {
    console.log("Farming interval started.");
    let farmingInterval = setInterval(() => {
        let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
        if (farmingTimer > 0) {
            farmingTimer--;
            localStorage.setItem('farmingTimer', farmingTimer);
            console.log(`Farming Timer: ${farmingTimer}`);
            document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);
            updateFarmingBalance();
        } else {
            clearInterval(farmingInterval);
            completeFarming();
        }
    }, 1000);
}

/**
 * Обновить баланс фарминга
 */
function updateFarmingBalance() {
    let farmingBalance = parseFloat(localStorage.getItem('farmingBalance')) || 0;
    let increment = 0.01; // Увеличиваем баланс на 0.01 каждый раз
    farmingBalance += increment;

    // Округляем баланс до двух знаков после запятой
    farmingBalance = farmingBalance.toFixed(2);

    localStorage.setItem('farmingBalance', farmingBalance);
    console.log(`Farming Balance: ${farmingBalance}`);
    document.getElementById('farmingBalance').textContent = farmingBalance;
    updateFarmingButtonText(); // Обновляем текст кнопки
}

/**
 * Завершить фарминг и обновить общий баланс
 */
function completeFarming() {
    localStorage.getItem(getUserKey('balance'))
    balance += parseFloat(localStorage.getItem('farmingBalance'));
    localStorage.setItem(getUserKey('balance'), balance);
    document.getElementById('balance').textContent = balance;
    localStorage.setItem('farmingTimer', 0); // Сбросить таймер до 0
    localStorage.setItem('farmingBalance', '0.00');
    localStorage.setItem('farmingActive', 'false'); // Сбрасываем флаг активности
    updateFarmingButtonText(); // Обновляем текст кнопки
}

/**
 * Форматировать время (часы:минуты:секунды)
 */
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Обновить текст кнопки фарминга
 */
function updateFarmingButtonText() {
    let farmingActive = localStorage.getItem('farmingActive') === 'true';
    let farmingBalance = parseFloat(localStorage.getItem('farmingBalance')) || '0.00';
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer')) || 0;
    let buttonText = '';

    if (farmingActive) {
        buttonText = `<span id="farmingBalance">${farmingBalance}</span> <span id="farmingTimer">${formatTime(farmingTimer)}</span>`;
    } else {
        buttonText = 'Start Farming';
    }

    document.querySelector('.farming-button').innerHTML = buttonText;
}

// Вызываем функцию при загрузке страницы, чтобы установить текст кнопки
document.addEventListener('DOMContentLoaded', function() {
    updateFarmingButtonText();
    if (localStorage.getItem('farmingActive') === 'true' && parseInt(localStorage.getItem('farmingTimer')) > 0) {
        startFarmingInterval();
    }
});