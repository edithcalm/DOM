(function () {
  "use strict";

  const listProducts = document.querySelector(".list-products");
  const totalEl = document.querySelector(".total-price .total");

  if (!listProducts || !totalEl) return;

  /**
   * Parse unit price text (e.g. "100 $" or "20 $") to number.
   * @param {string} text
   * @returns {number}
   */
  function parseUnitPrice(text) {
    const num = parseInt(text.trim().replace(/\s*\$\s*$/, ""), 10);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Get the product row (outer .card-body) that contains the given element.
   * @param {Element} el
   * @returns {Element|null}
   */
  function getProductRow(el) {
    return el.closest(".list-products .card-body");
  }

  /**
   * Update total price from all visible products.
   */
  function updateTotal() {
    const rows = listProducts.querySelectorAll(".card-body");
    let total = 0;
    rows.forEach(function (row) {
      const unitPriceEl = row.querySelector(".unit-price");
      const quantityEl = row.querySelector(".quantity");
      if (!unitPriceEl || !quantityEl) return;
      const unitPrice = parseUnitPrice(unitPriceEl.textContent);
      const qty = parseInt(quantityEl.textContent, 10) || 0;
      total += unitPrice * qty;
    });
    totalEl.textContent = total + " $";
  }

  /**
   * Handle plus button: increase quantity and update total.
   */
  function onPlus(e) {
    const row = getProductRow(e.target);
    if (!row) return;
    const quantityEl = row.querySelector(".quantity");
    if (!quantityEl) return;
    let qty = parseInt(quantityEl.textContent, 10) || 0;
    qty += 1;
    quantityEl.textContent = qty;
    updateTotal();
  }

  /**
   * Handle minus button: decrease quantity (min 0) and update total.
   */
  function onMinus(e) {
    const row = getProductRow(e.target);
    if (!row) return;
    const quantityEl = row.querySelector(".quantity");
    if (!quantityEl) return;
    let qty = parseInt(quantityEl.textContent, 10) || 0;
    if (qty > 0) {
      qty -= 1;
      quantityEl.textContent = qty;
      updateTotal();
    }
  }

  /**
   * Handle trash: remove the product row and update total.
   */
  function onDelete(e) {
    const row = getProductRow(e.target);
    if (!row) return;
    row.remove();
    updateTotal();
  }

  /**
   * Handle heart: toggle liked state (color).
   */
  function onLike(e) {
    const heart = e.target;
    if (!heart.classList.contains("fa-heart")) return;
    heart.classList.toggle("liked");
  }

  // Use event delegation on the product list
  listProducts.addEventListener("click", function (e) {
    const target = e.target;
    if (!target || !target.classList) return;

    if (target.classList.contains("fa-plus-circle")) {
      onPlus(e);
      return;
    }
    if (target.classList.contains("fa-minus-circle")) {
      onMinus(e);
      return;
    }
    if (target.classList.contains("fa-trash-alt")) {
      onDelete(e);
      return;
    }
    if (target.classList.contains("fa-heart")) {
      onLike(e);
      return;
    }
  });

  // Initial total (all quantities start at 0)
  updateTotal();
})();
