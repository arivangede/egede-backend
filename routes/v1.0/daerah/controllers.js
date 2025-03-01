const { prisma } = require("../../../utilities/database");
const { ResponseError } = require("../../../utilities/response");

const get = async (req, res, next) => {
  try {
    const data = await prisma.daerah.findMany();
    res.status(200).json({
      message: "Successfully.",
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getDesaNameByGate = async (req, res, next) => {
  try {
    const gate = req.params.gate;

    const daerah = await prisma.daerah.findFirst({
      where: {
        fk_gate_id: gate,
      },
      select: {
        desa: true,
        kecamatan: true,
      },
    });

    if (!daerah) {
      return res.status(400).json({ message: "Daerah is not found" });
    }

    res.status(200).json({ desa: daerah.desa, kecamatan: daerah.kecamatan });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getNamaDesaList = async (req, res, next) => {
  try {
    const daerah = await prisma.daerah.findMany();

    const desaList = [...new Set(daerah.map((item) => item.desa))];

    res.status(200).json({
      message: "Successfully",
      data: desaList,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const create = async (req, res, next) => {
  try {
    const { kota, kecamatan, desa, dusun } = req.body;

    const r_desa = desa.replace(/\s/g, "");
    const r_kecamatan = kecamatan.replace(/\s/g, "");
    const r_kota = kota.replace(/\s/g, "");

    const gatename = [r_desa, r_kecamatan, r_kota]
      .map((word) => word.toLowerCase())
      .join(" ");

    const gate = await prisma.gate.findFirst({
      where: {
        judul: gatename,
      },
      select: {
        id: true,
      },
    });

    let gateId;

    if (!gate) {
      const newGate = await prisma.gate.create({
        data: {
          judul: gatename,
        },
        select: {
          id: true,
        },
      });

      gateId = newGate.id;
    } else {
      gateId = gate.id;
    }

    const DaerahCount = await prisma.daerah.count({
      where: {
        kota: kota,
        kecamatan: kecamatan,
        desa: desa,
        dusun: dusun,
      },
    });

    if (DaerahCount === 1) {
      return res.status(400).json({
        message: "This daerah data is already exists",
      });
    }

    await prisma.daerah.create({
      data: {
        kota: kota,
        kecamatan: kecamatan,
        desa: desa,
        dusun: dusun,
        fk_gate_id: gateId,
      },
    });

    res.status(200).json({
      message: "Succesfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const update = async (req, res, next) => {
  try {
    const daerahId = parseInt(req.params.id);
    const { kota, kecamatan, desa, dusun } = req.body;

    const isDaerahExists = await prisma.daerah.findFirst({
      where: {
        id: daerahId,
      },
    });

    if (!isDaerahExists) {
      return res.status(400).json({
        message: "Daerah not found",
      });
    }

    const data = {};

    if (kota) {
      data.kota = kota;
    }
    if (kecamatan) {
      data.kecamatan = kecamatan;
    }
    if (desa) {
      data.desa = desa;
    }
    if (dusun) {
      data.dusun = dusun;
    }

    await prisma.daerah.update({
      where: {
        id: daerahId,
      },
      data: data,
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
    const daerahId = parseInt(req.params.id);

    const isDaerahExists = await prisma.daerah.findFirst({
      where: {
        id: daerahId,
      },
    });

    if (!isDaerahExists) {
      return res.status(400).json({
        message: "Daerah not found",
      });
    }

    await prisma.daerah.delete({
      where: {
        id: daerahId,
      },
    });
    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

module.exports = {
  get,
  getDesaNameByGate,
  getNamaDesaList,
  create,
  update,
  remove,
};
