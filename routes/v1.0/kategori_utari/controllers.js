const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")

const kategoriUtari = async (req, res, next) => {
    try {
        const data = await prisma.kategoriUtari.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const kategoriUtariById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.kategoriUtari.findFirst({
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

const tambahKategoriUtari = async (req, res, next) => {
    try {
        const data = req.body

        const existingData = await prisma.kategoriUtari.findFirst({
            where: {
                nama_kategori: data.nama_kategori
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        await prisma.kategoriUtari.create({
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

const ubahKategoriUtari = async (req, res, next) => {
    try {
        const data = req.body
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriUtari.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const existingData = await prisma.kategoriUtari.findFirst({
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

        await prisma.kategoriUtari.update({
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

const hapusKategoriUtari = async (req, res, next) => {
    try {
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriUtari.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Kategori is not found" })
        }

        await prisma.kategoriUtari.delete({
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
    kategoriUtari,
    kategoriUtariById,
    tambahKategoriUtari,
    ubahKategoriUtari,
    hapusKategoriUtari
}