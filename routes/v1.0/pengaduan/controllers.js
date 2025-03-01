const { prisma } = require("../../../utilities/database");
const { ResponseError } = require("../../../utilities/response");

const getAll = async (req, res, next) => {
  try {
    const result = await prisma.pengaduan.findMany();

    res.status(200).json({
      message: "Successfully",
      result: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getByUserLogin = async (req, res, next) => {
  try {
    const { gid } = req.user

    const daerahList = await prisma.daerah.findMany({
      where: {
        fk_gate_id: gid
      },
      select: {
        id: true
      }
    })

    const daerahIds = daerahList.map(daerah => daerah.id)

    if (daerahIds.length === 0) {
      return res.status(200).json({
        message: "Belum ada data pengaduan untuk gate ini",
        total: 0,
        result: [],
      })
    }

    const pengaduan = await prisma.pengaduan.findMany({
      where: {
        fk_daerah_id: {
          in: daerahIds
        }
      }
    })

    res.status(200).json({
      message: "Successfully.",
      total: pengaduan.length,
      result: pengaduan,
    })
  } catch (error) {
    console.error("ERROR =>", error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const getCountByStatus = async (req, res, next) => {
  try {
    const { gid } = req.user

    const daerahList = await prisma.daerah.findMany({
      where: { fk_gate_id: gid },
      select: { id: true }
    })

    const daerahIds = daerahList.map(daerah => daerah.id)

    if (daerahIds.length === 0) {
      return res.status(200).json({
        message: "Belum ada data pengaduan untuk gate ini",
        total: 0,
        counts: {
          Belum_Verifikasi: 0,
          Ditolak: 0,
          Menunggu: 0,
          Dikerjakan: 0,
          Selesai: 0
        }
      })
    }

    const countByStatus = await prisma.pengaduan.groupBy({
      by: ['status_riwayat_terbaru'],
      where: {
        fk_daerah_id: { in: daerahIds }
      },
      _count: {
        status_riwayat_terbaru: true
      }
    });

    const counts = {
      Belum_Verifikasi: 0,
      Ditolak: 0,
      Menunggu: 0,
      Dikerjakan: 0,
      Selesai: 0
    };

    countByStatus.forEach(status => {
      counts[status.status_riwayat_terbaru.replace(/\s/g, '_')] = status._count.status_riwayat_terbaru;
    });

    res.status(200).json({
      message: "Successfully",
      total: countByStatus.reduce((sum, status) => sum + status._count.status_riwayat_terbaru, 0),
      counts
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

const filter = async (req, res, next) => {
  try {
    const { gid } = req.user
    const {
      offset = 0,
      limit = 5,
      sortBy = "asc",
      search,
      daerah,
      kategori,
      startDate,
      endDate,
      status
    } = req.query

    let whereClause = {}

    const daerahList = await prisma.daerah.findMany({
      where: { fk_gate_id: gid },
      select: { id: true }
    })

    const daerahIds = daerahList.map(daerah => daerah.id)

    if (daerahIds.length === 0) {
      return res.status(200).json({
        message: "Belum ada data pengaduan untuk gate ini",
        total: 0,
        result: [],
      })
    }

    whereClause.fk_daerah_id = { in: daerahIds }

    if (search) {
      whereClause.OR = [{ judul: { contains: search, mode: "insensitive" } }]
    }

    if (daerah) {
      whereClause.fk_daerah_id = parseInt(daerah)
    }

    if (kategori) {
      whereClause.kategori = kategori
    }

    if (startDate && endDate) {
      whereClause.cts = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (status) {
      whereClause.status_riwayat_terbaru = status
    }

    const pengaduanCount = await prisma.pengaduan.count({
      where: whereClause,
    })

    if (pengaduanCount === 0) {
      return res.status(200).json({
        message: "Belum ada data pengaduan",
        total: 0,
        result: [],
      })
    }

    const result = await prisma.pengaduan.findMany({
      where: whereClause,
      orderBy: {
        cts: sortBy === "Terbaru" ? "desc" : "asc",
      },
      skip: parseInt(offset),
      take: parseInt(limit),
    })

    res.status(200).json({
      message: "Successfully",
      total: pengaduanCount,
      result: result,
    })
  } catch (error) {
    console.error("ERROR =>", error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const create = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const { judul, kategori, deskripsi, lokasi } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const { filename, path } = req.file;

    const pengguna = await prisma.penggunaPribadi.findFirst({
      where: { id: rnd },
    });

    if (!pengguna) {
      return res.status(404).json({ message: "Pengguna is not found" });
    }

    const penduduk = await prisma.penduduk.findFirst({
      where: { id: pengguna.fk_penduduk_id },
      include: { daerah: true },
    });

    if (!penduduk) {
      return res.status(404).json({ message: "Penduduk is not found" });
    }

    const gate = await prisma.gate.findFirst({
      where: { id: penduduk.daerah.fk_gate_id },
    });

    if (!gate) {
      return res.status(404).json({ message: "Gate is not found" });
    } else if (gate.flag_status == true) {
      return res.status(400).json({ message: "Gate is not active" });
    }

    const fileData = {
      filename: filename,
      path: path.replace(/\\/g, "/"),
    };

    const defaultStatus = [
      {
        status: "Belum Verifikasi",
        cts: new Date(),
      },
    ];

    await prisma.pengaduan.create({
      data: {
        judul: judul,
        kategori: kategori,
        deskripsi: deskripsi,
        lokasi: JSON.parse(lokasi),
        file: fileData,
        status_riwayat: defaultStatus,
        status_riwayat_terbaru: "Belum Verifikasi",
        fk_daerah_id: penduduk.fk_daerah_id,
        fk_gate_id: gate.id,
        fk_pengguna_id: pengguna.id,
      },
    });

    return res.status(200).json({ message: "Successfully." });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const approve = async (req, res, next) => {
  try {
    const { id } = req.params

    const pengaduan = await prisma.pengaduan.findFirst({
      where: { id }
    })

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan is not found" })
    }

    const defaultStatus = {
      status: "Menunggu",
      cts: new Date()
    }

    await prisma.pengaduan.update({
      where: { id },
      data: {
        status_riwayat: {
          push: defaultStatus
        },
        status_riwayat_terbaru: defaultStatus.status,
        isVerificated: true
      }
    })

    return res.status(200).json({ message: "Successfully." })
  } catch (error) {
    console.error("ERROR =>", error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const rejected = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const pengaduan = await prisma.pengaduan.findFirst({
      where: { id }
    })

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan is not found" })
    }

    const defaultStatus = {
      status: "Ditolak",
      keterangan: data.keterangan,
      cts: new Date()
    }

    await prisma.pengaduan.update({
      where: { id },
      data: {
        status_riwayat: {
          push: defaultStatus
        },
        status_riwayat_terbaru: defaultStatus.status,
        isVerificated: true
      }
    })

    return res.status(200).json({ message: "Successfully." })
  } catch (error) {
    console.error("ERROR =>", error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const switchAssignment = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const { pengaduan_id } = req.params;
    const { daerah_id } = req.body;

    const pengguna = await prisma.penggunaUmum.findFirst({
      where: {
        id: rnd,
      },
    });

    if (!pengguna) {
      return res.status(404).json({
        message: "Pengguna is not found",
      });
    } else if (pengguna.fk_peran_id !== 5) {
      return res.status(400).json({
        message: "Pengguna is not Kepala Dusun",
      });
    }

    const pengaduan = await prisma.pengaduan.findFirst({
      where: {
        id: pengaduan_id,
      },
    });

    if (!pengaduan) {
      return res.status(404).json({
        message: "Pengaduan is not found",
      });
    }

    const old_daerah = await prisma.daerah.findFirst({
      where: {
        id: pengaduan.fk_daerah_id,
      },
    });

    const new_daerah = await prisma.daerah.findFirst({
      where: {
        id: daerah_id,
      },
    });

    if (!new_daerah) {
      return res.status(404).json({
        message: "Daerah is not found",
      });
    }

    const alihTugasStatus = {
      status: "Alih Tugas",
      keterangan: `Tugas dialihkan dari pemangku kebijakan Dusun ${old_daerah.dusun}, Desa ${old_daerah.desa}, Kecamatan ${old_daerah.kecamatan}, Kota ${old_daerah.kota}. ke pemangku kebijakan Dusun ${new_daerah.dusun}, Desa ${new_daerah.desa}, Kecamatan ${new_daerah.kecamatan}, Kota ${new_daerah.kota}`,
      cts: new Date(),
    };

    const old_gate = await prisma.gate.findFirst({
      where: {
        id: pengaduan.fk_gate_id,
      },
    })

    const new_gate = await prisma.gate.findFirst({
      where: {
        id: new_daerah.fk_gate_id,
      },
    })

    if (old_gate.id === new_gate.id) {
      await prisma.pengaduan.update({
        where: {
          id: pengaduan_id,
        },
        data: {
          fk_daerah_id: daerah_id,
          status_riwayat: {
            push: alihTugasStatus,
          },
          status_riwayat_terbaru: alihTugasStatus.status,
          isVerificated: false
        },
      })
    } else {
      await prisma.pengaduan.update({
        where: {
          id: pengaduan_id,
        },
        data: {
          fk_daerah_id: daerah_id,
          status_riwayat: {
            push: alihTugasStatus,
          },
          status_riwayat_terbaru: alihTugasStatus.status,
          fk_gate_id: new_gate.id,
          isVerificated: false
        },
      })
    }

    res.status(200).json({
      message: "Successfully.",
    })
  } catch (error) {
    console.error("ERROR =>", error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const inProgress = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body

    const pengaduan = await prisma.pengaduan.findFirst({
      where: { id }
    })

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan is not found" })
    }

    let fileData = null

    if (req.file) {
      const { filename, path } = req.file;

      fileData = {
        filename: filename,
        path: path.replace(/\\/g, "/"),
      };
    }

    const statusDikerjakan = {
      status: "Dikerjakan",
      tanggapan: data.tanggapan,
      file: fileData,
      cts: new Date()
    }

    await prisma.pengaduan.update({
      where: { id },
      data: {
        status_riwayat: {
          push: statusDikerjakan
        },
        status_riwayat_terbaru: statusDikerjakan.status
      }
    })

    res.status(200).json({ message: "Successfully." })
  } catch (error) {
    console.error("ERROR =>", error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const finish = async (req, res, next) => {
  try {
    const { id } = req.params

    const pengaduan = await prisma.pengaduan.findFirst({
      where: { id }
    })

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan is not found" })
    }

    const statusSelesai = {
      status: "Selesai",
      cts: new Date()
    }

    await prisma.pengaduan.update({
      where: { id },
      data: {
        status_riwayat: {
          push: statusSelesai
        },
        status_riwayat_terbaru: statusSelesai.status
      }
    })

    res.status(200).json({ message: "Successfully." })
  } catch (error) {
    console.error("ERROR =>", error)
    next(new ResponseError(500, "Internal server error"))
  }
}

module.exports = {
  getAll,
  getByUserLogin,
  getCountByStatus,
  filter,
  create,
  approve,
  rejected,
  switchAssignment,
  inProgress,
  finish
};
