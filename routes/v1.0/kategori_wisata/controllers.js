const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");

const kategoriWisata = async (req, res, next) => {
    try {
        let data = []

        data = await prisma.kategoriWisata.findMany()
        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const tambahKategoriWisata = async (req, res, next) => {
    try {
        const data = req.body

        const existingData = await prisma.kategoriWisata.findFirst({
            where: {
                nama_kategori: data.nama_kategori
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        await prisma.kategoriWisata.create({
            data: {
                nama_kategori: data.nama_kategori
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const ubahKategoriWisata = async (req, res, next) => {
    try {
        const data = req.body
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriWisata.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Kategori is not found." })
        }

        const existingData = await prisma.kategoriWisata.findFirst({
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

        await prisma.kategoriWisata.update({
            where: {
                id: kategoriId
            },
            data: {
                nama_kategori: data.nama_kategori
            }
        })
        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const hapusKategoriWisata = async (req, res, next) => {
    try {
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriWisata.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Kategori is not found" })
        }

        await prisma.kategoriWisata.delete({
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
    kategoriWisata,
    tambahKategoriWisata,
    ubahKategoriWisata,
    hapusKategoriWisata
}