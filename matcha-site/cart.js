document.addEventListener('DOMContentLoaded', function () {
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  if (!cartIcon || !cartModal || !cartItemsContainer || !cartCount || !cartTotal) return;

  var cart = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var li = document.createElement('li');
      li.innerHTML = item.name + ' x' + item.qty + ' - ' + (item.price * item.qty).toFixed(2) + ' zł ' +
        '<button class="remove-btn" data-name="' + item.name + '">🗑</button>';
      cartItemsContainer.appendChild(li);
      total += item.price * item.qty;
    }
    var count = 0;
    for (var j = 0; j < cart.length; j++) count += cart[j].qty;
    cartCount.textContent = count;
    cartTotal.textContent = 'Suma: ' + total.toFixed(2) + ' zł';

    var removeButtons = document.querySelectorAll('.remove-btn');
    for (var k = 0; k < removeButtons.length; k++) {
      removeButtons[k].addEventListener('click', function (e) {
        var name = e.target.getAttribute('data-name');
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].name === name) {
            cart[i].qty--;
            if (cart[i].qty <= 0) cart.splice(i, 1);
            break;
          }
        }
        updateCartUI();
        saveCart();
      });
    }
  }

  function addToCart(name, price) {
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        existing = cart[i];
        break;
      }
    }
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name: name, price: price, qty: 1 });
    }
    updateCartUI();
    openCart();
    saveCart();
  }

  function openCart() {
    cartModal.classList.add('open');
  }

  function closeCart() {
    cartModal.classList.remove('open');
  }

  var buyButtons = document.querySelectorAll('.buy-btn');
  for (var i = 0; i < buyButtons.length; i++) {
    buyButtons[i].addEventListener('click', function () {
      var name = this.getAttribute('data-name');
      var priceText = this.closest('.product-info').querySelector('.price').textContent;
      var price = parseFloat(priceText);
      addToCart(name, price);
    });
  }

  if (cartIcon) {
    cartIcon.addEventListener('mouseenter', openCart);
  }
  if (cartModal) {
    cartModal.addEventListener('mouseleave', closeCart);
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  window.setLanguage = function (lang) {
    var elements = document.querySelectorAll('[data-lang-pl]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var text = el.getAttribute('data-lang-' + lang);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    }
  };

  updateCartUI();
});
