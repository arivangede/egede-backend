const { ResponseError } = require("../../../../utilities/response");
const { prisma } = require("../../../../utilities/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_USER_SECRET = "secretKey";
const JWT_USER_ALGORITHM = "HS256";

const login = async (req, res, next) => {
  try {
    const { nama_pengguna, kata_sandi } = req.body;

    const user = await prisma.penggunaUmum.findFirst({
      where: {
        nama_pengguna: nama_pengguna,
      },
      select: {
        id: true,
        flag_status: true,
        fk_peran_id: true,
        pengguna: {
          select: {
            penduduk: {
              select: {
                daerah: {
                  select: {
                    gate: {
                      select: {
                        id: true,
                        flag_status: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Username or Password incorrect." });
    }

    if (user.flag_status === true) {
      return res.status(400).json({
        message: "Pengguna belum teraktivasi",
        data: { id: user.id },
      });
    }

    const appPrivateUser = await prisma.penggunaPribadi.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!appPrivateUser) {
      return res
        .status(401)
        .json({ message: "Username or Password incorrect." });
    }

    const passwordMatch = await bcrypt.compare(
      kata_sandi,
      appPrivateUser.kata_sandi
    );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Username or Password incorrect." });
    }

    const isGateActive = user.pengguna.penduduk.daerah.gate.flag_status; //cek apa gate aktif?

    if (isGateActive !== false) {
      return res.status(400).json({
        message: "Gate desa is not active",
      });
    }

    const token = jwt.sign(
      {
        iss: "PT. Bali Gerbang Digital",
        rnd: user.id,
        gst: user.fk_peran_id,
        gid: user.pengguna.penduduk.daerah.gate.id,
      },
      JWT_USER_SECRET,
      {
        algorithm: JWT_USER_ALGORITHM,
      }
    );

    res.status(200).json({ message: "Successfully.", token: token });
  } catch (error) {
    console.error("ERROR =>", error);
    next(new ResponseError(500, "Internal server error"));
  }
};

module.exports = { login };
