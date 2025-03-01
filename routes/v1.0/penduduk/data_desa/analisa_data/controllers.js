const { prisma } = require("../../../../../utilities/database");
const { ResponseError } = require("../../../../../utilities/response");

const getFilter = async (req, res, next) => {
  try {
    const { gid } = req.user;

    const daerah = await prisma.daerah.findMany({
      where: {
        fk_gate_id: gid,
      },
      select: {
        id: true,
        dusun: true,
      },
    });

    const daerahIds = daerah.map((daerah) => daerah.id);

    const filters = {};

    const dusun = await prisma.daerah.findMany({
      where: {
        fk_gate_id: gid,
      },
      select: {
        dusun: true,
      },
      distinct: ["dusun"],
    });

    filters["dusun"] = dusun.map((data) => ({
      label: data.dusun,
      value: data.dusun,
    }));

    const filterQueries = [
      { name: "jenis_kelamin", select: "jenis_kelamin" },
      { name: "pekerjaan", select: "pekerjaan" },
      { name: "sukuBangsa", select: "suku_bangsa" },
      { name: "statusPernikahan", select: "status_nikah" },
      { name: "agama", select: "agama" },
      { name: "warga_negara", select: "kewarganegaraan" },
      { name: "pendidikan", select: "pendidikan_terakhir" },
    ];

    for (const query of filterQueries) {
      const distinctValues = await prisma.penduduk.findMany({
        where: {
          OR: daerahIds.map((daerahId) => ({
            fk_daerah_id: daerahId,
          })),
        },
        select: {
          [query.select]: true,
        },
        distinct: [query.select],
      });

      // Mendaftarkan filter dan memetakan ke format {label, value}
      filters[query.name] = distinctValues.map((data) => ({
        label: data[query.select],
        value: data[query.select],
      }));
    }

    res.status(200).json({
      message: "Successfully.",
      data: filters,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getPenduduk = async (req, res, next) => {
  try {
    const { gid } = req.user;
    const { ds, jk, pk, sb, sp, ag, wn, pd, tanggal, targetUsia, search } =
      req.query;

    let { limit, offset } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const daerah = await prisma.daerah.findMany({
      where: {
        fk_gate_id: gid,
        dusun: ds || undefined,
      },
    });

    const daerahIds = daerah.map((daerah) => daerah.id);

    const searchFilter = search
      ? {
          OR: [
            { nama_lengkap: { contains: search, mode: "insensitive" } },
            { nik: { contains: search, mode: "insensitive" } },
            { alamat: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const commonWhereClause = {
      AND: [
        daerahIds.length
          ? { OR: daerahIds.map((daerahId) => ({ fk_daerah_id: daerahId })) }
          : undefined,
        jk ? { jenis_kelamin: jk } : undefined,
        pk ? { pekerjaan: pk } : undefined,
        sb ? { suku_bangsa: sb } : undefined,
        sp ? { status_nikah: sp } : undefined,
        ag ? { agama: ag } : undefined,
        wn ? { kewarganegaraan: wn } : undefined,
        pd ? { pendidikan_terakhir: pd } : undefined,
        searchFilter,
      ].filter(Boolean), // Remove undefined elements
    };

    let result;
    let totalResults;

    if (!targetUsia && !tanggal) {
      result = await prisma.penduduk.findMany({
        where: commonWhereClause,
        include: {
          pengguna: {
            select: {
              pengguna: true,
            },
          },
        },
        take: limit,
        skip: offset,
      });

      totalResults = await prisma.penduduk.count({
        where: commonWhereClause,
      });
    } else if (targetUsia && targetUsia.includes("-") && tanggal) {
      let minUsia, maxUsia;

      const [minStr, maxStr] = targetUsia.split("-");
      minUsia = parseInt(minStr);
      maxUsia = parseInt(maxStr) + 1;

      const minTanggalLahir = new Date(tanggal);
      minTanggalLahir.setFullYear(minTanggalLahir.getFullYear() - maxUsia);

      const maxTanggalLahir = new Date(tanggal);
      maxTanggalLahir.setFullYear(maxTanggalLahir.getFullYear() - minUsia);

      result = await prisma.penduduk.findMany({
        where: {
          ...commonWhereClause,
          tanggal_lahir: { gte: minTanggalLahir, lt: maxTanggalLahir },
        },
        include: {
          pengguna: {
            select: {
              pengguna: true,
            },
          },
        },
        take: limit,
        skip: offset,
      });

      totalResults = await prisma.penduduk.count({
        where: {
          ...commonWhereClause,
          tanggal_lahir: { gte: minTanggalLahir, lt: maxTanggalLahir },
        },
      });
    } else if (targetUsia && !targetUsia.includes("-") && tanggal) {
      const usiaTarget = parseInt(targetUsia);
      const minTanggalLahir = new Date(tanggal);
      minTanggalLahir.setFullYear(
        minTanggalLahir.getFullYear() - (usiaTarget + 1)
      );

      const maxTanggalLahir = new Date(tanggal);
      maxTanggalLahir.setFullYear(maxTanggalLahir.getFullYear() - usiaTarget);

      result = await prisma.penduduk.findMany({
        where: {
          ...commonWhereClause,
          tanggal_lahir: { gte: minTanggalLahir, lt: maxTanggalLahir },
        },
        include: {
          pengguna: {
            select: {
              pengguna: true,
            },
          },
        },
        take: limit,
        skip: offset,
      });

      totalResults = await prisma.penduduk.count({
        where: {
          ...commonWhereClause,
          tanggal_lahir: { gte: minTanggalLahir, lt: maxTanggalLahir },
        },
      });
    } else {
      return res.status(400).json({
        message: "Input Prediksi Usia Tidak Valid",
      });
    }

    res.status(200).json({
      message: "Successfully.",
      total: totalResults,
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const penduduk = await prisma.penduduk.findFirst({
      where: {
        id: id,
      },
      include: {
        daerah: {
          select: {
            kota: true,
            kecamatan: true,
            desa: true,
            dusun: true,
          },
        },
        pengguna: {
          select: {
            pengguna: true,
          },
        },
      },
    });

    if (!penduduk) {
      return res.status(400).json({
        message: "Penduduk data is not found",
      });
    }

    const keluarga = await prisma.penduduk.findMany({
      where: {
        no_kk: penduduk.no_kk,
        NOT: {
          id: id,
        },
      },
      include: {
        pengguna: {
          select: {
            pengguna: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Successfully.",
      data: {
        penduduk: penduduk,
        keluarga: keluarga,
      },
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

module.exports = {
  getFilter,
  getPenduduk,
  getDetails,
};
