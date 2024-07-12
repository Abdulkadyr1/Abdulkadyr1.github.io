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
    const cartData = JSON.stringify({ cart: cart });
    console.log("Cart data to be sent:", cartData);

    // Сначала получаем orderID
    fetch('https://1710-185-244-20-32.ngrok-free.app/create_order')
        .then(response => {
            console.log("OrderID response status:", response.status);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        })
        .then(orderData => {
            console.log("Received orderID:", orderData.order_id);
            const checkoutData = JSON.stringify({
                order_id: orderData.order_id,
                cart: cart
            });
            
            // Затем отправляем данные корзины вместе с orderID на сервер
            return fetch('https://1710-185-244-20-32.ngrok-free.app/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: checkoutData
            });
        })
        .then(response => {
            console.log("Server response status:", response.status);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        })
        .then(data => {
            console.log("Server data:", data);
            if (data.success) {
                console.log("Successful server response", data);
                document.body.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5dc;">
                        <h1 style="color: #a0522d; font-family: 'Arial', sans-serif; font-size: 1.5em; text-align: center;">
                            Заказ уже оформляется, переходите в чат с ботом для продолжения
                        </h1>
                    </div>`;
            } else {
                alert('Error during checkout');
            }
        })
        .catch(error => console.error('Error:', error));
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
