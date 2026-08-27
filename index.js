import { menuArray } from "/data.js";

const menu = document.getElementById("menu");
const order = document.getElementById("order");
const form = document.getElementById("payment-form");
const modal = document.getElementById("modal");
const orderBtn = document.getElementById("order-btn");
const closeBtn = document.getElementById("close-btn");
const thankYouMsg = document.getElementById("thank-you-msg");
const orderDetails = document.getElementById("order-details");

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
    const targetItem = cart.find((item) => item.id === itemId);

    if (targetItem) {
      // ❓ FILL IN THE CONDITION: Check if quantity is greater than 1
      if (targetItem.quantity > 1) {
        targetItem.quantity--;
      } else {
        cart = cart.filter((item) => item.id !== itemId);
      }
      render();
    }
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  modal.classList.add("hidden");
  cart = [];
  form.reset();
  showSuccessPage();
});

orderBtn.addEventListener("click", function () {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
});

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

function showSuccessPage() {
  const paymentFormData = new FormData(form);
  const name = paymentFormData.get("name");
  orderDetails.classList.add("hidden");
  thankYouMsg.innerHTML = `<h2 class="thank-you-msg">Thanks ${name}! Your order is on its way!</h2>`;
  thankYouMsg.classList.remove("hidden");
}

function addToOrder(itemId) {
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: itemId, quantity: 1 });
  }

  render();
  orderDetails.classList.remove("hidden");
  thankYouMsg.classList.add("hidden");
}

function getOrderHtml() {
  if (cart.length === 0) {
    return "<p>What would you like to have? 🍔</p>";
  }

  // 1. 生成訂單列表 HTML
  const orderItemsHtml = cart
    .map((cartItem) => {
      const item = menuArray.find((menuItem) => menuItem.id === cartItem.id);
      if (!item) return "";

      return `
        <div class="order-item">
            <h3>${item.emoji} ${item.name} x ${cartItem.quantity}</h3>
            <button class="remove-btn" data-item-id="${item.id}">remove</button>
            <p class="item-price">$${item.price}</p>
        </div>
    `;
    })
    .join("");

  const totalPrice = cart.reduce((total, cartItem) => {
    const item = menuArray.find((menuItem) => menuItem.id === cartItem.id);
    return item ? total + cartItem.quantity * item.price : total;
  }, 0);

  // 第二步：將算好嘅 totalPrice 放入 HTML 樣板
  return `
    ${orderItemsHtml}
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

  if (cart.length === 0) {
    order.classList.add("hidden");
  } else {
    order.classList.remove("hidden");
  }
}

render();
