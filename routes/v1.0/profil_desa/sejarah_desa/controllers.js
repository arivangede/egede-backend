const { prisma } = require("../../../../utilities/database");
const { ResponseError } = require("../../../../utilities/response");
const fs = require("fs")

const getAll = async (req, res, next) => {
  try {
    const data = await prisma.sejarahDesa.findMany();
    res.status(200).json({
      message: "Successfully.",
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gate = await prisma.gate.findFirst({
      where: {
        id: id,
      },
      select: {
        flag_status: true,
      },
    });

    if (gate === true) {
      return res.status(400).json({
        message: "Gate is not active",
      });
    }

    const data = await prisma.sejarahDesa.findFirst({
      where: {
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    res.status(200).json({
      message: "Successfully.",
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const create = async (req, res, next) => {
  try {
    const { gid } = req.user
    const { deskripsi } = req.body
    const { filename, path } = req.file

    const sejarah = await prisma.sejarahDesa.findFirst({
      where: {
        id: gid
      }
    })

    if (sejarah) {
      return res.status(400).json({
        message: "Sejarah Desa is already exists"
      })
    }

    const fileData = {
      filename: filename,
      path: path
    }

    fileData.path = fileData.path.replace(/\\/g, '/')

    await prisma.sejarahDesa.create({
      data: {
        id: gid,
        deskripsi: deskripsi,
        img: fileData,
      }
    })

    res.status(200).json({ message: "Successfully." })
  } catch (error) {
    console.error('ERROR =>', error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { deskripsi } = req.body

    const sejarah = await prisma.sejarahDesa.findFirst({
      where: {
        id: id
      }
    })

    if (!sejarah) {
      return res.status(400).json({ message: "Sejarah Desa is not found" })
    }

    const updated = {}

    if (deskripsi) {
      updated.deskripsi = deskripsi
    }

    if (req.file) {
      if (sejarah.img) {
        fs.unlinkSync(sejarah.img.path);
      }

      const { filename, path } = req.file
      const filepath = path.replace(/\\/g, '/')
      updated.img = { filename: filename, path: filepath }
    }

    await prisma.sejarahDesa.update({
      where: {
        id: id
      },
      data: updated
    })

    res.status(200).json({ message: "Successfully." })
  } catch (error) {
    console.error('ERROR =>', error)
    next(new ResponseError(500, "Internal server error"))
  }
}

const remove = async (req, res, next) => {
  try {
    const { id } = req.params

    const sejarah = await prisma.sejarahDesa.findFirst({
      where: {
        id: id
      }
    })

    if (!sejarah) {
      return res.status(400).json({ message: "Sejarah Desa not found" })
    }

    if (sejarah.img) {
      fs.unlinkSync(sejarah.img.path);
    }

    await prisma.sejarahDesa.delete({
      where: {
        id: id,
      }
    })

    res.status(200).json({ message: "Successfully." });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
