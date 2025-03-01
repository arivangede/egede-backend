const { prisma } = require("../../../../utilities/database");
const { ResponseError } = require("../../../../utilities/response");

const get = async (req, res, next) => {
  try {
    const data = await prisma.bookmarkEnews.findMany();
    res.status(200).json({
      message: "Successfully.",
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getByUser = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    let { kategori, sortBy } = req.query;

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        id: rnd,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Pengguna is not found",
      });
    }

    const bookmarks = await prisma.bookmarkEnews.count({
      where: {
        fk_pengguna_id: rnd,
      },
    });

    if (bookmarks === 0) {
      return res.status(400).json({
        message: "There's No E-News Bookmarked by Pengguna",
      });
    }

    if (kategori === "berita") {
      kategori = "berita";
    } else if (kategori === "pengumuman") {
      kategori = "pengumuman";
    }

    if (sortBy === "terbaru") {
      sortBy = "desc";
    } else if (sortBy === "terlama") {
      sortBy = "asc";
    } else if (!sortBy) {
      sortBy = "desc";
    } else {
      return res.status(400).json({
        message: "SortBy input is not valid",
      });
    }

    const data = await prisma.bookmarkEnews.findMany({
      where: {
        fk_pengguna_id: rnd,
        enews: {
          kategori: kategori,
        },
      },
      include: {
        enews: true,
      },
      orderBy: {
        id: sortBy,
      },
    });

    res.status(200).json({
      message: "Succesfully.",
      data: data,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const isBookmarked = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const { enewsKode } = req.params;

    const enews = await prisma.enews.findFirst({
      where: {
        kode: enewsKode,
      },
    });

    if (!enews) {
      return res.status(400).json({
        message: "Enews is not found",
      });
    }

    const isBookmarked = await prisma.bookmarkEnews.findFirst({
      where: {
        fk_enews_id: enews.id,
        fk_pengguna_id: rnd,
      },
    });

    if (!isBookmarked) {
      return res.status(200).json({
        message: "pengguna belum melakukan bookmark postingan ini",
        bookmarked: false,
      });
    }

    return res.status(200).json({
      message: "pengguna sudah melakukan bookmark postingan ini",
      bookmarked: true,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const addBookmark = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const id = parseInt(req.params.id);

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

    const bookmark = await prisma.bookmarkEnews.findFirst({
      where: {
        fk_enews_id: id,
        fk_pengguna_id: rnd,
      },
    });

    if (bookmark) {
      return res.status(400).json({
        message: "This E-News is already bookmarked by Pengguna",
      });
    }

    await prisma.bookmarkEnews.create({
      data: {
        fk_enews_id: id,
        fk_pengguna_id: rnd,
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

const removeBookmark = async (req, res, next) => {
  try {
    const { rnd } = req.user;
    const id = parseInt(req.params.id);

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

    const bookmark = await prisma.bookmarkEnews.findFirst({
      where: {
        fk_enews_id: id,
        fk_pengguna_id: rnd,
      },
    });

    if (!bookmark) {
      return res.status(400).json({
        message: "Bookmark data is not found",
      });
    }

    await prisma.bookmarkEnews.delete({
      where: {
        id: bookmark.id,
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
  getByUser,
  isBookmarked,
  addBookmark,
  removeBookmark,
};
