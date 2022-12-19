fetch('http://localhost:3000/api/products')
.then((response) => response.json())
.then((data) => {
    //console.table(data);
    listAllProducts(data);
})
.catch((error) => {
    console.error('Error:', error);
});

function listAllProducts(productsList){
    let productsDisplayZone = document.getElementById('items');
    for(product of productsList){
        let productInformation = document.createElement('a');
        productInformation.innerHTML = `
        <a href="./product.html?id=${product._id}">
          <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
          </article>
        </a>`;
      productsDisplayZone.appendChild(productInformation);
    }
}