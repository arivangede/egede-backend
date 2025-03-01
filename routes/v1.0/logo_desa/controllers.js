const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")
const fs = require("fs")

const logoDesa = async (req, res, next) => {
    try {
        const data = await prisma.logoDesa.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const logoDesaById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.logoDesa.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(400).json({ message: "Data is not found" })
        }

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const logoDesaByGate = async (req, res, next) => {
    try {
        const gateId = req.user.gid

        const data = await prisma.logoDesa.findFirst({
            where: { fk_gate_id: gateId }
        })

        if (!data) {
            return res.status(400).json({ message: "Data is not found" })
        }

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const tambahLogoDesa = async (req, res, next) => {
    try {
        const data = req.body
        const { filename, path } = req.file
        const gateId = req.user.gid

        const fileData = {
            filename: filename,
            path: path
        }

        fileData.path = fileData.path.replace(/\\/g, '/')

        await prisma.logoDesa.create({
            data: {
                nama: data.nama,
                logo: fileData,
                fk_gate_id: gateId
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const ubahLogoDesa = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.logoDesa.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(400).json({ message: "Data is not found" })
        }

        const updated = {}

        if (req.body.nama) {
            updated.nama = req.body.nama
        }

        if (req.file) {
            if (data.logo) {
                fs.unlinkSync(data.logo.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, "/")
            updated.logo = { filename: filename, path: filepath }
        }

        await prisma.logoDesa.update({
            where: { id },
            data: updated
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error('ERROR ->', error)
        next(new ResponseError(500, "Internal Server Error"))
    }
}

const hapusLogoDesa = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.logoDesa.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(400).json({ message: "Data is not found" })
        }

        if (data.logo) {
            fs.unlinkSync(data.logo.path)
        }

        await prisma.logoDesa.delete({
            where: { id }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    logoDesa,
    logoDesaById,
    logoDesaByGate,
    tambahLogoDesa,
    ubahLogoDesa,
    hapusLogoDesa
}