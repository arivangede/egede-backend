const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");
const ExcelJS = require("exceljs");
const moment = require("moment-timezone");

const ikm = async (req, res, next) => {
  try {
    const data = await prisma.iKM.findMany();

    res.status(200).json({ message: "Successfully.", data: data });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const ikmById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const data = await prisma.iKM.findFirst({
      where: { id },
    });

    if (!data) {
      return res.status(404).json({ message: "Data not found." });
    }

    res.status(200).json({ message: "Successfully", data: data });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const filterIkm = async (req, res, next) => {
  try {
    const { tahun, bulan } = req.query;
    const gateId = req.user.gid;

    let whereClause = {
      fk_gate_id: gateId,
    };

    if (tahun && bulan) {
      if (!tahun.match(/^\d{4}$/) || !bulan.match(/^(0?[1-9]|1[012])$/)) {
        return res
          .status(400)
          .json({ message: "Invalid input for tahun or bulan." });
      }

      const startDate = new Date(
        `${tahun}-${bulan.padStart(2, "0")}-01T00:00:00.000Z`
      );
      const endDate = new Date(
        new Date(startDate).setMonth(startDate.getMonth() + 1)
      );

      whereClause.cts = {
        gte: startDate,
        lt: endDate,
      };
    } else if (tahun) {
      if (!tahun.match(/^\d{4}$/)) {
        return res.status(400).json({ message: "Invalid input for tahun." });
      }

      const startDate = new Date(`${tahun}-01-01T00:00:00.000Z`);
      const endDate = new Date(
        new Date(startDate).setFullYear(startDate.getFullYear() + 1)
      );

      whereClause.cts = {
        gte: startDate,
        lt: endDate,
      };
    } else if (bulan) {
      return res
        .status(400)
        .json({ message: "Please select a tahun along with bulan." });
    }

    const data = await prisma.iKM.findMany({
      where: whereClause,
    });

    const jumlahResponden = data.length;

    const pendidikanMapping = {
      "Tidak/Belum Sekolah": ["tidak/belum sekolah", "tidak sekolah"],
      "Belum Tamat SD/Sederajat": ["belum tamat sd/sederajat"],
      "Tamat SD/Sederajat": ["tamat sd/sederajat", "sd/sederajat"],
      "SLTP/Sederajat": ["sltp/sederajat"],
      "SLTA/Sederajat": ["slta/sederajat"],
      "Diploma I/II/III": [
        "diploma i/ii",
        "akademi/diploma iii/sarjana muda",
        "diploma i/ii/iii",
      ],
      "Diploma IV/Strata I": ["diploma iv/strata i", "s1"],
      "Strata II": ["strata-ii", "s2"],
      "Strata III": ["strata-iii", "s3"],
    };

    const pendidikanStats = {};
    for (const [key, values] of Object.entries(pendidikanMapping)) {
      pendidikanStats[key] = data.filter((item) =>
        values.some((value) =>
          item.pendidikan_terakhir.toLowerCase().includes(value)
        )
      ).length;
    }

    const jenisKelaminStats = {
      lakiLaki: data.filter((item) =>
        item.jenis_kelamin.toLowerCase().includes("laki-laki")
      ).length,
      perempuan: data.filter((item) =>
        item.jenis_kelamin.toLowerCase().includes("perempuan")
      ).length,
    };

    const periodeSurvey = bulan ? `${tahun}-${bulan}` : tahun;

    const jumlahUnsur = {
      u1: data.reduce((acc, item) => acc + (item.u1 || 0), 0),
      u2: data.reduce((acc, item) => acc + (item.u2 || 0), 0),
      u3: data.reduce((acc, item) => acc + (item.u3 || 0), 0),
      u4: data.reduce((acc, item) => acc + (item.u4 || 0), 0),
      u5: data.reduce((acc, item) => acc + (item.u5 || 0), 0),
      u6: data.reduce((acc, item) => acc + (item.u6 || 0), 0),
      u7: data.reduce((acc, item) => acc + (item.u7 || 0), 0),
      u8: data.reduce((acc, item) => acc + (item.u8 || 0), 0),
      u9: data.reduce((acc, item) => acc + (item.u9 || 0), 0),
    };

    res.status(200).json({
      message: "Successfully.",
      // data: data,
      statistik: {
        jumlahResponden: jumlahResponden,
        jenisKelamin: jenisKelaminStats,
        pendidikan: pendidikanStats,
        periodeSurvey: periodeSurvey,
        jumlahUnsur: jumlahUnsur,
      },
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const tahunIkm = async (req, res, next) => {
  try {
    const gateId = req.user.gid;

    const ikmYears = await prisma.iKM.findMany({
      where: { fk_gate_id: gateId },
      orderBy: {
        cts: "desc",
      },
      distinct: ["cts"],
      select: {
        cts: true,
      },
    });

    const uniqueYears = [
      ...new Set(ikmYears.map((ikm) => new Date(ikm.cts).getFullYear())),
    ];

    res.status(200).json({
      message: "Successfully",
      data: uniqueYears.map((year) => ({
        label: year.toString(),
        value: year.toString(),
      })),
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const tambahIkm = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user.rnd;
    const gateId = req.user.gid;

    const pengguna = await prisma.penggunaPribadi.findFirst({
      where: { id: userId },
      select: { fk_penduduk_id: true },
    });

    const penduduk = await prisma.penduduk.findFirst({
      where: { id: pengguna.fk_penduduk_id },
      select: {
        nama_lengkap: true,
        nik: true,
        jenis_kelamin: true,
        pendidikan_terakhir: true,
        pekerjaan: true,
      },
    });

    const penggunaUmum = await prisma.penggunaUmum.findFirst({
      where: { id: userId },
      select: {
        no_hp: true,
      },
    });

    const daerah = await prisma.daerah.findFirst({
      where: { fk_gate_id: gateId },
      select: { dusun: true },
    });

    await prisma.iKM.create({
      data: {
        nik: penduduk.nik,
        nama: penduduk.nama_lengkap,
        jenis_kelamin: penduduk.jenis_kelamin,
        no_hp: penggunaUmum.no_hp,
        pendidikan_terakhir: penduduk.pendidikan_terakhir,
        pekerjaan: penduduk.pekerjaan,
        jenis_layanan: data.jenis_layanan,
        u1: data.u1,
        u2: data.u2,
        u3: data.u3,
        u4: data.u4,
        u5: data.u5,
        u6: data.u6,
        u7: data.u7,
        u8: data.u8,
        u9: data.u9,
        saran: data.saran,
        dusun: daerah.dusun,
        fk_gate_id: gateId,
      },
    });

    res.status(200).json({ message: "Successfully." });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const cetakIkm = async (req, res, next) => {
  try {
    const { tahun, bulan } = req.query;
    const gateId = req.user.gid;

    let whereClause = {
      fk_gate_id: gateId,
    };

    if (tahun && bulan) {
      if (!tahun.match(/^\d{4}$/) || !bulan.match(/^(0?[1-9]|1[012])$/)) {
        return res
          .status(400)
          .json({ message: "Invalid input for tahun or bulan." });
      }

      const startDate = moment
        .tz(
          `${tahun}-${bulan.padStart(2, "0")}-01T00:00:00.000Z`,
          "Asia/Jakarta"
        )
        .toDate();
      const endDate = moment(startDate).add(1, "month").toDate();

      whereClause.cts = {
        gte: startDate,
        lt: endDate,
      };
    } else if (tahun) {
      if (!tahun.match(/^\d{4}$/)) {
        return res.status(400).json({ message: "Invalid input for tahun." });
      }

      const startDate = moment
        .tz(`${tahun}-01-01T00:00:00.000Z`, "Asia/Jakarta")
        .toDate();
      const endDate = moment(startDate).add(1, "year").toDate();

      whereClause.cts = {
        gte: startDate,
        lt: endDate,
      };
    } else if (bulan) {
      return res
        .status(400)
        .json({ message: "Please select a tahun along with bulan." });
    }

    const data = await prisma.iKM.findMany({
      where: whereClause,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("IKM Data");

    worksheet.columns = [
      { header: "Tanggal", key: "cts", width: 15 },
      { header: "NIK", key: "nik", width: 15 },
      { header: "Nama Sesuai KTP", key: "nama", width: 30 },
      { header: "Jenis Kelamin", key: "jenis_kelamin", width: 15 },
      { header: "Pendidikan Terakhir", key: "pendidikan_terakhir", width: 20 },
      { header: "Pekerjaan", key: "pekerjaan", width: 20 },
      { header: "Jenis Layanan", key: "jenis_layanan", width: 20 },
      { header: "U1", key: "u1", width: 10 },
      { header: "U2", key: "u2", width: 10 },
      { header: "U3", key: "u3", width: 10 },
      { header: "U4", key: "u4", width: 10 },
      { header: "U5", key: "u5", width: 10 },
      { header: "U6", key: "u6", width: 10 },
      { header: "U7", key: "u7", width: 10 },
      { header: "U8", key: "u8", width: 10 },
      { header: "U9", key: "u9", width: 10 },
      { header: "Saran", key: "saran", width: 40 },
      { header: "Dusun", key: "dusun", width: 20 },
    ];

    data.forEach((item) => {
      const formattedDate = item.cts
        ? moment(item.cts).tz("Asia/Jakarta").format("DD/MM/YYYY")
        : "";

      worksheet.addRow({
        cts: formattedDate,
        nik: item.nik,
        nama: item.nama,
        jenis_kelamin: item.jenis_kelamin,
        pendidikan_terakhir: item.pendidikan_terakhir,
        pekerjaan: item.pekerjaan,
        jenis_layanan: item.jenis_layanan,
        u1: item.u1,
        u2: item.u2,
        u3: item.u3,
        u4: item.u4,
        u5: item.u5,
        u6: item.u6,
        u7: item.u7,
        u8: item.u8,
        u9: item.u9,
        saran: item.saran,
        dusun: item.dusun,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=IKM_Data.xlsx");

    await workbook.xlsx.write(res);

    res.status(200).end();
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const uploadIKMDocument = async (req, res, next) => {
  try {
    const gateId = req.user.gid;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = req.uploadedFile.filepath;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);
    const dataToInsert = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const formattedDate = moment(row.getCell("B").value, "DD/MM/YYYY")
        .tz("Asia/Jakarta")
        .format(); // Default to ISO-8601

      const rowData = {
        nik: String(row.getCell("C").value) || null,
        nama: String(row.getCell("D").value) || null,
        jenis_kelamin: String(row.getCell("E").value) || null,
        no_hp: String(row.getCell("F").value) || null,
        pendidikan_terakhir: String(row.getCell("G").value) || null,
        pekerjaan: String(row.getCell("H").value) || null,
        jenis_layanan: String(row.getCell("I").value) || null,
        u1: row.getCell("J").value || null,
        u2: row.getCell("K").value || null,
        u3: row.getCell("L").value || null,
        u4: row.getCell("M").value || null,
        u5: row.getCell("N").value || null,
        u6: row.getCell("O").value || null,
        u7: row.getCell("P").value || null,
        u8: row.getCell("Q").value || null,
        u9: row.getCell("R").value || null,
        saran: String(row.getCell("S").value) || null,
        dusun: String(row.getCell("T").value) || null,
        cts: formattedDate,
        fk_gate_id: gateId,
      };

      if (rowData.nik && rowData.nama && rowData.jenis_kelamin) {
        dataToInsert.push(rowData);
      }
    });

    if (dataToInsert.length > 0) {
      await prisma.iKM.createMany({
        data: dataToInsert,
        skipDuplicates: true,
      });

      res
        .status(200)
        .json({ message: "File uploaded and data inserted successfully." });
    } else {
      res.status(400).json({ message: "No valid data to insert." });
    }
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

module.exports = {
  ikm,
  ikmById,
  filterIkm,
  tahunIkm,
  tambahIkm,
  cetakIkm,
  uploadIKMDocument,
};
