const { prisma } = require("../../../../utilities/database");
const { ResponseError } = require("../../../../utilities/response");

const get = async (req, res, next) => {
  try {
    const data = await prisma.likeEnews.findMany();
    res.status(200).json({
      message: "Successfully.",
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const count = async (req, res, next) => {
  try {
    const { enewsId } = req.params;

    const enews = await prisma.enews.findFirst({
      where: {
        kode: enewsId,
      },
    });

    if (!enews) {
      return res.status(400).json({
        message: "E-News not found",
      });
    }

    const data = await prisma.likeEnews.count({
      where: {
        fk_enews_id: enews.id,
      },
    });
    res.status(200).json({
      message: "Successfully",
      data: {
        likesCount: data,
      },
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const isUserLiked = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const { enewsId } = req.params;

    const enews = await prisma.enews.findFirst({
      where: {
        kode: enewsId,
      },
      select: {
        id: true,
      },
    });

    if (!enews) {
      return res.status(400).json({ message: "Enews not found" });
    }

    const isLiked = await prisma.likeEnews.findFirst({
      where: {
        fk_pengguna_id: rnd,
        fk_enews_id: enews.id,
      },
    });

    if (!isLiked) {
      return res.status(200).json({
        message: "Pengguna bersangkutan belum like postingan ini",
        liked: false,
      });
    }

    return res.status(200).json({
      message: "Pengguna bersangkutan sudah like postingan ini",
      liked: true,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const giveLike = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const id = parseInt(req.params.id);

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        id: rnd,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "User is not found",
      });
    }

    const enews = await prisma.enews.findFirst({
      where: {
        id: id,
      },
    });

    if (!enews) {
      return res.status(400).json({
        message: "E-News is not found",
      });
    }

    const like = await prisma.likeEnews.findFirst({
      where: {
        fk_enews_id: id,
        fk_pengguna_id: rnd,
      },
    });

    if (like) {
      return res.status(400).json({
        message: "Pengguna is already liked this post",
      });
    }

    await prisma.likeEnews.create({
      data: {
        fk_enews_id: id,
        fk_pengguna_id: rnd,
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

const removeLike = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const id = parseInt(req.params.id);

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        id: rnd,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "User is not found",
      });
    }

    const enews = await prisma.enews.findFirst({
      where: {
        id: id,
      },
    });

    if (!enews) {
      return res.status(400).json({
        message: "E-News is not found",
      });
    }

    const like = await prisma.likeEnews.findFirst({
      where: {
        fk_enews_id: id,
        fk_pengguna_id: rnd,
      },
    });

    if (!like) {
      return res.status(400).json({
        message: "Like data is not found",
      });
    }

    await prisma.likeEnews.delete({
      where: {
        id: like.id,
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
  count,
  isUserLiked,
  giveLike,
  removeLike,
};
