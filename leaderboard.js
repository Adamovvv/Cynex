document.addEventListener('DOMContentLoaded', () => {
    const leaderboardData = [
        { id: 1, firstName: 'John', username: 'john123', score: 1000, avatar: 'avatar1.jpg' },
        { id: 2, firstName: 'Alice', username: 'alice456', score: 950, avatar: 'avatar2.jpg' },
        { id: 3, firstName: 'Bob', username: 'bob789', score: 900, avatar: 'avatar3.jpg' },
        // Add more players as needed
    ];

    renderLeaderboard(leaderboardData);
});

function renderLeaderboard(data) {
    const tbody = document.querySelector('.leaderboard-table tbody');
    tbody.innerHTML = '';

    data.sort((a, b) => b.score - a.score);

    data.forEach((player, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="${player.avatar}" alt="${player.firstName}" class="avatar-small">
                ${player.firstName || player.username}
            </td>
            <td>${player.score}</td>
        `;

        tbody.appendChild(row);
    });
}

const tg = window.Telegram.WebApp;
tg.expand();

if (tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    localStorage.setItem('tg_user_id', user.id);
    localStorage.setItem('tg_first_name', user.first_name);
    localStorage.setItem('tg_username', user.username);
    localStorage.setItem('tg_avatar', user.photo_url);
}