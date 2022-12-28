function displayCartProducts(productsList) {
  let cartDisplayZone = document.getElementById('cart__items');
  let productDisplay = document.createElement('article');
  if (localStorage.getItem('productsCart') === null) {
    productDisplay.innerHTML = `
    <article>
      <h1>Your cart is empty!</h1>
    </article>
    `;
  } else {
    let cart = JSON.parse(localStorage.getItem('productsCart'));
    for (let i = 0; i < cart.length; i++) {
      for (product of productsList) {
        let cartProductID = cart[i].id;
        let productID = product._id;
        if (productID === cartProductID) {
          productDisplay.innerHTML += `
              <article class="cart__item" data-id="${productID}" data-color="${cart[i].color}" data-quantity="${cart[i].quantity}" data-price="${product.price}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${cart[i].color}</p>
                    <p>${product.price}$</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Quantity :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" data-id="${productID}" data-color="${cart[i].color}">Delete</p>
                    </div>
                  </div>
                </div>
              </article>
              `;
          cartDisplayZone.appendChild(productDisplay);
        }
      }
    }
  }
}

function productsTotal() {
  let totalPrice = 0;
  let totalQuantity = 0;
  const cartProduct = document.querySelectorAll('.cart__item');
  cartProduct.forEach((cartProduct) => {
    totalQuantity += +cartProduct.dataset.quantity;
    totalPrice += +cartProduct.dataset.price * +cartProduct.dataset.quantity;
  });
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalPrice').textContent = totalPrice;
}

function quantityChange() {
  const cartProduct = document.querySelectorAll('.cart__item');
  cartProduct.forEach((cartProduct) => {
    cartProduct.addEventListener('change', ($event) => {
      let cart = JSON.parse(localStorage.getItem('productsCart'));
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === cartProduct.dataset.id && cart[i].color === cartProduct.dataset.color) {
          let command = {
            id: cart[i].id,
            color: cart[i].color,
            quantity: +$event.target.value
          };
          cart[i] = command;
          localStorage.setItem('productsCart', JSON.stringify(cart));
          cartProduct.dataset.quantity = command.quantity;
        }
      }
      productsTotal();
    });
  });
}

function deleteProduct() {
  const deleteButton = document.querySelectorAll('.cart__item .deleteItem');
  deleteButton.forEach((deleteButton) => {
    deleteButton.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('productsCart'));
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === deleteButton.dataset.id && cart[i].color === deleteButton.dataset.color) {
          cart.splice(i, 1);
          localStorage.setItem('productsCart', JSON.stringify(cart));
        }
      }
      location.reload();
    });
  });
}

fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((data) => {
    displayCartProducts(data);
    productsTotal();
    quantityChange();
    deleteProduct();
  })
  .catch((error) => {
    console.error('Error: ', error);
  });