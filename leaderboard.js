document.addEventListener('DOMContentLoaded', () => {
    // Получаем данные пользователя из localStorage
    const user = {
        id: localStorage.getItem('tg_user_id'),
        firstName: localStorage.getItem('tg_first_name'),
        username: localStorage.getItem('tg_username'),
        avatar: localStorage.getItem('tg_avatar'),
        score: Math.floor(Math.random() * 1000) // Здесь можно заменить на реальные данные
    };

    let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Если пользователя нет в списке, добавляем его
    if (!leaderboardData.some(p => p.id === user.id)) {
        leaderboardData.push(user);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
    }

    renderLeaderboard(leaderboardData);
});

function renderLeaderboard(data) {
    const tbody = document.querySelector('.leaderboard-table tbody');
    tbody.innerHTML = '';

    // Сортируем по убыванию очков
    data.sort((a, b) => b.score - a.score);

    data.forEach((player, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="${player.avatar || 'images/default_avatar.png'}" alt="${player.firstName}" class="avatar-small">
                ${player.firstName || player.username}
            </td>
            <td>${player.score}</td>
        `;

        tbody.appendChild(row);
    });

    // Обновляем топ-3 игроков
    updateTopThree(data);
}

function updateTopThree(data) {
    const topPlayers = data.slice(0, 3);
    const positions = ['first', 'second', 'third'];

    topPlayers.forEach((player, index) => {
        const playerCard = document.querySelector(`.player-card.${positions[index]}`);
        if (playerCard) {
            playerCard.querySelector('.avatar').src = player.avatar || 'images/default_avatar.png';
            playerCard.querySelector('.name').textContent = player.firstName || player.username;
            playerCard.querySelector('.score').textContent = player.score;
        }
    });
}
