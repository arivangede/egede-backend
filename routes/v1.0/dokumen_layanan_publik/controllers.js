const { ResponseError } = require("../../../utilities/response");
const { prisma } = require("../../../utilities/database");
const fs = require("fs")

const getDokumen = async (req, res, next) => {
    try {
        const data = await prisma.dokumenLayananPublik.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const tambahDokumen = async (req, res, next) => {
    try {
        const data = req.body
        const dokumen = req.files
        const fileData = []

        const existsSubKategori = await prisma.subKategoriLayananPublik.findFirst({
            where: { id: parseInt(data.fk_sub_kategori_id) }
        })

        if (!existsSubKategori) {
            return res.status(404).json({ message: "Sub Kategori Layanan Publik is not found" })
        }

        if (dokumen) {
            dokumen.forEach((file) => {
                const { filename, path } = file
                const fileObj = { filename: filename, path: path.replace(/\\/g, '/') }
                fileData.push(fileObj)
            })
        }

        await prisma.dokumenLayananPublik.create({
            data: {
                fk_sub_kategori_id: parseInt(data.fk_sub_kategori_id),
                dokumen: fileData
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const ubahDokumen = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const { fk_sub_kategori_id } = req.body
        const dokumen = req.files
        const fileData = []

        const existsDokumen = await prisma.dokumenLayananPublik.findFirst({
            where: { id }
        })

        if (!existsDokumen) {
            return res.status(404).json({ message: "Dokumen Layanan Publik is not found" })
        }

        existsDokumen.dokumen.forEach((file) => {
            const filePath = file.path.replace(/\\/g, "/")
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        })

        if (dokumen) {
            dokumen.forEach((file) => {
                const { filename, path } = file
                const fileObj = { filename: filename, path: path.replace(/\\/g, "/") }
                fileData.push(fileObj)
            })
        }

        await prisma.dokumenLayananPublik.update({
            where: { id: id },
            data: {
                fk_sub_kategori_id: parseInt(fk_sub_kategori_id),
                dokumen: fileData,
            },
        })

        res.status(200).json({ message: "Dokumen updated successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const hapusDokumen = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const existsDokumen = await prisma.dokumenLayananPublik.findFirst({
            where: { id },
        })

        if (!existsDokumen) {
            return res.status(404).json({ message: "Dokumen Layanan Publik is not found" })
        }

        existsDokumen.dokumen.forEach((file) => {
            const filePath = file.path.replace(/\\/g, "/")
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        })

        await prisma.dokumenLayananPublik.delete({
            where: { id: id },
        })

        res.status(200).json({ message: "Dokumen deleted successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    getDokumen,
    tambahDokumen,
    ubahDokumen,
    hapusDokumen
}