const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")


const notifikasiByPengguna = async (req, res, next) => {
    try {
        const data = await prisma.notifikasi.findMany({
            where: {
                created_by: req.user.rnd 
            },
            orderBy: {
                cts: 'desc'
            },
            take: 100 
        });

        res.status(200).json({ message: "Successfully.", data: data });
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error")); 
    }
};

const tambahNotifikasi = async (req, res, next) => {
    try {
        const { judul, deskripsi } = req.body;

        if (!judul || !deskripsi) {
            return res.status(400).json({ message: "judul dan deskripsi harus diisi." });
        }

        const newData = await prisma.notifikasi.create({
            data: {
                judul,
                deskripsi,
                created_by:req.user.rnd,
                is_read:true
            }
        });

          const adminList = await prisma.penggunaUmum.findMany({
            where: {
                fk_peran_id: { in: [1, 3] }
            }
        });

        if (adminList.length > 0) {
            const adminNotifikasi = adminList.map(admin => ({
                judul,
                deskripsi,
                created_by: admin.id,
                is_read: true
            }));

            await prisma.notifikasi.createMany({
                data: adminNotifikasi
            });
        }

        return res.status(201).json({
            message: "Data berhasil ditambahkan.",
            data: newData
        });
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
};

const updateNotifikasi = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        await prisma.notifikasi.update({
            where: { id },
            data: {
                is_read:false
            }
        })

        return res.status(200).json({
            message: "Data berhasil diUpdate."
        });
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
};



module.exports = {
    notifikasiByPengguna,
    tambahNotifikasi,
    updateNotifikasi
}