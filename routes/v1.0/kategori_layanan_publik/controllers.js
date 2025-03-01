const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")

const kategoriLayananPublik = async (req, res, next) => {
    try {
        const data = await prisma.kategoriLayananPublik.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const kategoriLayananPublikById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.kategoriLayananPublik.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(404).json({ message: "Data not found." })
        }

        res.status(200).json({ message: "Successfully", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const filter = async (req, res, next) => {
    try {
        const { jenisLayananPublik } = req.query
        const filters = {}

        if (jenisLayananPublik) {
            const jenisLayanan = await prisma.jenisLayananPublik.findFirst({
                where: {
                    jenis: {
                        contains: jenisLayananPublik,
                        mode: "insensitive",
                    },
                },
                select: { id: true },
            })

            if (!jenisLayanan) {
                return res.status(400).json({ message: "Invalid jenis layanan publik." })
            }

            filters.fk_jenis_layanan_id = jenisLayanan.id
        }

        const data = await prisma.kategoriLayananPublik.findMany({
            where: filters,
            include: {
                jenis_layanan: true,
            },
        })

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
};

const tambahKategoriLayananPublik = async (req, res, next) => {
    try {
        const data = req.body

        const existingData = await prisma.kategoriLayananPublik.findFirst({
            where: {
                nama_kategori: data.nama_kategori
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        const existingJenis = await prisma.jenisLayananPublik.findFirst({
            where: {
                id: data.fk_jenis_layanan_id
            }
        })

        if (!existingJenis) {
            return res.status(400).json({ message: "Invalid jenis ID" })
        }


        await prisma.kategoriLayananPublik.create({
            data: {
                nama_kategori: data.nama_kategori,
                fk_jenis_layanan_id: data.fk_jenis_layanan_id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const ubahKategoriLayananPublik = async (req, res, next) => {
    try {
        const data = req.body
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriLayananPublik.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const existingData = await prisma.kategoriLayananPublik.findFirst({
            where: {
                nama_kategori: data.nama_kategori,
                NOT: {
                    id: kategoriId
                }
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        const existingJenis = await prisma.jenisLayananPublik.findFirst({
            where: {
                id: data.fk_jenis_layanan_id
            }
        })

        if (!existingJenis) {
            return res.status(400).json({ message: "Invalid jenis ID" })
        }

        await prisma.kategoriLayananPublik.update({
            where: {
                id: kategoriId
            },
            data: {
                nama_kategori: data.nama_kategori,
                fk_jenis_layanan_id: data.fk_jenis_layanan_id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const hapusKategoriLayananPublik = async (req, res, next) => {
    try {
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriLayananPublik.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Kategori is not found" })
        }

        await prisma.kategoriLayananPublik.delete({
            where: {
                id: kategoriId
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    kategoriLayananPublik,
    kategoriLayananPublikById,
    filter,
    tambahKategoriLayananPublik,
    ubahKategoriLayananPublik,
    hapusKategoriLayananPublik
}