const { prisma } = require("../../../utilities/database");
const { ResponseError } = require("../../../utilities/response");
const fs = require("fs");

const get = async (req, res, next) => {
  try {
    const result = await prisma.wisbud.findMany();
    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getByDesa = async (req, res, next) => {
  try {
    const { kategori, desa, search } = req.query;
    let { limit, offset } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    if (!limit) {
      limit = 20;
    }

    if (!offset) {
      offset = 0;
    }

    const desaData = await prisma.daerah.findFirst({
      where: {
        desa: desa,
      },
      select: {
        fk_gate_id: true,
      },
    });

    if (!desaData) {
      return res.status(400).json({
        message: "Daerah is not found",
      });
    }

    const result = await prisma.wisbud.findMany({
      where: {
        fk_gate_id: desaData.fk_gate_id,
        kategori: kategori,
        nama: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: limit,
      skip: offset,
    });
    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const create = async (req, res, next) => {
  try {
    const { gid } = req.user;
    const { kategori, nama, alamat, link_gmaps, deskripsi } = req.body;
    const img = req.files;
    const fileData = [];

    const wisbud = await prisma.wisbud.findFirst({
      where: {
        nama: nama,
      },
    });

    if (wisbud) {
      return res.status(400).json({
        message: "Wisata Budaya is already exists",
      });
    }

    if (img) {
      img.forEach((file) => {
        const { filename, path } = file;
        const fileObj = { filename: filename, path: path };
        fileData.push(fileObj);
      });
    }

    await prisma.wisbud.create({
      data: {
        kategori: kategori,
        nama: nama,
        alamat: alamat,
        deskripsi: deskripsi,
        link_gmaps: link_gmaps,
        img: fileData,
        fk_gate_id: gid,
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

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { kategori, nama, alamat, link_gmaps, deskripsi } = req.body;
    const img = req.files;
    const fileData = [];

    const wisbud = await prisma.wisbud.findFirst({
      where: {
        id: id,
      },
    });

    if (!wisbud) {
      return res.status(400).json({
        message: "Wisata Budaya is not found",
      });
    }

    if (img) {
      if (wisbud.img) {
        wisbud.img.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }

      img.forEach((file) => {
        const { filename, path } = file;
        const fileObj = { filename: filename, path: path };
        fileData.push(fileObj);
      });
    }

    await prisma.wisbud.update({
      where: {
        id: id,
      },
      data: {
        kategori: kategori,
        nama: nama,
        alamat: alamat,
        link_gmaps: link_gmaps,
        deskripsi: deskripsi,
        img: fileData,
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

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const wisbud = await prisma.wisbud.findFirst({
      where: {
        id: id,
      },
    });

    if (!wisbud) {
      return res.status(400).json({
        message: "Wisata Budaya is not found",
      });
    }

    if (wisbud.img) {
      wisbud.img.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }

    await prisma.wisbud.delete({
      where: {
        id: id,
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
  getByDesa,
  create,
  update,
  remove,
};
