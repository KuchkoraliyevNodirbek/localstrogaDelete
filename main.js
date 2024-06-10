

document.addEventListener('DOMContentLoaded', async () => {
    try {
        let data = [];


        const localData = localStorage.getItem('localData');
        if (localData) {

            data = JSON.parse(localData);
            renderData(data);
        } else {

            const response = await fetch('http://localhost:3600/photos');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            data = await response.json();
            renderData(data);
        }
    } catch (error) {
        console.error('Failed to fetch or render data:', error);
    }

    renderCartFromLocalStorage();
});

function renderData(data) {
    const dataContainer = document.getElementById('data-container');

    dataContainer.innerHTML = data.map(
        (item) => `
        <div class="item" data-id="${item.id}">
          <h1>${item.title}</h1>
          <img src="${item.url}" alt="${item.title}" />
          <button class="add-to-cart">Add to Cart</button>
        </div>`
    ).join('');

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function addToCart(event) {
    const itemDiv = event.target.parentNode;
    const itemId = itemDiv.dataset.id;
    const itemTitle = itemDiv.querySelector('h1').innerText;
    const itemUrl = itemDiv.querySelector('img').src;

    const item = {
        id: itemId,
        title: itemTitle,
        url: itemUrl
    };

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const isItemInCart = cartItems.some(cartItem => cartItem.id === itemId);

    if (!isItemInCart) {
        cartItems.push(item);

        localStorage.setItem('cart', JSON.stringify(cartItems));

        alert('Item added to cart!');
    } else {
        alert('This item is already in your cart!');
    }

    renderCartFromLocalStorage();
}

function renderCartFromLocalStorage() {
    const cartContainer = document.getElementById('cart-container');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartContainer.innerHTML = '';

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
        <h2>${item.title}</h2>
        <img src="${item.url}" alt="${item.title}" />
        <button class="remove-from-cart">Remove</button>
      `;
        cartContainer.appendChild(itemElement);

        const selectedItem = document.querySelector(`.item[data-id="${item.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    });

    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

function removeFromCart(event) {
    const itemDiv = event.target.parentNode;
    const itemId = itemDiv.dataset.id;

    itemDiv.remove();

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
}
