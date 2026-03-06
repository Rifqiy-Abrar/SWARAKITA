import { db, collection, addDoc, getDocs, query, orderBy } from "./firebase.js";

///////////////////////////////
// MASUK DARI WELCOME
///////////////////////////////
window.masuk = function () {

  const welcome = document.getElementById("welcomeText");
  const menu = document.getElementById("menu");
  const navbar = document.getElementById("navbar");

  if (welcome) welcome.classList.add("hidden");
  if (menu) menu.classList.remove("hidden");
  if (navbar) navbar.classList.remove("hidden");

};

///////////////////////////////
// PINDAH SECTION
///////////////////////////////
window.showSection = function (id) {

  document.querySelectorAll(".content-section").forEach(section => {
    section.classList.add("hidden");
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.remove("hidden");
  }

};

///////////////////////////////
// KEMBALI KE MENU
///////////////////////////////
window.showMenu = function () {

  document.querySelectorAll(".content-section").forEach(section => {
    section.classList.add("hidden");
  });

  document.getElementById("menu").classList.remove("hidden");

};

///////////////////////////////
// RELOAD KE HOME
///////////////////////////////
window.kembaliHome = function () {
  location.reload();
};

///////////////////////////////
// ADMIN LOGIN
///////////////////////////////
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
const form = document.getElementById("laporForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const kategori = document.getElementById("kategori").value;
    const isi = document.getElementById("isilaporan").value;

    await addDoc(collection(db, "laporan"), {
      kategori: kategori,
      isi: isi,
      tanggal: new Date()
    });

    alert("Laporan berhasil dikirim!");

    form.reset();

    showSection("konfirmasi");
  });
}

///////////////////////////////
// ADMIN LOAD DATA
///////////////////////////////
window.loadLaporan = async function () {

  const list = document.getElementById("adminList");

  if (!list) return;

  list.innerHTML = "Loading...";

  const q = query(
    collection(db, "laporan"),
    orderBy("tanggal", "desc")
  );

  const snapshot = await getDocs(q);

  list.innerHTML = "";

  if (snapshot.empty) {
    list.innerHTML = "<p>Belum ada laporan</p>";
    return;
  }

  snapshot.forEach((doc) => {

    const data = doc.data();

    list.innerHTML += `
      <div class="admin-card">
        <h4>${data.kategori}</h4>
        <p>${data.isi}</p>
      </div>
    `;
  })
};
