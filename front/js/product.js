let productID = new URLSearchParams(window.location.search).get('id');

function getProductInformation() {
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
}

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

document.getElementById('addToCart').addEventListener('click', () => {
    let bool = false;
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
        for (let i = 0; i < localStorage.length; i++) {
            if (command.id.normalize() === JSON.parse(localStorage.getItem(i)).id.normalize() && command.color.normalize() === JSON.parse(localStorage.getItem(i)).color.normalize()) {
                command.quantity += +JSON.parse(localStorage.getItem(i)).quantity;
                localStorage.setItem(i, JSON.stringify(command));
                bool = false;
                break;
            } else {
                bool = true;
            }
        } if (bool) {
            localStorage.setItem(localStorage.length, JSON.stringify(command));
        }
    }
});

let command = {
    id: '0',
    color: 'Test',
    quantity: +"0"
};
localStorage.setItem(0, JSON.stringify(command));
getProductInformation();