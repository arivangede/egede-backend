const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");

const kategoriBudaya = async (req, res, next) => {
    try {
        let data = []

        data = await prisma.kategoriBudaya.findMany()
        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const tambahKategoriBudaya = async (req, res, next) => {
    try {
        const data = req.body

        const existingData = await prisma.kategoriBudaya.findFirst({
            where: {
                nama_kategori: data.nama_kategori
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        await prisma.kategoriBudaya.create({
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

const ubahKategoriBudaya = async (req, res, next) => {
    try {
        const data = req.body
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriBudaya.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Kategori is not found." })
        }

        const existingData = await prisma.kategoriBudaya.findFirst({
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

        await prisma.kategoriBudaya.update({
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

const hapusKategoriBudaya = async (req, res, next) => {
    try {
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.kategoriBudaya.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Kategori is not found" })
        }

        await prisma.kategoriBudaya.delete({
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
    kategoriBudaya,
    tambahKategoriBudaya,
    ubahKategoriBudaya,
    hapusKategoriBudaya
}