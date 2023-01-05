// Function which display API products on the index page
function listAllProducts(productsList) {
  let productsDisplayArea = document.getElementById('items');
  // Loop trough the product list to get their data before displaying them on the index page
  for (product of productsList) {
    // Create an HTML element which will display the products information
    let productInformation = document.createElement('a');
    productInformation.innerHTML = `
      <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>`;
    // Add product information to their given display area
    productsDisplayArea.appendChild(productInformation);
  }
}

// GET from API all products data and use the `listAllProducts` function to display them
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((data) => {
    listAllProducts(data);
  })
  .catch((error) => {
    document.querySelector('h1').textContent = 'There is an error with the fetched products!';
    console.error('Error: ', error);
  });