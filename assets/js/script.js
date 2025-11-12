'use strict';

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { modal.classList.add('closed') }

// modal eventListener
modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  overlay.addEventListener('click', mobileMenuCloseFunc);

}





// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });
  /* ================================
   ADD TO CART → send to backend
   ================================ */
(function () {
  const BACKEND = (window.BACKEND_URL || "").replace(/\/+$/, "");

  function findProductInfo(btn) {
    const card =
      btn.closest(".showcase") ||
      btn.closest(".product") ||
      btn.closest(".card") ||
      btn.parentElement;
    const titleEl = card.querySelector(".showcase-title, h3, h4, .title");
    const priceEl = card.querySelector(".price, .product-price");
    const imgEl = card.querySelector("img");
    const title = titleEl ? titleEl.textContent.trim() : "Unknown";
    const priceRaw = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, "") : "0";
    const price = parseFloat(priceRaw) || 0;
    const img = imgEl ? imgEl.getAttribute("src") || "" : "";
    return { title, price, img };
  }

  async function sendToBackend(prod) {
    try {
      const res = await fetch(`${BACKEND}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ Added to cart:", data.item);
      } else {
        console.error("❌ Server error:", data);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  }

  function attachCartButtons() {
    const buttons = document.querySelectorAll(
      ".add-cart-btn, .add-to-cart, .addCart"
    );
    buttons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const orig = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Adding...";
        const product = findProductInfo(btn);
        await sendToBackend(product);
        btn.textContent = "Added ✓";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = orig;
        }, 1500);
      });
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", attachCartButtons);
  else attachCartButtons();
})();

}
