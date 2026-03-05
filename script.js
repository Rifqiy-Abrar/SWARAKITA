import { db, collection, addDoc, getDocs, query, orderBy }
from "./firebase.js";

window.showSection = function (id) {
  document.querySelectorAll(".content-section").forEach(section => {
    section.classList.add("hidden");
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.remove("hidden");
  }
}

window.masuk = function() {
  showSection("menu");

  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.classList.remove("hidden");
  }
}

function showMenu() {
  showSection("menu");
}

// expose ke global karena pakai module + onclick
window.showSection = showSection;
window.showMenu = showMenu;
window.masuk = masuk;

window.addEventListener("DOMContentLoaded", () => {
  showSection("welcomeText");
});
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

const form = document.getElementById("laporForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const kategori = document.getElementById("kategori").value;
    const isi = document.getElementById("isilaporan").value;

    await addDoc(collection(db, "laporan"), {
      kategori,
      isi,
      tanggal: new Date()
    });

    alert("Laporan terkirim");
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
