function getCartProductsInformation() {
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let i = 1; i < localStorage.length; i++) {
        let product = JSON.parse(localStorage.getItem(i));
        let id = product.id;
        let productColor = product.color;
        let productQuantity = product.quantity;
        fetch('http://localhost:3000/api/products/' + id)
            .then((response) => response.json())
            .then((productData) => {
                productImgURL = productData.imageUrl;
                productAltText = productData.altTxt;
                productName = productData.name;
                productPrice = productData.price;
                totalPrice += productPrice*productQuantity;
                totalQuantity += productQuantity;
                displayCart(productImgURL, productAltText, productName, productColor, productPrice, productQuantity, totalQuantity, totalPrice);
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }
}

function displayCart(imageUrl, altTxt, name, color, price, quantity, totalQuantity, totalPrice) {
    let cartDisplayZone = document.getElementById('cart__items');
    let productDisplay = document.createElement('article');
    let totalQuantityDisplayZone = document.getElementById('totalQuantity');
    let totalPriceDisplayZone = document.getElementById('totalPrice');
    totalQuantityDisplayZone.innerHTML = `
    <span id="totalQuantity">${totalQuantity}</span>
    `;
    totalPriceDisplayZone.innerHTML = `
    <span id="totalPrice">${totalPrice}</span>
    `;
    productDisplay.innerHTML = `
    <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="${imageUrl}" alt="${altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${name}</h2>
                    <p>${color}</p>
                    <p>${price}$</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Quantity : ${quantity}</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="1">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Delete</p>
                    </div>
                  </div>
                </div>
              </article>
    `;
    cartDisplayZone.appendChild(productDisplay);
}

getCartProductsInformation();