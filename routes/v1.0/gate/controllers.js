const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");

const get = async (req, res, next) => {
  try {
    const data = await prisma.gate.findMany();
    res.status(200).json({
      message: "Succesfully.",
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { judul } = req.body;
    let { status } = req.body;

    const gate = await prisma.gate.findUnique({
      where: {
        id: id,
      },
    });

    if (!gate) {
      return res.status(400).json({
        message: "gate is not found",
      });
    }

    if (status == "non-aktif") {
      status = true;
    } else if (status == "aktif") {
      status = false;
    } else {
      return res.status(400).json({
        message: "status not valid",
      });
    }

    await prisma.gate.update({
      where: {
        id: id,
      },
      data: {
        judul: judul,
        flag_status: status,
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
    const id = req.params.id;

    const gate = await prisma.gate.findUnique({
      where: {
        id: id,
      },
    });

    if (!gate) {
      return res.status(400).json({
        message: "gate is not found",
      });
    }

    await prisma.gate.delete({
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
  update,
  remove,
};
