const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")

const jenisLayananPublik = async (req, res, next) => {
    try {
        const data = await prisma.jenisLayananPublik.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const jenisLayananPublikById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.jenisLayananPublik.findFirst({
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

const tambahJenisLayananPublik = async (req, res, next) => {
    try {
        const data = req.body

        const existingData = await prisma.jenisLayananPublik.findFirst({
            where: {
                jenis: data.jenis
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        await prisma.jenisLayananPublik.create({
            data: {
                jenis: data.jenis
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const ubahJenisLayananPublik = async (req, res, next) => {
    try {
        const data = req.body
        const jenisId = parseInt(req.params.id)

        const findData = await prisma.jenisLayananPublik.findFirst({
            where: {
                id: jenisId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const existingData = await prisma.jenisLayananPublik.findFirst({
            where: {
                jenis: data.jenis,
                NOT: {
                    id: jenisId
                }
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        await prisma.jenisLayananPublik.update({
            where: {
                id: jenisId
            },
            data: {
                jenis: data.jenis
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const hapusJenisLayananPublik = async (req, res, next) => {
    try {
        const jenisId = parseInt(req.params.id)

        const findData = await prisma.jenisLayananPublik.findFirst({
            where: {
                id: jenisId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Jenis is not found" })
        }

        await prisma.jenisLayananPublik.delete({
            where: {
                id: jenisId
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    jenisLayananPublik,
    jenisLayananPublikById,
    tambahJenisLayananPublik,
    ubahJenisLayananPublik,
    hapusJenisLayananPublik
}