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

    fetch('https://ba54-195-19-120-244.ngrok-free.app/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: cartData
    })
        .then(response => {
            console.log("Server response:", response);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Server data:", data);
            if (data.success) {
                console.log("Successful server response", data);
                window.location.href = `https://t.me/${data.chat}`;
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
