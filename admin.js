import { db, collection, getDocs, query, orderBy }
from "./firebase.js";

const PASS = "admin123"; // password admin

window.login = function () {
  const input = document.getElementById("password").value;

  if (input === PASS) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPage").style.display = "block";
    loadLaporan();
  } else {
    alert("Password salah");
  }
};

  window.loadLaporan = async function() {
  const list = document.getElementById("adminList");
  if (!list) return;

  list.innerHTML = "Loading...";

  const q = query(collection(db, "laporan"), orderBy("tanggal", "desc"));
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
        <h4>${data.judul} (${data.kategori})</h4>
        <p>${data.isi}</p>
        <small>${new Date(data.tanggal.seconds * 1000).toLocaleString()}</small>
      </div>
    `;
  });
};
