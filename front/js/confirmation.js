let orderID = new URLSearchParams(window.location.search).get('orderID');

document.getElementById('orderId').textContent = orderID;