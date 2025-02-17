async function checkTelegramSubscription(channelUsername) {
    const userId = localStorage.getItem('tg_user_id');

    if (!userId) {
        alert('Ошибка: Не удалось получить ваш Telegram ID.');
        return false;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot7592623127:AAHCOaKyK_QNROxZMeF7woi5mz1Nae-Ouc4/getChatMember?chat_id=@${channelUsername}&user_id=${userId}`);
        const data = await response.json();

        if (data.ok && ['member', 'administrator', 'creator'].includes(data.result.status)) {
            return true; // Пользователь подписан
        } else {
            return false; // Не подписан
        }
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        return false;
    }
}

// Функция для выполнения задания
async function completeTask(task, buttonElement) {
    let balance = parseInt(localStorage.getItem('balance')) || 0;

    if (task === 'telegram') {
        const channelUsername = 'FarmTycoon'; // Укажи здесь свой канал
        window.Telegram.WebApp.openTelegramLink(`https://t.me/${channelUsername}`);

        setTimeout(async () => {
            const isSubscribed = await checkTelegramSubscription(channelUsername);
            if (isSubscribed) {
                balance += 100;
                localStorage.setItem('balance', balance);
                document.getElementById('balance').textContent = balance;
                alert('Спасибо за подписку! +100 монет начислено.');
                buttonElement.innerHTML = '✔';
                buttonElement.disabled = true;
                buttonElement.classList.add('completed');
            } else {
                alert('Вы не подписаны на канал! Подпишитесь и повторите попытку.');
            }
        }, 5000);
    } else {
        switch (task) {
            case 'instagram':
                balance += 200;
                alert('Спасибо за подписку в Instagram! +200 монет начислено.');
                break;
            case 'twitter':
                balance += 150;
                alert('Спасибо за подписку в Twitter! +150 монет начислено.');
                break;
        }
        localStorage.setItem('balance', balance);
        document.getElementById('balance').textContent = balance;
        buttonElement.innerHTML = '✔';
        buttonElement.disabled = true;
        buttonElement.classList.add('completed');
    }
}
