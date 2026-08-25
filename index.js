import {menuArray} from '/data.js'


const menu = document.getElementById('menu')
const order = document.getElementById('order')
const form = document.getElementById('payment-form')
const modal = document.getElementById('modal')
const orderBtn = document.getElementById('order-btn')

let cart = []

menu.addEventListener('click', function(e){
    if (e.target.classList.contains('menu-btn')) {
        const itemId = Number(e.target.dataset.itemId)
        addToOrder(itemId)
    }
})

order.addEventListener('click', function(e){
    if (e.target.classList.contains('remove-btn')){
        const itemId = Number(e.target.dataset.itemId)
        cart = cart.filter(id => id !== itemId)
        render()
    }
})

form.addEventListener('submit', function(e){
    e.preventDefault()
    modal.classList.add('hidden')
    cart = []
    showSuccessPage()
})

orderBtn.addEventListener('click', function(){
    modal.classList.remove('hidden')
})

function showSuccessPage(){
    
    const paymentFormData = new FormData(form)
    const name = paymentFormData.get('name')
    order.innerHTML = `<h2 class="thank-you-msg">Thanks ${name}! Your order is on its way!</h2>`
    
}

function addToOrder(itemId) {
    if ( cart.includes(itemId) ) {
        return
    }
    cart.push(itemId)

    if (cart.length > 0) {
        order.classList.remove('hidden')
    }

    render();
}

function getOrderHtml() {
    let orderHtml = ''
    let totalPrice = 0

    cart.forEach(function(itemId) {
        const item = menuArray.find( menuItem => menuItem.id === itemId)
        if (item) {
            totalPrice += item.price

            orderHtml += `
                <div class="order-item">
                    <h3>${item.emoji} ${item.name}</h3>
                    <button class="remove-btn" data-item-id="${item.id}">remove</button>
                    <p class="item-price">$${item.price}</p>
                </div>
            `
            }
        })
    
        if (cart.length === 0) {
        orderHtml = '<p>What would you like to have? 🍔</p>'
    } else {
        // 有嘢食先加總金額
        orderHtml += `
            <div class="cart-total">
                <strong>Total Price:</strong>
                <span>$${totalPrice.toFixed(2)}</span>
            </div>
        `
    }
    
    return orderHtml
}




function getMenuHtml(){
    let menuHtml = ''
    menuArray.forEach(function(menuItem){
        menuHtml += `
<div class="menu-item">
        <div class="item-emoji">${menuItem.emoji}</div>
        <div>
            <h2 class="name">${menuItem.name}</h2>
            <p class="ingredients">${menuItem.ingredients.join(', ')}</p>
            <p>$${menuItem.price}</p>
        </div>            
        <button class="menu-btn" data-item-id="${menuItem.id}">+</button>
</div>
        `
    })

    return menuHtml
}


function render(){
    menu.innerHTML = getMenuHtml()
    document.getElementById('order-inner').innerHTML = getOrderHtml()
    
}

render()