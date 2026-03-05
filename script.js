
import { db, collection, addDoc, getDocs, query, orderBy }
from "./firebase.js";

window.masuk = function () {
  const welcome = document.getElementById("welcomeText");
  const menu = document.getElementById("menu");

  if (!welcome || !menu) return;

  welcome.classList.add("hidden");
  menu.classList.remove("hidden");

  document.getElementById("welcomeText").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");

  showSection("menu");

  // tampilkan navbar
  document.getElementById("navbar").classList.remove("hidden");
};

window.showSection = function (id) {
  document.querySelectorAll(".content-section").forEach(sec => {
    sec.classList.add("hidden");
  });

  document.getElementById("menu").classList.add("hidden");

  const target = document.getElementById(id);
  if (target) {
    target.classList.remove("hidden");
  }

  if (id === "adminPage") {
    loadLaporan();
  }
  window.showSection = showSection;
  window.showMenu = showMenu;
  window.masuk = masuk;
};

window.showMenu = function () {
  document.querySelectorAll(".content-section").forEach(sec => {
    sec.classList.add("hidden");
  });

  document.getElementById("menu").classList.remove("hidden");
};

window.kembaliHome = function () {
  location.reload();
};                    

window.bukaAdmin = function () {
  const pass = prompt("Masukkan password admin");

  if (pass === "admin123") {
    window.location.href = "admin.html";
  } else {
    alert("Password salah");
  }
};
///////////////////////////////
// SUBMIT LAPORAN
///////////////////////////////

import { db, collection, addDoc } from "./firebase.js";

// Ambil form
const form = document.getElementById("laporForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const judul = document.getElementById("judulLaporan").value;
    const kategori = document.getElementById("kategori").value;
    const isi = document.getElementById("isilaporan").value;

    // Kirim ke Firebase
    await addDoc(collection(db, "laporan"), {
      judul,      // judul laporan
      kategori,
      isi,
      tanggal: new Date()
    });

    alert("Laporan terkirim!");
    form.reset();
  });
}
///////////////////////////////
// ADMIN LOAD DATA
///////////////////////////////

window.loadLaporan = async function() {
  const list = document.getElementById("adminList");

  if (!list) return;

  list.innerHTML = "Loading...";

  const q = query(
    collection(db, "laporan"),
    orderBy("tanggal", "desc")
  );

  const querySnapshot = await getDocs(q);

  list.innerHTML = "";

  if (querySnapshot.empty) {
    list.innerHTML = "<p>Belum ada laporan</p>";
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    list.innerHTML += `
      <div class="admin-card">
        <h4>${data.kategori}</h4>
        <p>${data.isi}</p>
        <small>
          ${new Date(data.tanggal.seconds * 1000).toLocaleString()}
        </small>
      </div>
    `;
  });
};
