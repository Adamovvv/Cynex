document.addEventListener('DOMContentLoaded', () => {
    checkTicketReset();
    showMain();
});


/**
 * Показать основную страницу
 */
function showMain() {
    const user = {
        id: localStorage.getItem('tg_user_id'),
        firstName: localStorage.getItem('tg_first_name'),
        username: localStorage.getItem('tg_username'),
        avatar: localStorage.getItem('tg_avatar')
    };
    // Отображаем имя пользователя
    const displayName = user.firstName || user.username || 'Player';
    document.getElementById('displayUsername').textContent = displayName;
    
    const avatar = localStorage.getItem('tg_avatar') || 'images/default_avatar.png';
    // Обновляем аватар
    document.getElementById('avatar').src = user.avatar || 'images/default_avatar.png';
    const username = localStorage.getItem('username');
    const balance = localStorage.getItem('balance') || 0;
    const tickets = localStorage.getItem('tickets') || 3;
    const farmingBalance = localStorage.getItem('farmingBalance') || '0.00';
    const farmingTimer = localStorage.getItem('farmingTimer') || 0;

    // Проверяем, есть ли элемент перед записью в него
    const usernameElem = document.getElementById('displayUsername');
    const balanceElem = document.getElementById('balance');
    const ticketsElem = document.getElementById('tickets');
    const farmingBalanceElem = document.getElementById('farmingBalance');
    const farmingTimerElem = document.getElementById('farmingTimer');

    updateFarmingButtonText(); // Добавляем вызов функции
}

// Добавить в script.js
function getUserKey(key) {
    const userId = localStorage.getItem('tg_user_id') || 'guest';
    return `${userId}_${key}`;
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
    // Изменяем текст на "Забирайте бонус"
    const bonusText = document.querySelector('.daily-bonus div span:first-child');
    bonusText.textContent = 'Забирайте бонус';
    document.getElementById('bonusTimer').textContent = '00:00:00';
    claimButton.onclick = claimBonus;
}

function claimBonus() {
    const claimButton = document.querySelector('.claim-btn');
    claimButton.disabled = true;
    claimButton.textContent = 'Claim';
    localStorage.setItem('lastClaimTime', Date.now());
    
    // Возвращаем исходный текст
    const bonusText = document.querySelector('.daily-bonus div span:first-child');
    bonusText.textContent = 'Следующий клейм через:';

    // Остальной код функции без изменений
    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balance += 100;
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
            timerSpan.textContent = formatTime(Math.floor(remainingTime / 1000));
        }
    }, 1000);
}

// Форматирование времени (часы:минуты:секунды)
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


// Запуск таймера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    startDailyBonusTimer();
});

function updateBalanceDisplay() {
    let balance = parseFloat(localStorage.getItem('balance')) || 0;
    document.getElementById('balance').textContent = balance;
}

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateBalanceDisplay();
});