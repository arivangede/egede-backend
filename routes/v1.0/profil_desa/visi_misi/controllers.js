const { prisma } = require('../../../../utilities/database')
const { ResponseError } = require("../../../../utilities/response")

const visiMisi = async (req, res, next) => {
    try {
        let data = []

        data = await prisma.visiMisi.findMany()
        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const visiMisiById = async (req, res, next) => {
    try {
        const { id } = req.params

        const data = await prisma.visiMisi.findFirst({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.status(404).json({
                message: "Data not found",
            });
        }

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const create = async (req, res, next) => {
    try {
        const { gid } = req.user
        const { deskripsi } = req.body

        const visiMisi = await prisma.visiMisi.findFirst({
            where: {
                id: gid
            }
        })

        if (visiMisi) {
            return res.status(400).json({ message: "Visi Misi already exists" })
        }

        await prisma.visiMisi.create({
            data: {
                id: gid,
                deskripsi: deskripsi
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

        const visiMisi = await prisma.visiMisi.findFirst({
            where: {
                id: id
            }
        })

        if (!visiMisi) {
            return res.status(400).json({ message: "Visi Misi is not found" })
        }

        const updated = {}

        if (deskripsi) {
            updated.deskripsi = deskripsi
        }

        await prisma.visiMisi.update({
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

        const visiMisi = await prisma.visiMisi.findFirst({
            where: {
                id: id
            }
        })

        if (!visiMisi) {
            res.status(400).json({ message: "Visi Misi not found" })
        }

        await prisma.visiMisi.delete({
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
    visiMisi,
    visiMisiById,
    create,
    update,
    remove
}