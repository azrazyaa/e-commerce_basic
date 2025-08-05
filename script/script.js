async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    const grid = document.getElementById("product-grid");

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="h-40 object-contain mx-auto mb-2" />
        <h3 class="text-sm font-semibold mb-1 truncate">${product.title}</h3>
        <p class="text-red-500 font-bold">$${product.price}</p>
        <button class="add-to-cart-btn bg-[#7f1d1d] hover:bg-red-300 text-white px-6 py-2 rounded mt-2">
          Add To Cart
        </button>
      `;

      // Tombol Add to Cart hanya menambahkan produk yang diklik
      const addBtn = card.querySelector(".add-to-cart-btn");
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // supaya tidak ikut membuka halaman detail
        addCart(product);
        alert("Produk berhasil ditambahkan ke keranjang!");
      });

      // Klik seluruh card buka halaman detail
      card.addEventListener("click", () => {
        window.location.href = `detail.html?id=${product.id}`;
      });

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
  }
}

window.onload = fetchProducts;

// Fungsi untuk menambahkan produk ke localStorage
function addCart(product) {
  const itemToAdd = {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity: 1,
    checked: true,
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(itemToAdd);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Toggle popup profil
function toggleProfilePopup() {
  const popup = document.getElementById("profile-popup");
  popup.classList.toggle("hidden");
}

// Logout
function logout() {
  localStorage.clear();
  alert("Berhasil Logout!");
  window.location.href = "login.html"; // ganti sesuai file login kamu
}

// Tutup popup jika klik di luar
document.addEventListener("click", function (e) {
  const popup = document.getElementById("profile-popup");
  const card = popup.querySelector("div");
  const trigger = e.target.closest("button[onclick='toggleProfilePopup()']");

  if (
    !popup.classList.contains("hidden") &&
    !card.contains(e.target) &&
    !trigger
  ) {
    popup.classList.add("hidden");
  }
});
