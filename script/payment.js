document.addEventListener("DOMContentLoaded", () => {
  const paymentMethodSelect = document.getElementById("payment-method");
  const paymentForms = document.querySelectorAll(".payment-form");
  const payButton = document.getElementById("pay-button");

  // Tampilkan form sesuai metode pembayaran
  paymentMethodSelect.addEventListener("change", () => {
    const selected = paymentMethodSelect.value;

    // Sembunyikan semua form
    paymentForms.forEach(form => form.classList.add("hidden"));

    // Tampilkan form yang sesuai
    if (selected === "e-wallet") {
      document.getElementById("form-e-wallet").classList.remove("hidden");
    } else if (selected === "bank-transfer") {
      document.getElementById("form-bank-transfer").classList.remove("hidden");
    } else if (selected === "cod") {
      document.getElementById("form-cod").classList.remove("hidden");
    }
  });

  // Validasi dan tampilkan SweetAlert
  payButton.addEventListener("click", () => {
    const method = paymentMethodSelect.value;

    if (!method) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silakan pilih metode pembayaran terlebih dahulu!",
      });
      return;
    }

    let isValid = true;

    // Validasi form berdasarkan metode
    if (method === "e-wallet" && !document.querySelector('input[name="e-wallet"]:checked')) {
      isValid = false;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silakan pilih salah satu e-wallet!",
      });
    } else if (method === "bank-transfer") {
      const bank = document.querySelector("#form-bank-transfer select").value;
      const account = document.querySelector("#form-bank-transfer input").value;
      if (!bank || !account.trim()) {
        isValid = false;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Silakan lengkapi informasi transfer bank!",
        });
      }
    } else if (method === "cod") {
      const address = document.querySelector("#form-cod textarea").value.trim();
      if (!address) {
        isValid = false;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Silakan masukkan alamat pengiriman!",
        });
      }
    }

    // Jika valid, tampilkan SweetAlert konfirmasi
    if (isValid) {
      Swal.fire({
        title: "Pembayaran Berhasil!",
        text: "Terima kasih, pesanan Anda sedang diproses.",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        // Redirect ke halaman konfirmasi (opsional)
        window.location.href = "home.html";
      });
    }
  });
});