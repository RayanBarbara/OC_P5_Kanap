// Fetch the product ID from the URL
let productID = new URLSearchParams(window.location.search).get('id');

// Function which display the information of a product
function displayProducts(imgURL, altTxt, name, price, description, colors) {
    let productImgURL = document.querySelector('.item__img');
    let productName = document.getElementById('title');
    let productPrice = document.getElementById('price');
    let productDescription = document.getElementById('description');
    let productColor = document.getElementById('colors');
    productImgURL.innerHTML = `
    <div id="item__img">
        <img id='item__image' src="${imgURL}" alt="${altTxt}">
    </div>`;
    productName.textContent = name;
    productPrice.textContent = price;
    productDescription.textContent = description;
    // List all colors of the product on the select HTML tag
    for (color in colors) {
        let colorOption = document.createElement('option');
        colorOption.innerHTML = `
        <option value="${colors[color]}">${colors[color]}</option>`;
        productColor.appendChild(colorOption);
    }
}

// To simplify things, the product which want to be added in the cart will be name `A`


// Function which check if an identical product (ID and color) to `A` isn't already in the cart
// If yes: The quantity of both products will be added together and `A` won't be added to the array
// If not: `A` will just be added at the end of the cart array
function arrayPusher(newCommandEntry) {
    let bool = true;
    let oldProductsCart = JSON.parse(localStorage.getItem('productsCart'));
    // Loop trough the entire cart to compare each products with `A`
    for (let i = 0; i < oldProductsCart.length; i++) {
        let productID = oldProductsCart[i].id;
        // Check if `A` and another product in the cart don't have the same ID
        if (newCommandEntry.id === productID) {
            let productColor = oldProductsCart[i].color;
            let productQuantity = oldProductsCart[i].quantity + newCommandEntry.quantity;
            // Check if these two products with the same ID have the same color and if summing their quantity won't go beyond the limit of 100 per type of product
            if (newCommandEntry.color === productColor && productQuantity <= 100) {
                // Sum the `A` quantity to the cart product quantity
                let command = {
                    id: productID,
                    color: productColor,
                    quantity: productQuantity
                };
                oldProductsCart[i] = command;
                localStorage.setItem('productsCart', JSON.stringify(oldProductsCart));
                bool = false;
                // Alert that the limit quantity of 100 per type has been surpassed
            } else if (newCommandEntry.color === productColor && productQuantity > 100) {
                bool = false;
                alert('Only a maximum quantity of one hundred per type of products is allowed!');
            }
        }
    }
    // There is no identical product to `A` in the cart, so `A` will just be added to the cart
    if (bool) {
        oldProductsCart.push(newCommandEntry);
        localStorage.setItem('productsCart', JSON.stringify(oldProductsCart))
    }
}

// Event listener which reacts to the click of `Add to cart` button
document.getElementById('addToCart').addEventListener('click', () => {
    let command = {
        id: productID,
        color: document.getElementById('colors').value,
        quantity: +document.getElementById('quantity').value
    };
    // Check if a color and the quantity of a product has been properly selected
    if (command.quantity === 0 && command.color === '') {
        alert('Please select the color and quantity!');
    } else if (command.color === '') {
        alert('Please select the color!');
    } else if (command.quantity === 0) {
        alert('Please select the quantity!');
    }
    // Check if the cart array located to the local storage exist or not
    else {
        // If not: Create an empty cart array
        if (localStorage.getItem('productsCart') === null) {
            localStorage.setItem('productsCart', JSON.stringify([]));
        }
        // Function which check the products inside the cart and `A` to determine how `A` will be added in the cart
        arrayPusher(command);
        location.reload();
    }
});

// GET from API all the information of the product
fetch('http://localhost:3000/api/products/' + productID)
    .then((response) => response.json())
    .then((data) => {
        let productImgURL = data.imageUrl;
        let productAltText = data.altTxt;
        let productName = data.name;
        let productPrice = data.price;
        let productDescription = data.description;
        let productColor = data.colors;
        displayProducts(productImgURL, productAltText, productName, productPrice, productDescription, productColor);
    })
    .catch((error) => {
        document.querySelector('h1').textContent = 'There is an error with the fetched products!';
        console.error('Error: ', error);
    });