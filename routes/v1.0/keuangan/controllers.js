const { prisma } = require("../../../utilities/database");
const { ResponseError } = require("../../../utilities/response");

const get = async (req, res, next) => {
  try {
    const result = await prisma.keuangan.findMany();

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
    const { gid } = req.user;
    const { tahun } = req.query;

    const keuangan = await prisma.keuangan.findMany({
      where: {
        fk_gate_id: gid,
        tahun: tahun,
      },
    });

    res.status(200).json({
      message: "Successfully.",
      data: keuangan,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getDraft = async (req, res, next) => {
  try {
    const { gid } = req.user
    const keuangan = await prisma.keuangan.findMany({
      where: {
        fk_gate_id: gid,
        OR: [
          { status_pendapatan: true },
          { status_belanja: true },
          { status_pembiayaan: true }
        ]
      }
    })

    res.status(200).json({
      message: 'Successfully.',
      data: keuangan
    })
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

const getList = async (req, res, next) => {
  try {
    const { gid } = req.user
    const keuangan = await prisma.keuangan.findMany({
      where: {
        fk_gate_id: gid,
        status_belanja: false,
        status_pembiayaan: false,
        status_pendapatan: false,
      },
      orderBy: {
        tahun: "desc"
      }
    })

    res.status(200).json({
      message: 'Successfully.',
      data: keuangan
    })
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

const getListCount = async (req, res, next) => {
  try {
    const { gid } = req.user

    const count = await prisma.keuangan.count({
      where: {
        fk_gate_id: gid,
        status_belanja: false,
        status_pembiayaan: false,
        status_pendapatan: false,
      }
    })

    res.status(200).json({ message: 'Successfully.', count: count })
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

const getById = async (req, res, next) => {
  try {
    const { id } = req.params

    const keuangan = await prisma.keuangan.findFirst({
      where: {
        id: parseInt(id),
      }
    })

    if (!keuangan) {
      return res.status(404).json({
        message: "Data not found",
      })
    }

    res.status(200).json({ message: "Successfully", data: keuangan })
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

const create = async (req, res, next) => {
  try {
    const { gid } = req.user
    const { tahun } = req.body

    const existingData = await prisma.keuangan.findFirst({
      where: { tahun },
    })

    if (existingData) {
      return res.status(400).json({
        message: "Data with same year already exists."
      })
    }

    await prisma.keuangan.create({
      data: {
        tahun: tahun,
        fk_gate_id: gid,
      },
    })

    res.status(200).json({
      message: "Successfully.",
    })
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const createPendapatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pendapatan } = req.body;

    const existingData = await prisma.keuangan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingData) {
      return res.status(404).json({
        message: 'Data keuangan not found.'
      });
    }

    let updatedPendapatan = existingData.pendapatan || [];

    pendapatan.forEach(newPendapatan => {
      updatedPendapatan.push(newPendapatan);
    });

    await prisma.keuangan.update({
      where: { id: existingData.id },
      data: {
        pendapatan: updatedPendapatan,
        status_pendapatan: false
      }
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const createBelanja = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { belanja } = req.body;

    const existingData = await prisma.keuangan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingData) {
      return res.status(404).json({
        message: 'Data keuangan not found.'
      });
    }

    let updatedBelanja = existingData.belanja || [];

    belanja.forEach(newBelanja => {
      updatedBelanja.push(newBelanja);
    });

    await prisma.keuangan.update({
      where: { id: existingData.id },
      data: {
        belanja: updatedBelanja,
        status_belanja: false
      }
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const createPembiayaan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pembiayaan } = req.body;

    const existingData = await prisma.keuangan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingData) {
      return res.status(404).json({
        message: 'Data keuangan not found.'
      });
    }

    let updatedPembiayaan = existingData.pembiayaan || [];

    pembiayaan.forEach(newPembiayaan => {
      updatedPembiayaan.push(newPembiayaan);
    });

    await prisma.keuangan.update({
      where: { id: existingData.id },
      data: {
        pembiayaan: updatedPembiayaan,
        status_pembiayaan: false
      }
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const updatePendapatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pendapatan } = req.body;

    const existingData = await prisma.keuangan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingData) {
      return res.status(404).json({
        message: 'Data keuangan not found.'
      });
    }

    let updatedPendapatan = new Set(existingData.pendapatan || []);

    pendapatan.forEach(newPendapatan => {
      updatedPendapatan = new Set([...updatedPendapatan].filter(p => p.formulir !== newPendapatan.formulir));
      updatedPendapatan.add(newPendapatan);
    });

    await prisma.keuangan.update({
      where: { id: existingData.id },
      data: {
        pendapatan: Array.from(updatedPendapatan)
      }
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

const updateBelanja = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { belanja } = req.body;

    const existingData = await prisma.keuangan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingData) {
      return res.status(404).json({
        message: 'Data keuangan not found.'
      });
    }

    let updatedBelanja = new Set(existingData.belanja || []);

    belanja.forEach(newBelanja => {
      updatedBelanja = new Set([...updatedBelanja].filter(p => p.formulir !== newBelanja.formulir));
      updatedBelanja.add(newBelanja);
    });

    await prisma.keuangan.update({
      where: { id: existingData.id },
      data: {
        belanja: Array.from(updatedBelanja)
      }
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const updatePembiayaan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pembiayaan } = req.body;

    const existingData = await prisma.keuangan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingData) {
      return res.status(404).json({
        message: 'Data keuangan not found.'
      });
    }

    let updatedPembiayaan = new Set(existingData.pembiayaan || []);

    pembiayaan.forEach(newPembiayaan => {
      updatedPembiayaan = new Set([...updatedPembiayaan].filter(p => p.formulir !== newPembiayaan.formulir));
      updatedPembiayaan.add(newPembiayaan);
    });

    await prisma.keuangan.update({
      where: { id: existingData.id },
      data: {
        pembiayaan: Array.from(updatedPembiayaan)
      }
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const {id} = req.params

    const existingData = await prisma.keuangan.findFirst({
      where: {
        id: parseInt(id)
      }
    })

    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    await prisma.keuangan.update({
      where: {
        id: parseInt(id)
      },
      data: {
        updated_status: false
      }
    })

    return res.status(200).json({ message: "Successfully."});
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
}

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const keuangan = await prisma.keuangan.findFirst({
      where: {
        id: id,
      },
    });

    if (!keuangan) {
      return res.status(400).json({
        message: "Keuangan data is not found",
      });
    }

    await prisma.keuangan.delete({
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
  getByGate,
  getDraft,
  getList,
  getListCount,
  getById,
  create,
  createPendapatan,
  createBelanja,
  createPembiayaan,
  updatePendapatan,
  updateBelanja,
  updatePembiayaan,
  updateStatus,
  remove,
};
