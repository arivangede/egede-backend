const { prisma } = require("../../../utilities/database");
const { ResponseError } = require("../../../utilities/response");
const fs = require("fs");

const get = async (req, res, next) => {
  try {
    const result = await prisma.regulasi.findMany();
    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getByGate = async (req, res, next) => {
  try {
    const { gid } = req.body;

    const gate = await prisma.gate.findFirst({
      where: {
        id: gid,
      },
    });

    if (!gate) {
      return res.status(400).json({
        message: "Gate is not found",
      });
    }

    let parameters = {
      fk_gate_id: gid,
    };

    if (req.query.status !== "") {
      parameters.status = req.query.status;
    }

    if (req.query.kategori !== "") {
      parameters.kategori = req.query.kategori;
    }

    if (req.query.search) {
      parameters.OR = [
        {
          kategori: {
            contains: req.query.search,
            mode: "insensitive",
          },
        },
        {
          no_regulasi: {
            contains: req.query.search,
            mode: "insensitive",
          },
        },
        {
          tahun: {
            contains: req.query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    let { limit, offset, sortBy } = req.query;
    limit = parseInt(limit) || 5; // Default limit
    offset = parseInt(offset) || 0; // Default offset
    sortBy = sortBy === "terlama" ? "asc" : "desc"; // Default sorting

    if (!["terbaru", "terlama", undefined].includes(req.query.sortBy)) {
      return res.status(400).json({
        message: "sortBy is not valid",
      });
    }

    const counter = await prisma.regulasi.count({
      where: parameters,
    });

    const data = await prisma.regulasi.findMany({
      where: parameters,
      take: limit,
      skip: offset,
      orderBy: {
        id: sortBy,
      },
    });

    res.status(200).json({
      message: "Successfully.",
      jumlah: counter,
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;

    let regulasi;
    if (isNaN(id)) {
      regulasi = await prisma.regulasi.findFirst({
        where: {
          kode: id,
        },
      });
    } else {
      regulasi = await prisma.regulasi.findFirst({
        where: {
          kode: parseInt(id),
        },
      });
    }

    if (!regulasi) {
      return res.status(400).json({
        message: "Regulasi data is not found",
      });
    }

    res.status(200).json({
      message: "Successfully.",
      data: regulasi,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getTotalsByGate = async (req, res, next) => {
  try {
    const { gid } = req.user;

    const total = await prisma.regulasi.count({
      where: {
        fk_gate_id: gid,
      },
    });

    const perkel = await prisma.regulasi.count({
      where: {
        fk_gate_id: gid,
        kategori: "perkel",
      },
    });

    const perdes = await prisma.regulasi.count({
      where: {
        fk_gate_id: gid,
        kategori: "perdes",
      },
    });

    const berlaku = await prisma.regulasi.count({
      where: {
        fk_gate_id: gid,
        status: "berlaku",
      },
    });

    const tidakBerlaku = await prisma.regulasi.count({
      where: {
        fk_gate_id: gid,
        status: "tidak berlaku",
      },
    });

    res.status(200).json({
      message: "Successfully.",
      total: total,
      perdes: perdes,
      perkel: perkel,
      berlaku: berlaku,
      tidakBerlaku: tidakBerlaku,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const create = async (req, res, next) => {
  try {
    const { gid } = req.user;
    const data = req.body;

    if (req.file) {
      const { filename, path } = req.file;
      data.dokumen = { filename: filename, path: path };
    }

    data.penetapan = new Date(data.penetapan);
    data.pengundangan = new Date(data.pengundangan);

    if (data.keterangan) {
      data.keterangan = JSON.parse(data.keterangan);
    }

    const result = await prisma.regulasi.create({
      data: {
        ...data,
        fk_gate_id: gid,
      },
    });

    res.status(200).json({
      message: "Successfully.",
      data: {
        id: result.id,
      },
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = req.body;

    let regulasi;
    if (isNaN(id)) {
      regulasi = await prisma.regulasi.findFirst({
        where: {
          kode: id,
        },
      });
    } else {
      regulasi = await prisma.regulasi.findFirst({
        where: {
          id: parseInt(id),
        },
      });
    }

    if (!regulasi) {
      return res.status(400).json({
        message: "Regulasi is not found",
      });
    }

    if (req.file) {
      if (regulasi.dokumen) {
        fs.unlinkSync(regulasi.dokumen.path);
      }

      const { filename, path } = req.file;
      updated.dokumen = { filename: filename, path: path };
    }

    if (updated.penetapan) {
      updated.penetapan = new Date(updated.penetapan);
    }
    if (updated.pengundangan) {
      updated.pengundangan = new Date(updated.pengundangan);
    }
    if (updated.keterangan) {
      updated.keterangan = JSON.parse(updated.keterangan);
    }

    await prisma.regulasi.update({
      where: {
        id: regulasi.id,
      },
      data: updated,
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    let regulasi;
    if (isNaN(id)) {
      regulasi = await prisma.regulasi.findFirst({
        where: {
          kode: id,
        },
      });
    } else {
      regulasi = await prisma.regulasi.findFirst({
        where: {
          id: parseInt(id),
        },
      });
    }

    if (!regulasi) {
      return res.status(400).json({
        message: "Regulasi is not found",
      });
    }

    await prisma.regulasi.delete({
      where: {
        id: regulasi.id,
      },
    });

    res.status(200).json({
      message: "Successfully",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

module.exports = {
  get,
  getByGate,
  getById,
  getTotalsByGate,
  create,
  update,
  remove,
};
