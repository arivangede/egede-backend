const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")

const subKategoriLayananPublik = async (req, res, next) => {
    try {
        const data = await prisma.subKategoriLayananPublik.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const subKategoriLayananPublikById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.subKategoriLayananPublik.findFirst({
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

const tambahSubKategoriLayananPublik = async (req, res, next) => {
    try {
        const data = req.body

        const existingData = await prisma.subKategoriLayananPublik.findFirst({
            where: {
                nama_sub_kategori: data.nama_sub_kategori
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name already exists" })
        }

        const existingKategori = await prisma.kategoriLayananPublik.findFirst({
            where: {
                id: data.fk_kategori_id
            }
        })

        if (!existingKategori) {
            return res.status(400).json({ message: "Invalid category ID" })
        }

        await prisma.subKategoriLayananPublik.create({
            data: {
                nama_sub_kategori: data.nama_sub_kategori,
                fk_kategori_id: data.fk_kategori_id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const ubahSubKategoriLayananPublik = async (req, res, next) => {
    try {
        const data = req.body
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.subKategoriLayananPublik.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const existingData = await prisma.subKategoriLayananPublik.findFirst({
            where: {
                nama_sub_kategori: data.nama_sub_kategori,
                NOT: {
                    id: kategoriId
                }
            }
        })

        if (existingData) {
            return res.status(400).json({ message: "This name is already exists" })
        }

        const existingKategori = await prisma.kategoriLayananPublik.findFirst({
            where: {
                id: data.fk_kategori_id
            }
        });

        if (!existingKategori) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        await prisma.subKategoriLayananPublik.update({
            where: {
                id: kategoriId
            },
            data: {
                nama_sub_kategori: data.nama_sub_kategori,
                fk_kategori_id: data.fk_kategori_id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const hapusSubKategoriLayananPublik = async (req, res, next) => {
    try {
        const kategoriId = parseInt(req.params.id)

        const findData = await prisma.subKategoriLayananPublik.findFirst({
            where: {
                id: kategoriId
            }
        })

        if (!findData) {
            return res.status(404).json({ message: "Sub Kategori is not found" })
        }

        await prisma.subKategoriLayananPublik.delete({
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
    subKategoriLayananPublik,
    subKategoriLayananPublikById,
    tambahSubKategoriLayananPublik,
    ubahSubKategoriLayananPublik,
    hapusSubKategoriLayananPublik
}