const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")

const tambahPerangkatPengguna = async (req, res, next) => {
    try {
        const { perangkat_id, informasi_perangkat } = req.body;

        if (!perangkat_id || !informasi_perangkat) {
            return res.status(400).json({ message: "Perangkat_id dan informasi_perangkat harus diisi." });
        }

        const existingData = await prisma.perangkatPengguna.findFirst({
            where: { perangkat_id }
        });

        if (existingData) {
            return res.status(201).json({
                message: "Data berhasil ditambahkan.",
                data: existingData
            });
        }

        const newData = await prisma.perangkatPengguna.create({
            data: {
                perangkat_id,
                informasi_perangkat,
                pengguna_id:req.user.rnd
            }
        });

        return res.status(201).json({
            message: "Data berhasil ditambahkan.",
            data: newData
        });
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
};



module.exports = {
    tambahPerangkatPengguna,
}