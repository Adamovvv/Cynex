document.addEventListener('DOMContentLoaded', () => {
    checkTicketReset();
    showMain();
});


/**
 * Показать основную страницу
 */
function showMain() {
    const username = localStorage.getItem('username');
    const balance = localStorage.getItem('balance') || 0;
    const tickets = localStorage.getItem('tickets') || 3;
    const farmingBalance = localStorage.getItem('farmingBalance') || '0.00';
    const farmingTimer = localStorage.getItem('farmingTimer') || 0;

    document.getElementById('displayUsername').textContent = username;
    document.getElementById('balance').textContent = balance;
    document.getElementById('tickets').textContent = tickets;
    document.getElementById('farmingBalance').textContent = farmingBalance;
    document.getElementById('farmingTimer').textContent = formatTime(farmingTimer);

    // Запускаем интервал фарминга при загрузке страницы
    if (farmingTimer > 0) {
        startFarmingInterval();
    }
}

/**
 * Проверить и сбросить билеты в полночь
 */
function checkTicketReset() {
    const lastReset = localStorage.getItem('lastTicketReset');
    const now = new Date();

    if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        localStorage.setItem('tickets', 3);
        localStorage.setItem('lastTicketReset', now.toISOString());
    }
}

/**
 * Начать игру
 */
function startGame() {
    let tickets = localStorage.getItem('tickets');
    if (tickets > 0) {
        localStorage.setItem('tickets', tickets - 1);
        window.location.href = 'game.html';
    } else {
        alert('No tickets left. Please wait for ticket regeneration.');
    }
}

/**
 * Начать фарминг
 */
function startFarming() {
    let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
    if (farmingTimer === 0) { // Начать фарминг, если таймер равен 0
        farmingTimer = 28800; // 8 часов в секундах
        localStorage.setItem('farmingTimer', farmingTimer);
        startFarmingInterval();
    } else {
        alert('Farming in progress. Please wait for the timer to reset.');
    }
}

function startFarmingInterval() {
    const farmingInterval = setInterval(() => {
        let farmingTimer = parseInt(localStorage.getItem('farmingTimer'));
        if (farmingTimer > 0) {
            farmingTimer--;
            localStorage.setItem('farmingTimer', farmingTimer);
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
    document.getElementById('farmingBalance').textContent = farmingBalance;
}


/**
 * Форматировать время
 * @param {number} seconds - количество секунд
 * @returns {string} - отформатированное время
 */
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Завершить фарминг и обновить баланс
 */
function completeFarming() {
    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balance += parseFloat(localStorage.getItem('farmingBalance'));
    localStorage.setItem('balance', balance);
    document.getElementById('balance').textContent = balance;
    localStorage.setItem('farmingTimer', 0); // Сбросить таймер до 0
    localStorage.setItem('farmingBalance', '0.00');
}

// Таймер для daily-bonus
function startDailyBonusTimer() {
    const lastClaimTime = localStorage.getItem('lastClaimTime');
    const now = Date.now();
    const sixHoursInMs = 6 * 60 * 60 * 1000;

    if (!lastClaimTime || now - lastClaimTime >= sixHoursInMs) {
        activateClaimButton();
    } else {
        const remainingTime = sixHoursInMs - (now - lastClaimTime);
        updateBonusTimer(remainingTime);
        setTimeout(startDailyBonusTimer, remainingTime);
    }
}

function activateClaimButton() {
    const claimButton = document.querySelector('.claim-btn');
    claimButton.disabled = false;
    claimButton.textContent = 'Claim';
    document.getElementById('bonusTimer').textContent = '00:00:00';
    claimButton.onclick = claimBonus;
}

function claimBonus() {
    const claimButton = document.querySelector('.claim-btn');
    claimButton.disabled = true;
    claimButton.textContent = 'Wait for 6 hours';
    localStorage.setItem('lastClaimTime', Date.now());

    // Добавить логику начисления бонуса
    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balance += 100; // Пример начисления бонуса
    localStorage.setItem('balance', balance);
    document.getElementById('balance').textContent = balance;

    startDailyBonusTimer();
}

function updateBonusTimer(remainingTime) {
    const timerSpan = document.getElementById('bonusTimer');

    const timerInterval = setInterval(() => {
        remainingTime -= 1000;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            activateClaimButton();
        } else {
            timerSpan.textContent = formatTimeWithoutSeconds(Math.floor(remainingTime / 1000));
        }
    }, 1000);
}

// Форматирование времени (часы:минуты:секунды)
function formatTimeWithoutSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}


// Запуск таймера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    startDailyBonusTimer();
});
