    import { db, collection, getDocs, deleteDoc, updateDoc, doc, query, orderBy } from "./firebase.js";
 
  let allLaporan = [];
  let deleteTargetId = null;
  let statusTargetId = null;
 
  window.login = function () {
    const val = document.getElementById('passwordInput').value;
    const err = document.getElementById('loginError');
    if (val === 'admin123') {
      document.getElementById('loginPage').style.display = 'none';
      document.getElementById('topbar').style.display = 'flex';
      document.getElementById('adminPage').style.display = 'block';
      loadLaporan();
    } else {
      err.textContent = 'Password salah. Coba lagi.';
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordInput').focus();
    }
  };
 
  window.logout = function () {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('topbar').style.display = 'none';
    document.getElementById('adminPage').style.display = 'none';
    document.getElementById('passwordInput').value = '';
    allLaporan = [];
  };
 
  window.loadLaporan = async function () {
    document.getElementById('laporanList').innerHTML =
      '<div class="loading-wrap">Memuat laporan...</div>';
    try {
      const q = query(collection(db, 'laporan'), orderBy('tanggal', 'desc'));
      const snap = await getDocs(q);
      allLaporan = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      updateStats();
      renderLaporan();
    } catch (e) {
      document.getElementById('laporanList').innerHTML =
        '<div class="loading-wrap">Gagal memuat data. Cek koneksi Firebase.</div>';
    }
  };
 
  function updateStats() {
    document.getElementById('statTotal').textContent = allLaporan.length;
    document.getElementById('statDiproses').textContent =
      allLaporan.filter(l => l.status === 'Diproses').length;
    document.getElementById('statDitinjau').textContent =
      allLaporan.filter(l => l.status === 'Ditinjau').length;
    document.getElementById('statSelesai').textContent =
      allLaporan.filter(l => l.status === 'Selesai').length;
  }
 
  window.renderLaporan = function () {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const kat    = document.getElementById('filterKategori').value;
    const stat   = document.getElementById('filterStatus').value;
 
    let filtered = allLaporan.filter(l => {
      const matchSearch = !search ||
        (l.judul || '').toLowerCase().includes(search) ||
        (l.isi   || '').toLowerCase().includes(search);
      const matchKat  = !kat  || l.kategori === kat;
      const matchStat = !stat || l.status   === stat;
      return matchSearch && matchKat && matchStat;
    });
 
    const list = document.getElementById('laporanList');
 
    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#6b8a9e" stroke-width="2"/>
            <path d="M14 20h12M20 14v12" stroke="#6b8a9e" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>Tidak ada laporan ditemukan.</p>
        </div>`;
      return;
    }
 
    list.innerHTML = filtered.map((l, i) => {
      const kat   = l.kategori || 'default';
      const stat  = l.status   || 'Diproses';
      const tgl   = l.tanggal?.toDate
        ? l.tanggal.toDate().toLocaleDateString('id-ID', {
            day:'2-digit', month:'short', year:'numeric',
            hour:'2-digit', minute:'2-digit'})
        : (l.tanggal || '—');
 
      return `
        <div class="laporan-card" style="animation-delay:${i * 0.04}s">
          <div class="laporan-top">
            <div>
              <span class="badge-kategori badge-${kat}">${kat}</span>
              <div class="laporan-judul">${l.judul || 'Tanpa judul'}</div>
            </div>
            <div class="laporan-actions">
              <button class="btn-action btn-status" onclick="openStatusModal('${l.id}')">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
                Status
              </button>
              <button class="btn-action btn-delete" onclick="openDeleteModal('${l.id}')">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 3h8M5 3V2h2v1M10 3l-.7 7H2.7L2 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                Hapus
              </button>
            </div>
          </div>
          <div class="laporan-isi">${l.isi || '—'}</div>
          <div class="laporan-meta">
            <span class="laporan-kode">${l.kode || '—'}</span>
            <span class="badge-status status-${stat}" onclick="openStatusModal('${l.id}')">${stat}</span>
            <span class="laporan-tanggal">${tgl}</span>
          </div>
        </div>`;
    }).join('');
  };
 
  /* ===== HAPUS ===== */
  window.openDeleteModal = function (id) {
    deleteTargetId = id;
    document.getElementById('deleteModal').classList.add('open');
  };
 
  window.closeDeleteModal = function () {
    deleteTargetId = null;
    document.getElementById('deleteModal').classList.remove('open');
  };
 
  window.confirmDelete = async function () {
    if (!deleteTargetId) return;
    await deleteDoc(doc(db, 'laporan', deleteTargetId));
    allLaporan = allLaporan.filter(l => l.id !== deleteTargetId);
    closeDeleteModal();
    updateStats();
    renderLaporan();
  };
 
  /* ===== STATUS ===== */
  window.openStatusModal = function (id) {
    statusTargetId = id;
    document.getElementById('statusModal').classList.add('open');
  };
 
  window.closeStatusModal = function () {
    statusTargetId = null;
    document.getElementById('statusModal').classList.remove('open');
  };
 
  window.setStatus = async function (newStatus) {
    if (!statusTargetId) return;
    await updateDoc(doc(db, 'laporan', statusTargetId), { status: newStatus });
    const item = allLaporan.find(l => l.id === statusTargetId);
    if (item) item.status = newStatus;
    closeStatusModal();
    updateStats();
    renderLaporan();
  };
 
  /* Tutup modal klik luar */
  document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) closeDeleteModal();
  });
  document.getElementById('statusModal').addEventListener('click', function(e) {
    if (e.target === this) closeStatusModal();
  });
