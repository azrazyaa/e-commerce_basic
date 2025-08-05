// checkout.js
document.addEventListener("DOMContentLoaded", () => {
  const checkoutItemsEl      = document.getElementById("checkout-items");
  const subtotalEl           = document.getElementById("subtotal");
  const totalPaymentEl       = document.getElementById("total-payment");
  const selectedPaymentEl    = document.getElementById("selected-payment-method");
  const createOrderBtn       = document.getElementById("create-order-btn");
  const SERVICE_FEE          = 20;

  // Baca cart terbaru dari localStorage
  function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  // Format angka jadi Rupiah
  function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(num);
  }

  // Render ulang hanya list item dan harga—tidak menyentuh tombol
  function renderCheckoutItems() {
    const cart = loadCart();
    checkoutItemsEl.innerHTML = "";

    if (cart.length === 0) {
      checkoutItemsEl.innerHTML = `<li class="text-gray-500">Keranjang kosong</li>`;
      subtotalEl.textContent     = formatRupiah(0);
      totalPaymentEl.textContent = formatRupiah(0 + SERVICE_FEE);
      return;
    }

    let subtotal = 0;
    cart.forEach(item => {
      if (item.checked) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const li = document.createElement("li");
        li.className = "flex items-center gap-4";
        li.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-contain">
          <div class="flex-1 flex justify-between items-center">
            <span>${item.title} x ${item.quantity}</span>
            <span>${formatRupiah(itemTotal)}</span>
          </div>
        `;
        checkoutItemsEl.appendChild(li);
      }
    });

    // Update subtotal & total
    subtotalEl.textContent     = formatRupiah(subtotal);
    totalPaymentEl.textContent = formatRupiah(subtotal + SERVICE_FEE);
  }

  // Pasang listener metode pembayaran SEKALI saja
  document.querySelectorAll('[data-method]').forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll('[data-method]').forEach(b => {
        b.classList.remove("bg-blue-500", "text-white");
      });
      btn.classList.add("bg-blue-500", "text-white");
      const method = btn.dataset.method;
      selectedPaymentEl.innerHTML = `<span>Metode Pembayaran: <strong>${method}</strong></span>`;
      createOrderBtn.disabled = false;
    });
  });

  // Pasang listener tombol checkout SEKALI saja
  createOrderBtn.addEventListener("click", () => {
    if (!selectedPaymentEl.textContent.trim()) {
      alert("Silakan pilih metode pembayaran terlebih dahulu.");
      return;
    }
    alert(`Pesanan berhasil dibuat! Total bayar: ${totalPaymentEl.textContent}`);
    localStorage.removeItem("cart");
    window.location.href = "payment.html";
  });

  // Render sekali di load—and anytime kamu panggil lagi jika ingin refresh
  renderCheckoutItems();
});
