const multer = require("multer");
const fs = require("fs");

const storageBerita = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/enews/berita/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/enews/berita/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadBerita = multer({
  storage: storageBerita,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storagePengumunan = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/enews/pengumuman/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/enews/pengumuman/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadPengumuman = multer({
  storage: storagePengumunan,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storagePhotoKTP = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/penduduk/foto_ktp/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/penduduk/foto_ktp/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadPhotoKTP = multer({
  storage: storagePhotoKTP,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storagePhotoKK = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/penduduk/foto_kk/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/penduduk/foto_kk/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadPhotoKK = multer({
  storage: storagePhotoKK,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storagePhotoIjazah = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/penduduk/foto_ijazah/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/penduduk/foto_ijazah/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadPhotoIjazah = multer({
  storage: storagePhotoIjazah,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storagePhotoPenduduk = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/penduduk/foto_penduduk/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/penduduk/foto_penduduk/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadPhotoPenduduk = multer({
  storage: storagePhotoPenduduk,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storageRegulasi = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/regulasi/";

    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/regulasi/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadRegulasi = multer({
  storage: storageRegulasi,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storageKontenBudaya = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/konten/budaya";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/konten/budaya" + filename;
    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});
const uploadKontenBudaya = multer({
  storage: storageKontenBudaya,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storageKontenWisata = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/konten/wisata";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/konten/wisata" + filename;
    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});
const uploadKontenWisata = multer({
  storage: storageKontenWisata,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storageWisbud = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/wisata-budaya/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/wisata-budaya/" + filename;
    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});
const uploadWisbud = multer({
  storage: storageWisbud,
  limits: {
    fileSize: 3 * 1000 * 1000, //3mb
  },
});

const storageSejarahDesa = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/sejarah/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/profil_desa/sejarah/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadSejarahDesa = multer({
  storage: storageSejarahDesa,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageWilayahDesa = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/wilayah/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/profil_desa/wilayah/" + filename;
    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadWilayahDesa = multer({
  storage: storageWilayahDesa,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageSpd = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/struktur_pemerintah_desa/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;

    const filepath = "static/profil_desa/struktur_pemerintah_desa/" + filename;
    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadSpd = multer({
  storage: storageSpd,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageAnggotaSpd = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/struktur_pemerintah_desa/anggota/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath =
      "static/profil_desa/struktur_pemerintah_desa/anggota/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadAnggotaSpd = multer({
  storage: storageAnggotaSpd,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageBpd = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/badan_permusyawaratan_desa/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath =
      "static/profil_desa/badan_permusyawaratan_desa/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadBpd = multer({
  storage: storageBpd,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageAnggotaBpd = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/badan_permusyawaratan_desa/anggota/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath =
      "static/profil_desa/badan_permusyawaratan_desa/anggota/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadAnggotaBpd = multer({
  storage: storageAnggotaBpd,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageLpm = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/lembaga_pemberdayaan_masyarakat/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath =
      "static/profil_desa/lembaga_pemberdayaan_masyarakat/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadLpm = multer({
  storage: storageLpm,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageAnggotaLpm = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory =
      "static/profil_desa/lembaga_pemberdayaan_masyarakat/anggota/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath =
      "static/profil_desa/lembaga_pemberdayaan_masyarakat/anggota/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadAnggotaLpm = multer({
  storage: storageAnggotaLpm,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageAnggotaBidangLpm = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory =
      "static/profil_desa/lembaga_pemberdayaan_masyarakat/anggota_bidang/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath =
      "static/profil_desa/lembaga_pemberdayaan_masyarakat/anggota_bidang/" +
      filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadAnggotaBidangLpm = multer({
  storage: storageAnggotaBidangLpm,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageKt = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/karang_taruna/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/profil_desa/karang_taruna/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadKt = multer({
  storage: storageKt,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageAnggotaKt = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/karang_taruna/anggota/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/profil_desa/karang_taruna/anggota/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadAnggotaKt = multer({
  storage: storageAnggotaKt,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageAnggotaBidangKt = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/profil_desa/karang_taruna/anggota_bidang/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath =
      "static/profil_desa/karang_taruna/anggota_bidang/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadAnggotaBidangKt = multer({
  storage: storageAnggotaBidangKt,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageIklan = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/iklan/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/iklan/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadIklan = multer({
  storage: storageIklan,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storagePengaduan = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/pengaduan/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/pengaduan/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadPengaduan = multer({
  storage: storagePengaduan,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageStatusPengaduan = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/pengaduan/status/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/pengaduan/status/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadStatusPengaduan = multer({
  storage: storageStatusPengaduan,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const storageLayananPublikKTP = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/layanan_publik/ktp/";
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");
    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    req.uploadedFile = {
      filename: filename,
      filepath: `static/layanan_publik/ktp/${filename}`,
    };
    cb(null, filename);
  },
});
const uploadLayananPublikKTP = multer({
  storage: storageLayananPublikKTP,
  limits: { fileSize: 10 * 1000 * 1000 },
});

const storageLayananPublikKK = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/layanan_publik/kk/";
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");
    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    req.uploadedFile = {
      filename: filename,
      filepath: `static/layanan_publik/kk/${filename}`,
    };
    cb(null, filename);
  },
});
const uploadLayananPublikKK = multer({
  storage: storageLayananPublikKK,
  limits: { fileSize: 10 * 1000 * 1000 },
});

const storageLayananPublikAktaNikah = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/layanan_publik/akta_nikah/";
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");
    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    req.uploadedFile = {
      filename: filename,
      filepath: `static/layanan_publik/akta_nikah/${filename}`,
    };
    cb(null, filename);
  },
});
const uploadLayananPublikAktaNikah = multer({
  storage: storageLayananPublikAktaNikah,
  limits: { fileSize: 10 * 1000 * 1000 },
});

const uploadTripleFields = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const directories = {
        foto_ktp: "static/layanan_publik/ktp/",
        foto_kk: "static/layanan_publik/kk/",
        foto_akta_nikah: "static/layanan_publik/akta_nikah/",
      };
      const directory = directories[file.fieldname];
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      const currentUTCDate = new Date();
      currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);
      const timestamp = currentUTCDate
        .toISOString()
        .replace(/-/g, "")
        .replace(/:/g, "")
        .replace(/\..+/, "");
      const originalname = file.originalname;
      const filename = `${timestamp}-${originalname}`;
      const filepath = `${
        file.fieldname === "foto_ktp"
          ? "static/layanan_publik/ktp/"
          : file.fieldname === "foto_kk"
          ? "static/layanan_publik/kk/"
          : "static/layanan_publik/akta_nikah/"
      }${filename}`;
      req.uploadedFile = {
        filename: filename,
        filepath: filepath,
      };
      cb(null, filename);
    },
  }),
}).fields([
  { name: "foto_ktp", maxCount: 1 },
  { name: "foto_kk", maxCount: 1 },
  { name: "foto_akta_nikah", maxCount: 1 },
]);

const storageDokumenIkm = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/dokumen/ikm/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/dokumen/ikm/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadDokumenIKM = multer({
  storage: storageDokumenIkm,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

const storageDokumenLayananPublik = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/dokumen/layanan_publik/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/dokumen/layanan_publik/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadDokumenLayananPublik = multer({
  storage: storageDokumenLayananPublik,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1000 * 1000, // 5 MB
  },
});

const storageLogoDesa = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "static/logo_desa/";
    // Periksa apakah direktori sudah ada, jika tidak, buat direktori
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    // Mendapatkan objek tanggal saat ini dalam UTC+8
    const currentUTCDate = new Date();
    currentUTCDate.setUTCHours(currentUTCDate.getUTCHours() + 8);

    // Mengonversi tanggal ke string tanpa spasi
    const timestamp = currentUTCDate
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\..+/, "");

    const originalname = file.originalname;
    const filename = `${timestamp}-${originalname}`;
    const filepath = "static/logo_desa/" + filename;

    req.uploadedFile = {
      filename: filename,
      filepath: filepath,
    };

    cb(null, `${filename}`);
  },
});

const uploadLogoDesa = multer({
  storage: storageLogoDesa,
  limits: {
    fileSize: 10 * 1000 * 1000, //3mb
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(406)
        .json({ error: "File terlalu besar. Batas ukuran file adalah 3MB." });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
  next();
};

module.exports = {
  uploadBerita,
  uploadPengumuman,
  uploadSejarahDesa,
  uploadWilayahDesa,
  uploadSpd,
  uploadAnggotaSpd,
  uploadBpd,
  uploadAnggotaBpd,
  uploadLpm,
  uploadAnggotaLpm,
  uploadAnggotaBidangLpm,
  uploadKt,
  uploadAnggotaKt,
  uploadAnggotaBidangKt,
  uploadPhotoKTP,
  uploadPhotoKK,
  uploadPhotoIjazah,
  uploadPhotoPenduduk,
  uploadRegulasi,
  uploadKontenBudaya,
  uploadKontenWisata,
  uploadWisbud,
  uploadIklan,
  uploadPengaduan,
  uploadStatusPengaduan,
  uploadLayananPublikKTP,
  uploadLayananPublikKK,
  uploadLayananPublikAktaNikah,
  uploadTripleFields,
  uploadDokumenIKM,
  uploadDokumenLayananPublik,
  uploadLogoDesa,
  handleMulterError,
};
