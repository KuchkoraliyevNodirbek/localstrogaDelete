// main.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        let data = []; // Initialize data array

        // Check if data exists in localStorage
        const localData = localStorage.getItem('localData');
        if (localData) {
            // If local data exists, parse and assign it to the data array
            data = JSON.parse(localData);
            renderData(data); // Render local data
        } else {
            // If local data doesn't exist, fetch data from the server
            const response = await fetch('http://localhost:3600/photos'); // Replace with your actual URL
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            data = await response.json();
            renderData(data); // Render fetched data
        }
    } catch (error) {
        console.error('Failed to fetch or render data:', error);
    }

    renderCartFromLocalStorage(); // Render cart items from localStorage
});

// Function to render data
function renderData(data) {
    // Select the container where the data will be rendered
    const dataContainer = document.getElementById('data-container');

    // Render data in the container
    dataContainer.innerHTML = data.map(
        (item) => `
        <div class="item" data-id="${item.id}">
          <h1>${item.title}</h1>
          <img src="${item.url}" alt="${item.title}" />
          <button class="add-to-cart">Add to Cart</button>
        </div>`
    ).join('');

    // Add event listener to each "Add to Cart" button
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Function to handle "Add to Cart" button click
function addToCart(event) {
    const itemDiv = event.target.parentNode;
    const itemId = itemDiv.dataset.id;
    const itemTitle = itemDiv.querySelector('h1').innerText;
    const itemUrl = itemDiv.querySelector('img').src;

    // Create an object for the item
    const item = {
        id: itemId,
        title: itemTitle,
        url: itemUrl
    };

    // Retrieve existing cart items from localStorage or initialize an empty array
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item is already in the cart
    const isItemInCart = cartItems.some(cartItem => cartItem.id === itemId);

    if (!isItemInCart) {
        // Add the current item to the cart
        cartItems.push(item);

        // Save the updated cart items back to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Provide feedback to the user that the item has been added to the cart
        alert('Item added to cart!');
    } else {
        // Provide feedback that the item is already in the cart
        alert('This item is already in your cart!');
    }

    renderCartFromLocalStorage(); // Re-render cart items
}

// Function to render cart items from localStorage
function renderCartFromLocalStorage() {
    const cartContainer = document.getElementById('cart-container');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Clear previous content
    cartContainer.innerHTML = '';

    // Render cart items
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.dataset.id = item.id; // Add dataset id to match with data-id
        itemElement.innerHTML = `
        <h2>${item.title}</h2>
        <img src="${item.url}" alt="${item.title}" />
        <button class="remove-from-cart">Remove</button>
      `;
        cartContainer.appendChild(itemElement);

        // Highlight the selected item in the main data container
        const selectedItem = document.querySelector(`.item[data-id="${item.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    });

    // Add event listener to each "Remove" button in the cart
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Function to handle "Remove" button click
function removeFromCart(event) {
    const itemDiv = event.target.parentNode;
    const itemId = itemDiv.dataset.id;

    // Remove the item from the DOM
    itemDiv.remove();

    // Remove the item from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
}
