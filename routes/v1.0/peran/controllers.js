const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");
const bcrypt = require("bcrypt");

const peran = async (req, res, next) => {
  try {
    let data = [];

    data = await prisma.peran.findMany();
    res.status(200).json({ message: "Successfully.", data: data });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const tambahPeran = async (req, res, next) => {
  try {
    const data = req.body;

    const existingRole = await prisma.peran.findFirst({
      where: {
        nama_peran: data.nama_peran,
      },
    });

    if (existingRole) {
      return res.status(400).json({ message: "This name is already exists" });
    }

    await prisma.peran.create({
      data: {
        nama_peran: data.nama_peran,
      },
    });

    res.status(200).json({ message: "Successfully." });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const editPeran = async (req, res, next) => {
  try {
    const data = req.body;
    const roleId = parseInt(req.params.id);

    const existingRole = await prisma.peran.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!existingRole) {
      return res.status(404).json({ message: "Role not found." });
    }

    await prisma.peran.update({
      where: {
        id: roleId,
      },
      data: {
        nama_peran: data.nama_peran,
      },
    });

    res.status(200).json({ message: "Successfully." });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const deletePeran = async (req, res, next) => {
  try {
    const roleId = parseInt(req.params.id);

    const peran = await prisma.peran.findFirst({
      where: {
        id: roleId,
      },
    });

    if (!peran) {
      return res.status(400).json({
        message: "Peran is not found",
      });
    }

    await prisma.peran.delete({
      where: {
        id: roleId,
      },
    });

    res.status(200).json({ message: "Successfully." });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

module.exports = {
  peran,
  tambahPeran,
  editPeran,
  deletePeran,
};
