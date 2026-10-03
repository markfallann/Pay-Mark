const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const paymentForm = document.getElementById("paymentForm");

const payButton = document.getElementById("payButton");

const paymentArea = document.getElementById("paymentArea");
const successArea = document.getElementById("successArea");

const qrBox = document.getElementById("qrBox");

const displayAmount = document.getElementById("displayAmount");
const displayStatus = document.getElementById("displayStatus");
const status = document.getElementById("status");

const paymentCode = document.getElementById("paymentCode");
const copyButton = document.getElementById("copyButton");
const whatsappButton = document.getElementById("whatsappButton");

const ADMIN_WHATSAPP = "6282156370120";

let currentPayment = {
  amount: 0,
  description: "",
  code: ""
};

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function generateDemoCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  function part() {
    let result = "";

    for (let i = 0; i < 4; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }

  return `${part()}-${part()}-${part()}`;
}

paymentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const amount = Number(amountInput.value);

  if (!Number.isInteger(amount) || amount < 1000) {
    alert("Minimal pembayaran adalah Rp1.000.");
    return;
  }

  currentPayment.amount = amount;
  currentPayment.description = descriptionInput.value.trim();

  payButton.disabled = true;
  payButton.style.opacity = "0.6";
  payButton.querySelector("span").textContent = "Menyiapkan pembayaran...";

  paymentArea.classList.remove("hidden");

  displayAmount.textContent = formatRupiah(amount);
  displayStatus.textContent = "Pending";

  /*
    ============================================================
    TEMPORARY FRONTEND MODE
    ============================================================

    Nanti bagian ini diganti dengan:

    fetch("/api/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        description: currentPayment.description
      })
    })

    Backend yang akan berkomunikasi dengan BuatQris.
  */

  setTimeout(() => {

    payButton.disabled = false;
    payButton.style.opacity = "1";
    payButton.querySelector("span").textContent = "Buat Pembayaran";

    status.classList.add("pending");

    /*
      DEMO:
      QR sementara menggunakan placeholder.

      Nanti diganti dengan URL QRIS asli dari API.
    */

    qrBox.innerHTML = `
      <div class="qr-icon">QR</div>
      <span>Menunggu koneksi QRIS</span>
    `;

  }, 700);
});


/*
============================================================
FUNGSI UNTUK MENAMPILKAN QRIS ASLI
============================================================

Nanti backend cukup memanggil:

showQR("URL_GAMBAR_QRIS");

============================================================
*/

function showQR(qrUrl) {

  qrBox.innerHTML = "";

  const image = document.createElement("img");

  image.src = qrUrl;
  image.alt = "QRIS";
  image.className = "qr-image";

  qrBox.appendChild(image);
}


/*
============================================================
FUNGSI PAYMENT SUCCESS
============================================================

Nanti dipanggil setelah backend memberitahu pembayaran sukses.

Contoh:

paymentSuccess({
  amount: 5000,
  code: "ABCD-abcd-abcd"
});

============================================================
*/

function paymentSuccess(data) {

  currentPayment.amount = data.amount;
  currentPayment.code = data.code;

  displayStatus.textContent = "Berhasil";

  status.classList.remove("pending");

  successArea.classList.remove("hidden");

  paymentCode.textContent = data.code;

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}


/*
============================================================
SALIN KODE
============================================================
*/

copyButton.addEventListener("click", async () => {

  const code = paymentCode.textContent;

  try {

    await navigator.clipboard.writeText(code);

    copyButton.textContent = "Tersalin";

    setTimeout(() => {
      copyButton.textContent = "Salin";
    }, 1500);

  } catch {

    alert("Gagal menyalin kode.");

  }

});


/*
============================================================
WHATSAPP ADMIN
============================================================
*/

whatsappButton.addEventListener("click", () => {

  const amount = formatRupiah(currentPayment.amount);
  const code = currentPayment.code || "BELUM ADA";

  const message =
`Aku sudah membayar sebanyak ${amount}🔥
Ini kode akses/kode QRIS-nya: ${code}`;

  const url =
    `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

});