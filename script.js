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

    // Проверяем, есть ли элемент перед записью в него
    const usernameElem = document.getElementById('displayUsername');
    const balanceElem = document.getElementById('balance');
    const ticketsElem = document.getElementById('tickets');
    const farmingBalanceElem = document.getElementById('farmingBalance');
    const farmingTimerElem = document.getElementById('farmingTimer');
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


document.addEventListener('DOMContentLoaded', () => {
    checkDailyReward();
    checkTicketReset();
    showMain();
});

/**
 * Проверить и показать ежедневную награду
 */
function checkDailyReward() {
    const lastRewardDate = localStorage.getItem('lastRewardDate');
    const today = new Date().toDateString(); // Используем строковое представление даты для простоты сравнения

    if (lastRewardDate !== today) {
        showDailyReward();
        localStorage.setItem('lastRewardDate', today);
    }
}

/**
 * Показать окно с наградой
 */
function showDailyReward() {
    const rewardAmount = 5; // Количество билетов, которое мы дадим пользователю
    let tickets = parseInt(localStorage.getItem('tickets')) || 0;
    tickets += rewardAmount;
    localStorage.setItem('tickets', tickets);

    const rewardModal = document.createElement('div');
    rewardModal.classList.add('reward-modal');
    rewardModal.innerHTML = `
        <div class="reward-content">
            <span>Ежедневная награда!</span>
            <p>Вы получили ${rewardAmount} билетов!</p>
            <button id="closeRewardModal">Claim!</button>
        </div>
    `;
    document.body.appendChild(rewardModal);

    document.getElementById('closeRewardModal').addEventListener('click', () => {
        rewardModal.remove();
        document.getElementById('tickets').textContent = tickets;
    });
}
