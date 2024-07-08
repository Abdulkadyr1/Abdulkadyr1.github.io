let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        cart.push({ name, price });
        updateCart();
    });
});

document.getElementById('checkout').addEventListener('click', () => {
    const cartData = JSON.stringify(cart);
    // Отправка данных в телеграм-бота
    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: cartData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
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
