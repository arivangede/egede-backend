const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");
const fs = require("fs");

const getAll = async (req, res, next) => {
  try {
    let { limit, offset } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const data = await prisma.enews.findMany({
      take: limit || 10,
      skip: offset || 0,
    });
    res.status(200).json({
      message: "Successfully.",
      limit: limit,
      offset: offset,
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getByDesa = async (req, res, next) => {
  try {
    const { gid } = req.user;

    const gate = await prisma.gate.findFirst({
      where: {
        id: gid,
      },
      select: {
        flag_status: true,
      },
    });

    if (gate && gate.flag_status) {
      return res.status(400).json({
        message: "Gate is not active",
      });
    }

    let parameters = {};
    parameters.fk_gate_id = gid;
    parameters.kategori = req.query.kategori;

    if (req.query.search) {
      parameters = {
        ...parameters,
        judul: {
          contains: req.query.search,
          mode: "insensitive", // Pencarian case-insensitive
        },
      };
    }

    let sortBy = req.query.sort;
    if (sortBy === "terbaru") {
      sortBy = "desc";
    } else if (sortBy === "terlama") {
      sortBy = "asc";
    } else if (!sortBy) {
      sortBy = "desc";
    } else {
      return res.status(400).json({
        message: "sort query is not valid",
      });
    }

    let { limit, offset } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const counter = await prisma.enews.count({
      where: parameters,
    });

    const data = await prisma.enews.findMany({
      where: parameters,
      orderBy: {
        id: sortBy,
      },
      take: limit,
      skip: offset,
    });

    res.status(200).json({
      message: "Successfully.",
      jumlah: counter,
      limit: limit,
      offset: offset,
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getTotalEnewsByDesa = async (req, res, next) => {
  try {
    const { gid } = req.user;
    const { kategori } = req.query;

    const enews = await prisma.enews.count({
      where: {
        fk_gate_id: gid,
        kategori: kategori,
      },
    });

    res.status(200).json({
      message: "Successfully",
      total: enews,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let enews;

    if (isNaN(parseInt(id))) {
      enews = await prisma.enews.findFirst({
        where: {
          kode: id,
        },
      });
    } else {
      enews = await prisma.enews.findFirst({
        where: {
          id: parseInt(id),
        },
      });
    }

    if (!enews) {
      return res.status(404).json({
        message: "Enews is not found",
      });
    }

    res.status(200).json({
      message: "Successfully.",
      data: enews,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const createBerita = async (req, res, next) => {
  try {
    const { gid } = req.user;
    const { judul, kategori, deskripsi } = req.body;

    const files = req.files;

    const filesData = [];

    files.forEach((file) => {
      const { filename, path } = file;
      const fileObj = { filename: filename, path: path };
      filesData.push(fileObj);
    });

    await prisma.enews.create({
      data: {
        judul: judul,
        kategori: kategori,
        deskripsi: deskripsi,
        file: filesData,
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

const createPengumuman = async (req, res, next) => {
  try {
    const { gid } = req.user;
    const { judul, kategori, deskripsi } = req.body;

    const files = req.files;

    const filesData = [];

    files.forEach((file) => {
      const { filename, path } = file;
      const fileObj = { filename: filename, path: path };
      filesData.push(fileObj);
    });

    await prisma.enews.create({
      data: {
        judul: judul,
        kategori: kategori,
        deskripsi: deskripsi,
        file: filesData,
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

const edit = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { judul, kategori, deskripsi } = req.body;
    let updatedData = { judul, kategori, deskripsi };

    const isExists = await prisma.enews.findFirst({
      where: {
        id: id,
      },
    });

    if (!isExists) {
      return res.status(200).json({
        errors: "Berita not found",
      });
    }

    if (req.files && req.files.length > 0) {
      const enews = await prisma.enews.findUnique({
        where: {
          id: id,
        },
      });

      if (enews && enews.file) {
        enews.file.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }

      const newFiles = req.files.map((file) => {
        const { filename, path } = file;
        const newFilePath = `static/enews/${kategori}/${filename}`;
        fs.renameSync(path, newFilePath);
        return { filename: filename, path: newFilePath };
      });
      updatedData.file = newFiles;
    }

    await prisma.enews.update({
      where: {
        id: id,
      },
      data: updatedData,
    });

    res.status(200).json({
      message: "Successfully updated.",
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const editEnewsFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filenames } = req.body;

    const enews = await prisma.enews.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!enews) {
      return res.status(404).json({
        message: "Enews is not Found",
      });
    }

    if (!filenames || filenames.length === 0) {
      return res.status(400).json({ error: "Theres no filename received" });
    }

    const remainingFiles = enews.file.filter(
      (file) => !filenames.includes(file.filename)
    );

    filenames.forEach((filename) => {
      const fileToRemove = enews.file.find(
        (file) => file.filename === filename
      );
      if (fileToRemove) {
        try {
          fs.unlinkSync(fileToRemove.path);
          console.log(`File ${fileToRemove.filename} deleted successfully`);
        } catch (error) {
          console.error(`Error deleting file ${fileToRemove.filename}:`, error);
        }
      }
    });

    await prisma.enews.update({
      where: {
        id: parseInt(id),
      },
      data: {
        file: {
          set: remainingFiles,
        },
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

    const enews = await prisma.enews.findFirst({
      where: {
        id: id,
      },
    });

    if (!enews) {
      return res.status(400).json({
        errors: "Enews is not found",
      });
    }

    if (enews.file && enews.file.length > 0) {
      enews.file.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error(`Error deleting file ${file.filename}:`, error);
        }
      });
    }

    const likes = await prisma.likeEnews.findMany({
      where: {
        fk_enews_id: id,
      },
    });

    if (likes.length > 0) {
      await prisma.likeEnews.deleteMany({
        where: {
          fk_enews_id: id,
        },
      });
    }

    const bookmarks = await prisma.bookmarkEnews.findMany({
      where: {
        fk_enews_id: id,
      },
    });

    if (bookmarks.length > 0) {
      await prisma.bookmarkEnews.deleteMany({
        where: {
          fk_enews_id: id,
        },
      });
    }

    await prisma.enews.delete({
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
  getAll,
  getByDesa,
  getTotalEnewsByDesa,
  getById,
  createBerita,
  createPengumuman,
  edit,
  editEnewsFile,
  remove,
};
