const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");
const fs = require("fs");
const { customAlphabet } = require("nanoid");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../../utilities/mailer/nodemailer");

const get = async (req, res, next) => {
  try {
    let data = [];

    data = await prisma.penggunaUmum.findMany();
    res.status(200).json({ message: "Successfully.", data: data });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getUserPublicById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await prisma.penggunaUmum.findFirst({
      where: {
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    res.status(200).json({ message: "Successfully.", data: data });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getUserPrivateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await prisma.penggunaPribadi.findFirst({
      where: {
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    res.status(200).json({ message: "Successfully.", data: data });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const getUserDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userData = await prisma.penggunaUmum.findUnique({
      where: {
        id: id,
      },
      select: {
        nama_pengguna: true,
        no_hp: true,
        peran: {
          select: {
            nama_peran: true,
          },
        },
      },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendudukData = await prisma.penduduk.findFirst({
      where: {
        pengguna: {
          id: id,
        },
      },
      select: {
        nama_lengkap: true,
        nik: true,
        no_kk: true,
        alamat: true,
        jenis_kelamin: true,
        pekerjaan: true,
        suku_bangsa: true,
        tempat_lahir: true,
        tanggal_lahir: true,
        kewarganegaraan: true,
        pendidikan_terakhir: true,
        status_nikah: true,
        foto_penduduk: true,
        foto_ktp: true,
        foto_kk: true,
        foto_ijazah: true,
        daerah: {
          select: {
            dusun: true,
            desa: true,
            kecamatan: true,
          },
        },
      },
    });

    if (!pendudukData) {
      return res.status(404).json({ message: "Penduduk data not found" });
    }

    const userDetails = {
      pengguna: userData,
      penduduk: pendudukData,
    };

    res.status(200).json({ message: "Successfully.", data: userDetails });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const isUserValid = async (req, res, next) => {
  try {
    const { pengguna_id } = req.params;
    let userValid = true;

    const pengguna = await prisma.penggunaUmum.count({
      where: {
        id: pengguna_id,
      },
    });

    if (pengguna == 0) {
      userValid = false;
    }

    res.status(200).json({
      message: "Successfully.",
      userValid: userValid,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const register = async (req, res, next) => {
  try {
    const data = req.body;

    const countUser = await prisma.penggunaUmum.count({
      where: {
        nama_pengguna: data.nama_pengguna,
      },
    });

    if (countUser === 1) {
      return res.status(400).send({
        message: "This username already exists",
      });
    }

    data.kata_sandi = await bcrypt.hash(data.kata_sandi, 10);

    const pendudukId = await prisma.penduduk.findFirst({
      where: {
        nik: data.nik,
      },
      select: {
        id: true,
      },
    });

    if (!pendudukId) {
      return res.status(400).json({
        message: "nik is not registered",
      });
    }

    const nanoIdCustom = customAlphabet("0123456789", 6);
    data.kode_otp = nanoIdCustom();

    const peranId = 4;

    const result = await prisma.penggunaUmum.create({
      data: {
        nama_pengguna: data.nama_pengguna,
        email: data.email,
        no_hp: data.no_hp,
        pengguna: {
          create: {
            fk_penduduk_id: pendudukId.id,
            kata_sandi: data.kata_sandi,
            kode_otp: data.kode_otp,
          },
        },
        peran: {
          connect: {
            id: peranId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    // send email
    const subject = "One-Time-Passcode(OTP) E-GeDe";
    const templateName = "otpTemplate";
    const email = data.email;
    const emailData = {
      nama_pengguna: data.nama_pengguna,
      kode_otp: data.kode_otp,
    };

    await sendEmail(email, subject, templateName, emailData);
    res.status(200).json({ message: "Successfully.", data: result });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const activate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { kode_otp } = req.body;

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        id: id,
      },
      select: {
        pengguna: {
          select: {
            kode_otp: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Pengguna not found",
      });
    }

    if (kode_otp !== user.pengguna.kode_otp) {
      return res.status(400).json({
        message: "Kode otp salah",
      });
    }

    await prisma.penggunaUmum.update({
      where: {
        id: id,
      },
      data: {
        flag_status: false,
      },
    });

    await prisma.penggunaPribadi.update({
      where: {
        id: id,
      },
      data: {
        kode_otp: null,
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
    const { id } = req.params;
    const { nama_pengguna, email, no_hp, fk_peran_id } = req.body;
    let { kata_sandi } = req.body;

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Pengguna is not found",
      });
    }

    if (nama_pengguna && nama_pengguna !== user.nama_pengguna) {
      const existingUser = await prisma.penggunaUmum.findFirst({
        where: {
          nama_pengguna: nama_pengguna,
          NOT: {
            id: id,
          },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username already exists.",
        });
      }
    }

    if (email && email !== user.email) {
      const existingEmailUser = await prisma.penggunaUmum.findFirst({
        where: {
          email: email,
          NOT: {
            id: id,
          },
        },
      });

      if (existingEmailUser) {
        return res.status(400).json({
          message: "Email already exists.",
        });
      }
    }

    const public = {};

    if (nama_pengguna) {
      public.nama_pengguna = nama_pengguna;
    }

    if (email) {
      public.email = email;
    }

    if (no_hp) {
      public.no_hp = no_hp;
    }

    if (fk_peran_id) {
      const peranId = parseInt(fk_peran_id);
      const peran = await prisma.peran.findFirst({
        where: {
          id: peranId,
        },
      });

      if (!peran) {
        return res.status(400).json({
          message: "New Peran is not found",
        });
      }

      public.peran = {
        connect: {
          id: peranId,
        },
      };
    }

    if (kata_sandi) {
      kata_sandi = await bcrypt.hash(kata_sandi, 10);

      await prisma.penggunaPribadi.update({
        where: {
          id: id,
        },
        data: {
          kata_sandi: kata_sandi,
        },
      });
    }

    await prisma.penggunaUmum.update({
      where: {
        id: id,
      },
      data: public,
    });

    res.status(200).json({
      message: "Successfully.",
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const updateOtp = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Pengguna not found",
      });
    }

    const newOtp = customAlphabet("0123456789", 6);

    const result = await prisma.penggunaPribadi.update({
      where: {
        id: id,
      },
      data: {
        kode_otp: newOtp(),
      },
    });

    // send email
    const subject = "OTP E-GeDe";
    const templateName = "otpTemplate";
    const email = user.email;
    const emailData = {
      nama_pengguna: user.nama_pengguna,
      kode_otp: result.kode_otp,
    };

    await sendEmail(email, subject, templateName, emailData);

    res.status(200).json({
      message: "Successfully",
      data: {
        id: id,
      },
    });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

const forget = async (req, res, next) => {
  try {
    const { nama_lengkap, nik } = req.body;

    const user = await prisma.penduduk.findFirst({
      where: {
        nama_lengkap: nama_lengkap,
        nik: nik,
      },
      select: {
        pengguna: {
          select: {
            id: true,
            pengguna: {
              select: {
                nama_pengguna: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Penduduk is not found",
      });
    }

    if (!user.pengguna.id) {
      return res.status(400).json({
        message: "Pengguna is not registered",
      });
    }

    const nama_pengguna = user.pengguna.pengguna.nama_pengguna;
    const newPassword = customAlphabet("0123456789ABCDEFGHIJ", 8);
    const password = newPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.penggunaPribadi.update({
      where: {
        id: user.pengguna.id,
      },
      data: {
        kata_sandi: hashedPassword,
      },
    });

    // kirim email
    const email = user.pengguna.pengguna.email;
    const subject = "Reset Sandi E-GeDe";
    const templateName = "lupaSandiTemplate";
    const emailData = {
      nama_pengguna: nama_pengguna,
      password: password,
    };

    await sendEmail(email, subject, templateName, emailData);
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
    const { id } = req.params;

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Pengguna not found",
      });
    }

    await prisma.penggunaUmum.delete({
      where: {
        id: id,
      },
    });

    await prisma.penggunaPribadi.delete({
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
  getUserPublicById,
  getUserPrivateById,
  getUserDetailsById,
  isUserValid,
  register,
  activate,
  update,
  updateOtp,
  forget,
  remove,
};
