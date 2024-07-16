let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'), 10);
        cart.push({ name, price });
        updateCart();
        console.log(`Added to cart: ${name}, Price: ${price}`);
    });
});

document.getElementById('checkout').addEventListener('click', () => {
    fetch('https://6a86-185-244-20-32.ngrok-free.app/createOrderID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`HTTP error: ${response.status}`);
        }
    })
    .then(data => {
        if (data.order_id) {
            const orderData = {
                order_id: data.order_id,
                cart: cart
            };

            return fetch('https://6a86-185-244-20-32.ngrok-free.app/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
        } else {
            throw new Error('Failed to create OrderID');
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`HTTP error: ${response.status}`);
        }
    })
    .then(data => {
        if (data.success) {
            document.body.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5dc;">
                    <h1 style="color: #a0522d; font-family: 'Arial', sans-serif; font-size: 1.5em; text-align: center;">
                        Заказ уже оформляется, переходите в чат с ботом для продолжения
                    </h1>
                </div>`;
        } else {
            alert('Ошибка при оформлении заказа');
        }
    })
    .catch(error => console.error('Ошибка:', error));
});

function updateCart() {
    const checkoutButton = document.getElementById('checkout');
    const itemCount = cart.length;
    checkoutButton.textContent = `Перейти к оплате (${itemCount})`;

    if (itemCount > 0) {
        checkoutButton.style.display = 'block';
        checkoutButton.scrollIntoView({ behavior: 'smooth' });
    } else {
        checkoutButton.style.display = 'none';
    }
}
