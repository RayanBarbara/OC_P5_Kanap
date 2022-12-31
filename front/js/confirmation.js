// Fetch the order ID from the URL
let orderID = new URLSearchParams(window.location.search).get('orderID');

// Display the order ID on the confirmation page
document.getElementById('orderId').textContent = orderID;