const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");

const get = async (req, res, next) => {
  try {
    let data = [];
    data = await prisma.penduduk.findMany();
    res.status(200).json({ message: "Successfully.", data: data });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getById = async (req, res, next) => {
  try {
    const pendudukId = req.params.id;
    console.log(pendudukId);

    // Fetch the Penduduk record by id
    const penduduk = await prisma.penduduk.findUnique({
      where: {
        id: pendudukId,
      },
      include: {
        daerah: true, // Include the related Daerah record
      },
    });

    if (!penduduk) {
      return res.status(404).json({
        message: "Penduduk data is not found",
      });
    }

    // Check if the Daerah record exists
    if (!penduduk.daerah) {
      return res.status(404).json({
        message: "Daerah data is not found",
      });
    }

    res.status(200).json({
      message: "Successfully.",
      data: {
        penduduk: penduduk,
        daerah: penduduk.daerah,
      },
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const create = async (req, res, next) => {
  try {
    const {
      no_kk,
      nama_lengkap,
      nik,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      alamat,
      fk_daerah_id,
      status_nikah,
      shdk,
      agama,
      suku_bangsa,
      kewarganegaraan,
      pendidikan_terakhir,
      pekerjaan,
      golongan_darah,
      penghasilan,
    } = req.body;

    const countNik = await prisma.penduduk.count({
      where: {
        nik: nik,
      },
    });

    if (countNik === 1) {
      return res.status(400).json({
        message: "Penduduk is already exists",
      });
    }

    const daerah = await prisma.daerah.findFirst({
      where: {
        id: fk_daerah_id,
      },
    });

    if (!daerah) {
      return res.status(400).json({
        message: "Daerah is not exists",
      });
    }

    const formattedTglLahir = new Date(tanggal_lahir);

    await prisma.penduduk.create({
      data: {
        no_kk: no_kk,
        nama_lengkap: nama_lengkap,
        nik: nik,
        jenis_kelamin: jenis_kelamin,
        tempat_lahir: tempat_lahir,
        tanggal_lahir: formattedTglLahir,
        alamat: alamat,
        fk_daerah_id: fk_daerah_id,
        status_nikah: status_nikah,
        shdk: shdk,
        agama: agama,
        suku_bangsa: suku_bangsa,
        kewarganegaraan: kewarganegaraan,
        pendidikan_terakhir: pendidikan_terakhir,
        pekerjaan: pekerjaan,
        golongan_darah: golongan_darah,
        penghasilan: penghasilan,
      },
    });
    res.status(200).json({ message: "Successfully." });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const update = async (req, res, next) => {
  try {
    const pendudukId = req.params.id;

    const {
      no_kk,
      nama_lengkap,
      nik,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      alamat,
      fk_daerah_id,
      status_nikah,
      shdk,
      agama,
      suku_bangsa,
      kewarganegaraan,
      pendidikan_terakhir,
      pekerjaan,
      golongan_darah,
      penghasilan,
    } = req.body;

    const isPendudukExists = await prisma.penduduk.findFirst({
      where: {
        id: pendudukId,
      },
    });

    if (!isPendudukExists) {
      return res.status(400).json({
        message: "Penduduk data is not found",
      });
    }

    const daerah = await prisma.daerah.findFirst({
      where: {
        id: fk_daerah_id,
      },
    });

    if (!daerah) {
      return res.status(400).json({
        message: "Daerah is not exists",
      });
    }

    // Buat objek data yang akan diperbarui
    const updateData = {
      alamat: alamat,
      fk_daerah_id: fk_daerah_id,
    };

    // Tambahkan field-field lainnya jika tersedia
    if (no_kk !== undefined) updateData.no_kk = no_kk;
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (nik !== undefined) updateData.nik = nik;
    if (jenis_kelamin !== undefined) updateData.jenis_kelamin = jenis_kelamin;
    if (tempat_lahir !== undefined) updateData.tempat_lahir = tempat_lahir;
    if (tanggal_lahir && !isNaN(new Date(tanggal_lahir).getTime())) {
      updateData.tanggal_lahir = new Date(tanggal_lahir);
    }
    if (status_nikah !== undefined) updateData.status_nikah = status_nikah;
    if (shdk !== undefined) updateData.shdk = shdk;
    if (agama !== undefined) updateData.agama = agama;
    if (suku_bangsa !== undefined) updateData.suku_bangsa = suku_bangsa;
    if (kewarganegaraan !== undefined) updateData.kewarganegaraan = kewarganegaraan;
    if (pendidikan_terakhir !== undefined) updateData.pendidikan_terakhir = pendidikan_terakhir;
    if (pekerjaan !== undefined) updateData.pekerjaan = pekerjaan;
    if (golongan_darah !== undefined) updateData.golongan_darah = golongan_darah;
    if (penghasilan !== undefined) updateData.penghasilan = penghasilan;

    await prisma.penduduk.update({
      where: {
        id: pendudukId,
      },
      data: updateData,
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
    const pendudukId = req.params.id;

    const isPendudukExists = await prisma.penduduk.findFirst({
      where: {
        id: pendudukId,
      },
    });

    if (!isPendudukExists) {
      return res.status(400).json({
        message: "Penduduk data is not found",
      });
    }

    await prisma.penduduk.delete({
      where: {
        id: pendudukId,
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
  getById,
  create,
  update,
  remove,
};
