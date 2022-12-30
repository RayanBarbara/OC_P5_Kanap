const letterRegExp = new RegExp(/^[a-zA-Z]+$/);
const emailRegExp = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
const addressRegExp = new RegExp(/^[A-Za-z0-9]*$/);
let orderButton = document.getElementById('order');
orderButton.disabled = true;

function displayCartProducts(productsList) {
  let cartDisplayZone = document.getElementById('cart__items');
  let productDisplay = document.createElement('article');
  if (localStorage.getItem('productsCart') === null) {
    productDisplay.innerHTML = `
    <article>
      <h1>Your cart is empty!</h1>
    </article>
    `;
    cartDisplayZone.appendChild(productDisplay);
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

function checkData() {
  let firstName = document.getElementById('firstName').value;
  let lastName = document.getElementById('lastName').value;
  let address = document.getElementById('address').value;
  let city = document.getElementById('city').value;
  let email = document.getElementById('email').value;
  if (localStorage.getItem('productsCart') !== null) {
    if (letterRegExp.test(firstName) && letterRegExp.test(lastName) && addressRegExp.test(address) && letterRegExp.test(city) && emailRegExp.test(email)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function createOrderCart() {
  let cart = JSON.parse(localStorage.getItem('productsCart'));
  let orderCart = [];
  for (let i = 0; i < cart.length; i++) {
    orderCart.push(cart[i].id);
  }
  return orderCart;
}

document.querySelectorAll('input').forEach((inputs) => {
  inputs.addEventListener('blur', () => {
    if (inputs.value.trim().length === 0) {
      document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'Please fill the field!';
      document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
    } else {
      document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
      if (letterRegExp.test(inputs.value) === false && inputs.id !== 'address' && inputs.id !== 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'Only letters are allowed in this field!';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
      } else if (letterRegExp.test(inputs.value) === true && inputs.id !== 'address' && inputs.id !== 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em green';
      }
      if (addressRegExp.test(inputs.value) === false && inputs.id === 'address') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'Only letters and numbers are allowed in this field!';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
      } else if (addressRegExp.test(inputs.value) === true && inputs.id === 'address') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em green';
      }
      if (emailRegExp.test(inputs.value) === false && inputs.id === 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'This email is invalid!';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
      } else if (emailRegExp.test(inputs.value) === true && inputs.id === 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em green';
      }
      if (checkData()) {
        orderButton.disabled = false;
      } else {
        orderButton.disabled = true;
      }
    }
  });
});

document.getElementById('order').addEventListener('click', ($event) => {
  $event.preventDefault();
  let order = {
    contact: {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      email: document.getElementById('email').value
    },
    products: createOrderCart()
  };
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order)
  })
    .then((response) => response.json())
    .then((order) => {
      console.log('Success ', order);
      window.location.href = `../html/confirmation.html?orderID=${order.orderId}`;
      localStorage.clear();
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
});

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