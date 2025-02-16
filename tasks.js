function completeTask(task, buttonElement) {
    let balance = parseInt(localStorage.getItem('balance')) || 0;

    switch (task) {
        case 'telegram':
            balance += 100;
            alert('Thank you for subscribing to our Telegram channel! +100 coins');
            break;
        case 'instagram':
            balance += 200;
            alert('Thank you for following us on Instagram! +200 coins');
            break;
        case 'twitter':
            balance += 150;
            alert('Thank you for following us on Twitter! +150 coins');
            break;
    }

    localStorage.setItem('balance', balance);
    
    const balanceElem = document.getElementById('balance');
    if (balanceElem) {
        balanceElem.textContent = balance;
    }

    // Изменяем кнопку на галочку
    buttonElement.innerHTML = '✔';
    buttonElement.disabled = true;
    buttonElement.classList.add('completed'); // Добавляем класс, если нужно стилизовать галочку

    console.log(`Total balance: ${balance}`);
}
