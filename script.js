let cart = [];

// Обработчик событий для кнопок "Добавить в корзину"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'), 10); // Преобразование в число
        cart.push({ name, price });
        updateCart();
        console.log(`Добавлен товар: ${name}, цена: ${price}`); // Отладочное сообщение
    });
});

// Обработчик событий для кнопки "Перейти к оплате"
document.getElementById('checkout').addEventListener('click', () => {
    const cartData = JSON.stringify(cart);
    console.log("Корзина:", cartData); // Отладочное сообщение

    // Отправка данных на сервер
    fetch('https://f4d5-195-19-120-238.ngrok-free.app/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: cartData
    })
        .then(response => {
            console.log("Ответ сервера:", response); // Отладочное сообщение
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Данные от сервера:", data); // Отладочное сообщение
            if (data.success) {
                console.log("Успешный ответ от сервера", data); // Отладочное сообщение
                window.location.href = `https://t.me/${data.chat}`;
            } else {
                alert('Ошибка при переходе к оплате');
            }
        })
        .catch(error => console.error('Ошибка:', error));
});

function updateCart() {
    const checkoutButton = document.getElementById('checkout');
    const itemCount = cart.length;
    checkoutButton.textContent = `Перейти к оплате (${itemCount})`;
    checkoutButton.style.display = 'block';
}
