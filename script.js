console.log("SCRIPT JALAN")
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

  // sembunyikan semua section
  document.querySelectorAll(".content-section").forEach(section => {
    section.classList.add("hidden");
  });

  // SEMBUNYIKAN MENU JUGA
  const menu = document.getElementById("menu");
  if (menu) menu.classList.add("hidden");

  // tampilkan target
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

  const menu = document.getElementById("menu");
  if (menu) menu.classList.remove("hidden");
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
    const judul = document.getElementById("judulLaporan").value;
    const isi = document.getElementById("isiLaporan").value;
    
    const kode = "SWK-" + Math.floor(1000 + Math.random() * 9000);

await addDoc(collection(db, "laporan"), {
  kode: kode,
  kategori: kategori,
  judul: judul,
  isi: isi,
  status: "Diproses",
  tanggal: new Date()
});
    
    alert("Laporan berhasil dikirim!\nKode Tracking: " + kode);

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
    <h4>${data.judul}</h4>
    <small>${data.kategori}</small>
    <p>${data.isi}</p>
  </div>
    `;
  })
};

window.cekTracking = async function () {

  const kode = document.getElementById("cariKode").value;
  const hasil = document.getElementById("hasilTracking");

  if (!kode) {
    hasil.innerHTML = "Masukkan kode terlebih dahulu!";
    return;
  }

  hasil.innerHTML = "Mencari...";

  const q = query(
    collection(db, "laporan"),
    orderBy("tanggal", "desc")
  );

  const snapshot = await getDocs(q);
  let ditemukan = false;

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (data.kode && data.kode === kode.trim()) {

      hasil.innerHTML = `
        <p><strong>Kode:</strong> ${data.kode}</p>
        <p><strong>Judul:</strong> ${data.judul}</p>
        <p><strong>Status:</strong> ${data.status}</p>
      `;

      ditemukan = true;
    }
  });

  if (!ditemukan) {
    hasil.innerHTML = "Kode tidak ditemukan.";
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
    }
  });
});

  fetch("panduan.html")
    .then(res => res.text())
    .then(data => {
      const el = document.getElementById("panduan");
      if (el) el.innerHTML = data;
    });
});

cards.forEach(card => observer.observe(card));
}); 

let saringActive = null;
 
  function saringToggle(k) {
    if (saringActive === k) {
      saringClose(k); saringActive = null;
    } else {
      if (saringActive) saringClose(saringActive);
      saringOpen(k); saringActive = k;
    }
  }
 
  function saringOpen(k) {
    document.querySelectorAll('.saring-card').forEach(c => {
      if (c.querySelector('.saring-letter') &&
          c.querySelector('.saring-letter').textContent.trim().startsWith(k))
        c.classList.add('active');
    });
    document.getElementById('saring-panel-' + k).classList.add('open');
  }
 
  function saringClose(k) {
    document.querySelectorAll('.saring-card').forEach(c => {
      if (c.querySelector('.saring-letter') &&
          c.querySelector('.saring-letter').textContent.trim().startsWith(k))
        c.classList.remove('active');
    });
    document.getElementById('saring-panel-' + k).classList.remove('open');
  }
 
  function saringCopy(k) {
    const el  = document.getElementById('tpl-' + k);
    const btn = document.getElementById('cbtn-' + k);
    if (!el || !btn) return;
    navigator.clipboard.writeText(el.textContent.trim()).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2 6L5 9L10 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg> Tersalin!`;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="3" width="7" height="8" rx="1.5" stroke="#fff" stroke-width="1.3"/>
          <path d="M3 3V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1" stroke="#fff" stroke-width="1.3"/>
          </svg> Salin`;
      }, 2000);
    });
  }

window.saringToggle = function(huruf) {
  const panel = document.getElementById("saring-panel-" + huruf);

  if (panel.classList.contains("show")) {
    panel.classList.remove("show");
  } else {
    // tutup semua panel dulu
    document.querySelectorAll(".saring-panel").forEach(p => {
      p.classList.remove("show");
    });

    // buka yang diklik
    panel.classList.add("show");
  }
};
