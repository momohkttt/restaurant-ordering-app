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
  // 1. 抓取被點擊元素的 data-action 同 data-item-id
  const action = e.target.dataset.action;
  const itemId = Number(e.target.dataset.itemId);

  // 如果點擊嘅位置冇 data-action（例如點到空白處或食物名），直接結束
  if (!action) return;

  // 2. 喺 cart 入面尋找對應嘅商品
  const targetItem = cart.find((item) => item.id === itemId);

  if (targetItem) {
    if (action === "increase") {
      targetItem.quantity++;
    } else if (action === "decrease") {
      if (targetItem.quantity > 1) {
        targetItem.quantity--;
      } else {
        cart = cart.filter((item) => item.id !== itemId);
      }
    } else if (action === "delete") {
      cart = cart.filter((item) => item.id !== itemId);
    }

    // 3. 重新渲染畫面
    render();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  modal.classList.add("hidden");
  cart = [];
  showSuccessPage();
  form.reset();
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
  <!-- 左邊：食物名稱 -->
  <div class="order-item-title">
    <span>${item.emoji} ${item.name}</span>
  </div>

  <!-- 中間：數量控制（加減按鈕 + 數量 + remove） -->
  <div class="quantity-controls">
    <button class="adjust-btn" data-action="decrease" data-item-id="${item.id}">-</button>
    <span class="item-quantity">${cartItem.quantity}</span>
    <button class="adjust-btn" data-action="increase" data-item-id="${item.id}">+</button>
    <button class="remove-btn" data-action="delete" data-item-id="${item.id}">remove</button>
  </div>

  <!-- 右邊：價錢 -->
  <div class="order-item-price">
    $${(item.price * cartItem.quantity).toFixed(2)}
  </div>
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
