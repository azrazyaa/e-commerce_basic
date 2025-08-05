document.addEventListener("DOMContentLoaded", async () => {
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  let products = [];

  // Load cart dari localStorage kalau ada
  function loadCartFromStorage() {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : null;
  }

  // Simpan cart ke localStorage
  function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(products));
  }

  // nagnbil data cart di localstorage
  function initializeCart() {
    const stored = loadCartFromStorage();

    if (stored !== null && Array.isArray(stored) && stored.length > 0) {
      products = stored;
      renderCartItems();
    } else {
      // Jika keranjang kosong
      cartItemsEl.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-gray-500 py-4">
            Keranjang Anda kosong
          </td>
        </tr>
      `;
      subtotalEl.textContent = "$0.00";
      totalEl.textContent = "$0.00";
    }
  }

  // Render item di keranjang
  function renderCartItems() {
    cartItemsEl.innerHTML = ""; // Kosongkan dulu

    products.forEach((product, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100";

      tr.innerHTML = `
        <td class="p-3 text-center">
          <input
            type="checkbox"
            ${product.checked ? "checked" : ""}
            class="w-5 h-5 cursor-pointer"
            data-index="${index}"
          />
        </td>
        <td class="p-3 flex items-center gap-3">
          <img
            src="${product.image}"
            alt="${product.title}"
            class="w-12 h-12 object-contain"
          />
          <span class="font-semibold text-sm">${product.title}</span>
        </td>
        <td class="p-3 font-semibold">${formatPrice(product.price)}</td>
        <td class="p-3 text-center">
          <select
            class="border border-gray-300 rounded px-2 py-1 text-center quantity-select"
            data-index="${index}"
          >
            ${[...Array(10)]
              .map((_, i) => {
                const val = i + 1;
                return `<option value="${val}" ${
                  val === product.quantity ? "selected" : ""
                }>${val}</option>`;
              })
              .join("")}
          </select>
        </td>
        <td
          class="p-3 text-center cursor-pointer text-gray-600 hover:text-red-600"
          data-remove="${index}"
          title="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </td>
      `;

      cartItemsEl.appendChild(tr);
    });

    attachEventListeners();
    updateTotals(); // Update subtotal dan tambahkan tombol checkout
  }

  // Pasang event listener ke checkbox, quantity, dan tombol remove
  function attachEventListeners() {
    // Checkbox item
    cartItemsEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        products[idx].checked = e.target.checked;
        saveCartToStorage();
        updateTotals();
      });
    });

    // Quantity select dropdown
    cartItemsEl.querySelectorAll(".quantity-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        products[idx].quantity = parseInt(e.target.value, 10);
        saveCartToStorage();
        updateTotals();
      });
    });

    // Tombol remove item
    cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.remove;
        products.splice(idx, 1);
        saveCartToStorage();
        renderCartItems();
      });
    });
  }

  // Hitung dan tampilkan subtotal dan total
  function updateTotals() {
    let subtotal = 0;
    products.forEach((p) => {
      if (p.checked && !isNaN(p.price) && !isNaN(p.quantity)) {
        subtotal += p.price * p.quantity;
      }
    });

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal); // Asumsi ongkir free

    // Ganti tombol default jika ada
    const originalBtn = document.getElementById("checkout");
    if (originalBtn) originalBtn.remove();

    // Tambahkan tombol Checkout dinamis
    const checkoutContainer = document.querySelector(".mt-6.max-w-sm");
    if (checkoutContainer) {
      checkoutContainer.innerHTML += `
        <div id="checkout-container" class="mt-6">
          <button 
            class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            onclick="window.location.href='checkout.html'"
          >
            Checkout
          </button>
        </div>
      `;
    }
  }

  // Format angka jadi $xx.xx
  function formatPrice(num) {
    return `$${num.toFixed(2)}`;
  }

  // Jalankan init
  initializeCart();
});