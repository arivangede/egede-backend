const { prisma } = require("../../../../utilities/database")
const { ResponseError } = require("../../../../utilities/response")
const fs = require("fs")

const wilayahDesa = async (req, res, next) => {
    try {
        let data = []


        data = await prisma.wilayahDesa.findMany()
        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const wilayahDesaById = async (req, res, next) => {
    try {
        const { id } = req.params

        const wilayah = await prisma.wilayahDesa.findFirst({
            where: {
                id: id
            }
        })

        if (!wilayah) {
            return res.status(404).json({
                message: "Data not found",
            });
        }

        res.status(200).json({ message: "Successfully.", data: wilayah })
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const createWilayah = async (req, res, next) => {
    try {
        const { gid } = req.user
        const { deskripsi } = req.body
        const { filename, path } = req.file

        const wilayah = await prisma.wilayahDesa.findFirst({
            where: {
                id: gid
            }
        })

        if (wilayah) {
            return res.status(400).json({
                message: "Wilayah Desa is already exists"
            })
        }

        const fileData = {
            filename: filename,
            path: path
        }

        fileData.path = fileData.path.replace(/\\/g, '/')

        const response = await prisma.wilayahDesa.create({
            data: {
                id: gid,
                deskripsi: deskripsi,
                img: fileData
            },
            select: {
                id: true
            }
        })

        res.status(200).json({ message: "Successfully.", data: response })
    } catch (error) {
        console.error('ERROR =>', error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const createTabel = async (req, res, next) => {
    try {
        const { id } = req.params
        const { tabel } = req.body

        await prisma.wilayahDesa.update({
            where: {
                id: id
            },
            data: {
                tabel: {
                    set: tabel.map(data => ({
                        nama_dusun: data.nama_dusun,
                        luas: data.luas,
                        keliling: data.keliling
                    }))
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error('ERROR =>', error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params
        const { deskripsi } = req.body

        const wilayah = await prisma.wilayahDesa.findFirst({
            where: {
                id: id
            }
        })

        if (!wilayah) {
            return res.status(400).json({ message: "Wilayah Desa is not found" })
        }

        const updated = {}

        if (deskripsi) {
            updated.deskripsi = deskripsi
        }

        if (req.file) {
            if (wilayah.img) {
                fs.unlinkSync(wilayah.img.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, '/')
            updated.img = { filename: filename, path: filepath }
        }

        await prisma.wilayahDesa.update({
            where: {
                id: id
            },
            data: updated
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error('ERROR ->', error)
        next(new ResponseError(500, "Internal Server Error"))
    }
}

const remove = async (req, res, next) => {
    try {
        const { id } = req.params

        const wilayah = await prisma.wilayahDesa.findFirst({
            where: {
                id: id
            }
        })

        if (!wilayah) {
            res.status(400).json({ message: "Wilayah Desa not found" })
        }

        if (wilayah.img) {
            fs.unlinkSync(wilayah.img.path);
        }

        await prisma.wilayahDesa.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"));
    }
}

module.exports = {
    wilayahDesa,
    wilayahDesaById,
    createWilayah,
    createTabel,
    update,
    remove
}