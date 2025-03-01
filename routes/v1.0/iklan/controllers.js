const { prisma } = require("../../../utilities/database");
const { ResponseError } = require("../../../utilities/response");
const fs = require("fs");

const getAll = async (req, res, next) => {
  try {
    const result = await prisma.iklan.findMany();
    res.status(200).json({
      message: "Successfully.",
      data: result,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const get = async (req, res, next) => {
  try {
    const { gid } = req.user;

    const result = await prisma.iklan.findFirst({
      where: {
        id: gid,
      },
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
    const files = req.files;

    const filesData = [];

    files.forEach((file) => {
      const { filename, path } = file;
      const fileObj = { filename: filename, path: path };
      filesData.push(fileObj);
    });

    await prisma.iklan.create({
      data: {
        id: gid,
        contents: filesData,
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

const tambahIklan = async (req, res, next) => {
  try {
    const { gid } = req.user;

    const iklan = await prisma.iklan.findFirst({
      where: {
        id: gid,
      },
    });

    if (!iklan) {
      return res.status(400).json({
        message: "Iklan is not found",
      });
    }

    if (!req.files) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const filesData = iklan.contents;

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((file) => {
        const { filename, path } = file;
        return { filename: filename, path: path };
      });
      filesData.push(...newFiles);
    }

    await prisma.iklan.update({
      where: {
        id: gid,
      },
      data: {
        contents: {
          set: filesData,
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

const removeIklan = async (req, res, next) => {
  try {
    const { gid } = req.user;

    const iklan = await prisma.iklan.findFirst({
      where: {
        id: gid,
      },
    });

    if (!iklan) {
      return res.status(404).json({
        message: "Iklan is not found",
      });
    }

    if (req.body.deleteFile) {
      const fileToDelete = req.body.deleteFile;
      const fileIndex = iklan.contents.findIndex(
        (file) => file.filename === fileToDelete
      );

      if (fileIndex !== -1) {
        fs.unlinkSync(iklan.contents[fileIndex].path);

        iklan.contents.splice(fileIndex, 1);

        await prisma.iklan.update({
          where: {
            id: gid,
          },
          data: {
            contents: iklan.contents,
          },
        });
      } else {
        return res.status(404).json({
          message: "File not found in iklan contents",
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid request, deleteFile field is missing",
      });
    }

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
    const { gid } = req.user;

    const iklan = await prisma.iklan.findFirst({
      where: {
        id: gid,
      },
    });

    if (!iklan) {
      return res.status(400).json({
        message: "Iklan is not found",
      });
    }

    if (iklan.contents.length !== 0) {
      iklan.contents.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }

    await prisma.iklan.delete({
      where: {
        id: gid,
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
  get,
  create,
  tambahIklan,
  removeIklan,
  remove,
};
