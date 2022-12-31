let productID = new URLSearchParams(window.location.search).get('id');

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
    for (color in colors) {
        let colorOption = document.createElement('option');
        colorOption.innerHTML = `
        <option value="${colors[color]}">${colors[color]}</option>`;
        productColor.appendChild(colorOption);
    }
}

function arrayPusher(newCommandEntry) {
    let bool = true;
    let oldProductsCart = JSON.parse(localStorage.getItem('productsCart'));
    for (let i = 0; i < oldProductsCart.length; i++) {
        let productID = oldProductsCart[i].id;
        if (newCommandEntry.id === productID) {
            let productColor = oldProductsCart[i].color;
            let productQuantity = oldProductsCart[i].quantity + newCommandEntry.quantity;
            if (newCommandEntry.color === productColor && productQuantity <= 100) {
                let command = {
                    id: productID,
                    color: productColor,
                    quantity: productQuantity
                };
                oldProductsCart[i] = command;
                localStorage.setItem('productsCart', JSON.stringify(oldProductsCart));
                bool = false;
            }else if(newCommandEntry.color === productColor && productQuantity > 100){
                bool = false;
                alert('Only a maximum quantity of one hundred per type of products is allowed!');
            }
        }
    }
    if (bool) {
        oldProductsCart.push(newCommandEntry);
        localStorage.setItem('productsCart', JSON.stringify(oldProductsCart))
    }
}

document.getElementById('addToCart').addEventListener('click', () => {
    let command = {
        id: productID,
        color: document.getElementById('colors').value,
        quantity: +document.getElementById('quantity').value
    };
    if (command.quantity === 0 && command.color === '') {
        alert('Please select the color and quantity!');
    } else if (command.color === '') {
        alert('Please select the color!');
    } else if (command.quantity === 0) {
        alert('Please select the quantity!');
    }
    else {
        if (localStorage.getItem('productsCart') === null) {
            localStorage.setItem('productsCart', JSON.stringify([]));
        }
        arrayPusher(command);
        location.reload();
    }
});

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
        console.error('Error: ', error);
    });