import { menuArray } from "/data.js";

const menu = document.getElementById("menu");
const order = document.getElementById("order");
const form = document.getElementById("payment-form");
const modal = document.getElementById("modal");
const orderBtn = document.getElementById("order-btn");

let cart = [];

menu.addEventListener("click", function (e) {
  if (e.target.classList.contains("menu-btn")) {
    const itemId = Number(e.target.dataset.itemId);
    addToOrder(itemId);
  }
});

order.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const itemId = Number(e.target.dataset.itemId);
    cart = cart.filter((id) => id !== itemId);
    render();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  modal.classList.add("hidden");
  cart = [];
  showSuccessPage();
});

orderBtn.addEventListener("click", function () {
  modal.classList.remove("hidden");
});

function showSuccessPage() {
  const paymentFormData = new FormData(form);
  const name = paymentFormData.get("name");
  document.getElementById("order-inner").innerHTML =
    `<h2 class="thank-you-msg">Thanks ${name}! Your order is on its way!</h2>`;
}

function addToOrder(itemId) {
  if (cart.includes(itemId)) {
    return;
  }
  cart.push(itemId);

  if (cart.length > 0) {
    order.classList.remove("hidden");
  }

  render();
}

function getOrderHtml() {
  if (cart.length === 0) {
    return "<p>What would you like to have? 🍔</p>";
  }

  // 1. 生成訂單列表 HTML
  const orderItemsHtml = cart
    .map((itemId) => {
      const item = menuArray.find((menuItem) => menuItem.id === itemId);
      if (!item) return "";

      return `
        <div class="order-item">
            <h3>${item.emoji} ${item.name}</h3>
            <button class="remove-btn" data-item-id="${item.id}">remove</button>
            <p class="item-price">$${item.price}</p>
        </div>
    `;
    })
    .join("");

  const totalPrice = cart.reduce((total, itemId) => {
    const item = menuArray.find((menuItem) => menuItem.id === itemId);
    return item ? total + item.price : total;
  }, 0);

  // 有嘢食先加總金額
  return `
            <div class="cart-total">
                <strong>Total Price:</strong>
                <span>$${totalPrice.toFixed(2)}</span>
            </div>
        `;
}

function getMenuHtml() {
  return menuArray
    .map(function (menuItem) {
      return `
<div class="menu-item">
        <div class="item-emoji">${menuItem.emoji}</div>
        <div>
            <h2 class="name">${menuItem.name}</h2>
            <p class="ingredients">${menuItem.ingredients.join(", ")}</p>
            <p>$${menuItem.price}</p>
        </div>            
        <button class="menu-btn" data-item-id="${menuItem.id}">+</button>
</div>
        `;
    })
    .join("");
}

function render() {
  menu.innerHTML = getMenuHtml();
  document.getElementById("order-inner").innerHTML = getOrderHtml();
}

render();
