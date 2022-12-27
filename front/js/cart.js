function getCartProductsInformation() {
  let cartDisplayZone = document.getElementById('cart__items');
  cartDisplayZone.innerHTML = ``;
  for (let j = 1; j < localStorage.length; j++) {
    let productID = JSON.parse(localStorage.getItem(j)).id;
    let productColor = JSON.parse(localStorage.getItem(j)).color;
    let productQuantity = JSON.parse(localStorage.getItem(j)).quantity;
    fetch('http://localhost:3000/api/products/' + productID)
      .then((response) => response.json())
      .then((productData) => {
        productImgURL = productData.imageUrl;
        productAltText = productData.altTxt;
        productName = productData.name;
        productPrice = productData.price;
        displayCartProducts(productID, productImgURL, productAltText, productName, productColor, productPrice, productQuantity);
        console.log(j);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  }
  console.log('After for loop!');
  console.log('Timeout B!');
  setTimeout(() => {
    productsTotal();
    quantityChange();
    deleteProduct();
    console.log('Timeout E!');
  }, 2000);
}

function displayCartProducts(id, imageUrl, altTxt, name, color, price, quantity) {
  let cartDisplayZone = document.getElementById('cart__items');
  let productDisplay = document.createElement('article');
  productDisplay.innerHTML = `
    <article class="cart__item" data-id="${id}" data-color="${color}" data-quantity="${quantity}" data-price="${price}">
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
                      <p>Quantity :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" data-id="${id}" data-color="${color}">Delete</p>
                    </div>
                  </div>
                </div>
              </article>
    `;
  cartDisplayZone.appendChild(productDisplay);
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
      for (let i = 1; i < localStorage.length; i++) {
        let id = JSON.parse(localStorage.getItem(i)).id;
        let color = JSON.parse(localStorage.getItem(i)).color;
        if (id === cartProduct.dataset.id && color === cartProduct.dataset.color) {
          let command = {
            id: id,
            color: color,
            quantity: $event.target.value
          };
          localStorage.setItem(i, JSON.stringify(command));
          console.log(JSON.parse(localStorage.getItem(i)));
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
      for (let i = 1; i < localStorage.length; i++) {
        let productID = JSON.parse(localStorage.getItem(i)).id;
        let productColor = JSON.parse(localStorage.getItem(i)).color;
        if (productID === deleteButton.dataset.id && productColor === deleteButton.dataset.color) {
          console.log(i);
          localStorage.removeItem(i);
          changeKeyForStorageItem(i);
        }
      }
      getCartProductsInformation();
    });
  });
}

function changeKeyForStorageItem(oldKey) {
  if (oldKey < localStorage.length) {
    for (let i = oldKey + 1; i <= localStorage.length; i++) {
      let nextProductID = JSON.parse(localStorage.getItem(i)).id;
      let nextProductColor = JSON.parse(localStorage.getItem(i)).color;
      let nextProductQuantity = JSON.parse(localStorage.getItem(i)).quantity;
      let command = {
        id: nextProductID,
        color: nextProductColor,
        quantity: nextProductQuantity
      };
      localStorage.setItem(i-1, JSON.stringify(command));
    }
    localStorage.removeItem(localStorage.length);
  }
}

getCartProductsInformation();