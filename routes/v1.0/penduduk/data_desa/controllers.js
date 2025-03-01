const { prisma } = require("../../../../utilities/database");
const { ResponseError } = require("../../../../utilities/response");

const totalPenduduk = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
      select: {
        id: true,
      },
    });

    if (daerah.length === 0) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);

    const result = await prisma.penduduk.count({
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    res.status(200).json({
      message: "Successfully.",
      data: {
        penduduk_total: result,
      },
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const agama = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
    });

    if (daerah.length === 0) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);

    const agamas = await prisma.penduduk.groupBy({
      by: ["agama"],
      _count: {
        id: true,
      },
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    const result = agamas.map((data) => ({
      label: data.agama,
      value: data._count.id,
    }));

    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const jenisKelamin = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
    });

    if (daerah.length === 0) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);

    const jks = await prisma.penduduk.groupBy({
      by: ["jenis_kelamin"],
      _count: {
        id: true,
      },
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    const result = jks.map((data) => ({
      label: data.jenis_kelamin,
      value: data._count.id,
    }));

    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const pekerjaan = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
    });

    if (daerah.length === 0) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);

    const pks = await prisma.penduduk.groupBy({
      by: ["pekerjaan"],
      _count: {
        id: true,
      },
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    const result = pks.map((data) => ({
      label: data.pekerjaan,
      value: data._count.id,
    }));

    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const sukuBangsa = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
    });

    if (daerah.length === 0) {
      return res.status.json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);

    const sbs = await prisma.penduduk.groupBy({
      by: ["suku_bangsa"],
      _count: {
        id: true,
      },
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    const result = sbs.map((data) => ({
      label: data.suku_bangsa,
      value: data._count.id,
    }));

    res.status(200).json({
      message: "Successfully",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const pendidikan = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
    });

    if (daerah.length === 0) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);

    const pds = await prisma.penduduk.groupBy({
      by: ["pendidikan_terakhir"],
      _count: {
        id: true,
      },
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    const result = pds.map((data) => ({
      label: data.pendidikan_terakhir,
      value: data._count.id,
    }));

    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const statusPernikahan = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
    });

    if (daerah.length === 0) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);

    const sps = await prisma.penduduk.groupBy({
      by: ["status_nikah"],
      _count: {
        id: true,
      },
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    const result = sps.map((data) => ({
      label: data.status_nikah,
      value: data._count.id,
    }));

    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const usia = async (req, res, next) => {
  try {
    const { desa } = req.query;

    if (!desa) {
      return res.status(400).json({
        message: "Desa field is required",
      });
    }

    const daerah = await prisma.daerah.findMany({
      where: {
        desa: desa,
      },
    });

    if (daerah.length === 0) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const daerahIds = daerah.map((daerah) => daerah.id);
    const today = new Date();

    const penduduk = await prisma.penduduk.findMany({
      where: {
        OR: daerahIds.map((daerahId) => ({
          fk_daerah_id: daerahId,
        })),
      },
    });

    const kategoriUsia = [
      "lansia",
      "pensiun",
      "pra-pensiun",
      "paruh-baya",
      "pekerja-awal",
      "muda",
      "anak-anak",
    ];

    const jumlahPenduduk = kategoriUsia.reduce((acc, kategori) => {
      acc[kategori] = 0;
      return acc;
    }, {});

    penduduk.forEach((individu) => {
      const tanggal_lahir = new Date(individu.tanggal_lahir);
      const timeDiff = Math.abs(today.getTime() - tanggal_lahir.getTime());
      const umur = Math.floor(timeDiff / (1000 * 3600 * 24 * 365.25));

      if (umur >= 65) {
        jumlahPenduduk["lansia"]++;
      } else if (umur >= 55) {
        jumlahPenduduk["pensiun"]++;
      } else if (umur >= 45) {
        jumlahPenduduk["pra-pensiun"]++;
      } else if (umur >= 35) {
        jumlahPenduduk["paruh-baya"]++;
      } else if (umur >= 25) {
        jumlahPenduduk["pekerja-awal"]++;
      } else if (umur >= 15) {
        jumlahPenduduk["muda"]++;
      } else {
        jumlahPenduduk["anak-anak"]++;
      }
    });

    const result = kategoriUsia.map((kategori) => ({
      label: kategori,
      value: jumlahPenduduk[kategori],
    }));

    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

module.exports = {
  totalPenduduk,
  agama,
  jenisKelamin,
  pekerjaan,
  sukuBangsa,
  pendidikan,
  statusPernikahan,
  usia,
};
