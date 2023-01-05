// Regular expression which limit characters to letters
const letterRegExp = new RegExp(/^[a-zA-Z\s]*$/);

// Regular expression which check if an email is valid or not
const emailRegExp = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

// Regular expression which limit characters to letter and numbers
const addressRegExp = new RegExp(/^[a-zA-Z0-9 ]*$/);

// Disable order button from contact form until all condition are met
let orderButton = document.getElementById('order');
orderButton.disabled = true;

// Function which display the cart's content
function displayCartProducts(productsList) {
  let cartDisplayZone = document.getElementById('cart__items');
  let productDisplay = document.createElement('article');
  // Check if the cart is empty
  if (localStorage.getItem('productsCart') === null) {
    productDisplay.innerHTML = `
    <article>
      <h1>Your cart is empty!</h1>
    </article>
    `;
    cartDisplayZone.appendChild(productDisplay);
  } else {
    let cart = JSON.parse(localStorage.getItem('productsCart'));
    // Loop trough the cart and display all the cart's products information (name, price, color and quantity)
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

//Function which calculate the total quantity and total price of all cart's products
function productsTotal() {
  let totalPrice = 0;
  let totalQuantity = 0;
  const cartProduct = document.querySelectorAll('.cart__item');
  // Fetch from each cart's products displayed the quantity and price before summing them to their respective total amount
  cartProduct.forEach((cartProduct) => {
    totalQuantity += +cartProduct.dataset.quantity;
    totalPrice += +cartProduct.dataset.price * +cartProduct.dataset.quantity;
  });
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalPrice').textContent = totalPrice;
}

// Function dealing with the change of quantity of a cart's product display by synchronizing their quantity with the cart array
function quantityChange() {
  const cartProduct = document.querySelectorAll('.cart__item');
  // Check at all time and for all cart's products display if the quantity has changed
  cartProduct.forEach((cartProduct) => {
    cartProduct.addEventListener('change', ($event) => {
      let cart = JSON.parse(localStorage.getItem('productsCart'));
      // Loop trough the cart array to find the product corresponding to the cart's product display which quantity has changed
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === cartProduct.dataset.id && cart[i].color === cartProduct.dataset.color) {
          // Adjust the quantity of the product in the cart array updating the cart array located in the local storage
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
      // Re-calculate the total quantity and price of all cart's products
      productsTotal();
    });
  });
}

// Function dealing with the deletion of a cart's product
function deleteProduct() {
  const deleteButton = document.querySelectorAll('.cart__item .deleteItem');
  // Check at all time and for all the cart's product display if the `delete button` has been clicked on
  deleteButton.forEach((deleteButton) => {
    deleteButton.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('productsCart'));
      // Loop trough the cart array to find the product corresponding to the display which the `delete button` has been clicked on
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === deleteButton.dataset.id && cart[i].color === deleteButton.dataset.color) {
          // Delete the said product from the cart before updating the cart array located in the local storage
          cart.splice(i, 1);
          localStorage.setItem('productsCart', JSON.stringify(cart));
        }
      }
      location.reload();
    });
  });
}

// Function checking if all the input of the contact form respect their Regular Expression
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

// Function creating an array containing the cart's products' ID
function createOrderCart() {
  let cart = JSON.parse(localStorage.getItem('productsCart'));
  let orderCart = [];
  for (let i = 0; i < cart.length; i++) {
    orderCart.push(cart[i].id);
  }
  return orderCart;
}

// Check at all times and for all contact form inputs if they have been updated
document.querySelectorAll('input').forEach((inputs) => {
  inputs.addEventListener('blur', () => {
    // Check if the inputs are empty and remind the user if the field is empty
    if (inputs.value.trim().length === 0) {
      document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'Please fill the field!';
      document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
    } else {
      document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
      // Check if the city, first and last name don't use other things than letter and remind the user if the input is incorrect
      if (letterRegExp.test(inputs.value) === false && inputs.id !== 'address' && inputs.id !== 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'Only letters are allowed in this field!';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
      } else if (letterRegExp.test(inputs.value) === true && inputs.id !== 'address' && inputs.id !== 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em green';
      }
      // Check if the address is only composed of letter and number and remind the user if the input is incorrect
      if (addressRegExp.test(inputs.value) === false && inputs.id === 'address') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'Only letters and numbers are allowed in this field!';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
      } else if (addressRegExp.test(inputs.value) === true && inputs.id === 'address') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em green';
      }
      // Check if the email is valid or not and remind the user if the input is incorrect
      if (emailRegExp.test(inputs.value) === false && inputs.id === 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = 'This email is invalid!';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em red';
      } else if (emailRegExp.test(inputs.value) === true && inputs.id === 'email') {
        document.getElementById(inputs.id + 'ErrorMsg').innerHTML = '';
        document.getElementById(inputs.id).style.boxShadow = '0 0 0.5em green';
      }
      // Check if the data inserted are valid or not and correspondingly update the disabled state of the `Order`button
      if (checkData()) {
        orderButton.disabled = false;
      } else {
        orderButton.disabled = true;
      }
    }
  });
});

// Check if the `Order` has been clicked on
document.getElementById('order').addEventListener('click', ($event) => {
  $event.preventDefault();
  // Create order element
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
  // POST an order containing the cart and the checked contact data of the user
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order)
  })
    .then((response) => response.json())
    .then((order) => {
      // Re-locate the user to the confirmation page to get its order ID
      window.location.href = `../html/confirmation.html?orderID=${order.orderId}`;
      localStorage.clear();
    })
    .catch((error) => {
      document.querySelector('h1').textContent = 'There is an error with the order!';
      console.error('Error: ', error);
    });
});

//GET from API all products data before displaying those located in the cart and dealing with their modification/deletion
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((data) => {
    displayCartProducts(data);
    productsTotal();
    quantityChange();
    deleteProduct();
  })
  .catch((error) => {
    document.querySelector('h1').textContent = 'There is an error with the fetched products!';
    console.error('Error: ', error);
  });