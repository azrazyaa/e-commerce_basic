const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

async function productDetail(id) {
  const productContainer = document.getElementById("product");
  if (!productContainer) {
    console.error("Element #product tidak ditemukan di HTML.");
    return;
  }

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
      productContainer.innerHTML = `
        <div class="col-span-full text-center py-10 text-red-500">
          Produk tidak ditemukan
        </div>
      `;
      return;
    }

    const product = await response.json();

    productContainer.innerHTML = `
      <div class="flex flex-col md:flex-row gap-10 mt-20">
        <!-- Image -->
        <div class="flex-1 flex justify-center">
          <img
            src="${product.image}"
            alt="${product.title}"
            class="h-64 w-auto object-contain bg-gray-100 p-4 rounded"
          />
        </div>

        <!-- Detail -->
        <div class="flex-1 space-y-6">
          <h2 class="text-2xl font-bold">${product.title}</h2>

          <div class="flex items-center gap-2">
            <div class="text-yellow-400 text-xl">★★★★☆</div>
            <p class="text-gray-500 text-sm">(150 Ratings)</p>
            <p class="text-green-600 font-semibold text-sm ml-2">| In Stock</p>
          </div>

          <p class="text-2xl font-bold text-gray-800">$${product.price}</p>

          <p class="text-gray-600 text-sm">
            Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.
          </p>

          <!-- Quantity & Buy -->
          <div class="flex items-center gap-4">
            <div class="flex items-center border rounded overflow-hidden">
              <button class="px-3 py-1 text-lg font-bold bg-gray-200" onclick="decreaseQty()">−</button>
              <input id="qty" type="number" value="1" class="w-12 text-center outline-none" />
              <button class="px-3 py-1 text-lg font-bold bg-gray-200" onclick="increaseQty()">+</button>
            </div>
            <!-- BUY NOW -->
            <button class="buy-now-btn bg-[#7f1d1d] hover:bg-red-300 text-white px-6 py-2 rounded">
              Buy Now
            </button>
            <!-- ADD TO CART -->
            <button class="add-to-cart-btn bg-[#7f1d1d] hover:bg-red-300 text-white px-6 py-2 rounded" data-id="${product.id}">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    `;

    // Add to Cart (tetap pakai alert)
    const addBtn = productContainer.querySelector(".add-to-cart-btn");
    addBtn.addEventListener("click", () => addCart(product));
    
    // Buy Now: simpan 1 item + qty, lalu redirect
    const buyNowBtn = productContainer.querySelector(".buy-now-btn");
    buyNowBtn.addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qty").value, 10) || 1;
      const item = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: qty,
        checked: true,
      };
      localStorage.setItem("cart", JSON.stringify([item]));
      window.location.href = "checkout.html";
    });

  } catch (error) {
    console.error("Error fetching product details:", error);
    productContainer.innerHTML = `
      <div class="col-span-full text-center py-10 text-red-500">
        Terjadi kesalahan saat mengambil data produk
      </div>
    `;
  }
}

function increaseQty() {
  const qtyInput = document.getElementById("qty");
  qtyInput.value = parseInt(qtyInput.value, 10) + 1;
}

function decreaseQty() {
  const qtyInput = document.getElementById("qty");
  if (parseInt(qtyInput.value, 10) > 1) {
    qtyInput.value = parseInt(qtyInput.value, 10) - 1;
  }
}

function addCart(product) {
  const qty = parseInt(document.getElementById("qty").value, 10) || 1;
  const itemToAdd = {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity: qty,
    checked: true,
  };
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(itemToAdd);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk berhasil ditambahkan ke keranjang!");
}

document.addEventListener("DOMContentLoaded", () => {
  productDetail(productId);
});
