function getProductInformation() {
    let productID = new URLSearchParams(window.location.search).get('id');
    fetch('http://localhost:3000/api/products/' +productID)
        .then((response) => response.json())
        .then((data) => {
            //console.table(data);
            let productImgURL = data.imageUrl;
            //console.log(productImgURL);
            let productAltText = data.altTxt;
            //console.log(productAltText);
            let productName = data.name;
            //console.log(productName);
            let productPrice = data.price;
            //console.log(productPrice);
            let productDescription = data.description;
            //console.log(productDescription);
            let productColor = data.colors;
            //console.log(productColor);
            displayProducts(productImgURL, productAltText, productName, 
                productPrice, productDescription, productColor);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function displayProducts(imgURL, altTxt, name, price, description, colors){
    let productImgURL = document.querySelector('.item__img');
    let productName = document.getElementById('title');
    let productPrice = document.getElementById('price');
    let productDescription = document.getElementById('description');
    let productColor = document.getElementById('colors');
    productImgURL.innerHTML =`
    <div id="item__img">
        <img id='item__image' src="${imgURL}" alt="${altTxt}">
    </div>`;
    productName.textContent = name;
    productPrice.textContent = price;
    productDescription.textContent = description;
    for(color in colors){
        let colorOption = document.createElement('option');
        colorOption.innerHTML = `
        <option value="${colors[color]}">${colors[color]}</option>`;
        productColor.appendChild(colorOption);
    }
}

getProductInformation();