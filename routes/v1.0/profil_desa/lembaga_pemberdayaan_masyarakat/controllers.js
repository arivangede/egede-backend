const { prisma } = require('../../../../utilities/database')
const { ResponseError } = require("../../../../utilities/response")
const { customAlphabet } = require("nanoid")
const fs = require("fs")

const get = async (req, res, next) => {
    try {
        let data = []

        data = await prisma.lembagaPemberdayaanMasyarakat.findMany()
        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const getById = async (req, res, next) => {
    try {
        const { id } = req.params

        const data = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
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

const getAnggotaById = async (req, res, next) => {
    try {
        const { gid, anggotaId } = req.params

        const anggota = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            },
            select: {
                data_anggota: true
            }
        })

        if (!anggota) {
            return res.status(400).json({ message: "Anggota is not found" })
        }

        const filtered = anggota.data_anggota.filter((item) => item.id == anggotaId)

        res.status(200).json({ message: "Successfully.", data: filtered })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const create = async (req, res, next) => {
    try {
        const { gid } = req.user
        const { filename, path } = req.file

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is already exists" })
        }

        const fileData = {
            filename: filename,
            path: path
        }

        fileData.path = fileData.path.replace(/\\/g, '/')

        await prisma.lembagaPemberdayaanMasyarakat.create({
            data: {
                id: gid,
                img: fileData
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
        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: id
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const updated = {}

        if (req.file) {
            if (lembagaPemberdayaanMasyarakat.img) {
                fs.unlinkSync(lembagaPemberdayaanMasyarakat.img.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, "/")
            updated.img = { filename: filename, path: filepath }
        }

        await prisma.lembagaPemberdayaanMasyarakat.update({
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

const createAnggota = async (req, res, next) => {
    try {
        const { id } = req.params
        const { nama_lengkap, jabatan, email, telp } = req.body
        const nanoIdCustom = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 3)
        const { filename, path } = req.file

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: id
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat not found" })
        }

        const fileData = {
            filename: filename,
            path: path
        }

        fileData.path = fileData.path.replace(/\\/g, '/')

        const newDataAnggota = {
            id: nanoIdCustom(),
            nama_lengkap: nama_lengkap,
            jabatan: jabatan,
            email: email,
            telp: telp,
            img: fileData
        }

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: id
            },
            data: {
                data_anggota: {
                    push: newDataAnggota
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error('ERROR =>', error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const updateAnggota = async (req, res, next) => {
    try {
        const { gid, anggotaId } = req.params
        const { nama_lengkap, jabatan, email, telp } = req.body

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const updatedAnggota = lembagaPemberdayaanMasyarakat.data_anggota.find(anggota => anggota.id === anggotaId)

        if (!updatedAnggota) {
            return res.status(400).json({ message: "Anggota is not found" })
        }

        updatedAnggota.nama_lengkap = nama_lengkap
        updatedAnggota.jabatan = jabatan
        updatedAnggota.email = email
        updatedAnggota.telp = telp

        if (req.file) {
            const { filename, path } = req.file
            if(updateAnggota.img) {
                fs.unlinkSync(updateAnggota.img.path)
            }
            updatedAnggota.img = {filename, path: path.replace(/\\/g, '/') }
        }

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: gid
            },
            data: {
                data_anggota: {
                    set: lembagaPemberdayaanMasyarakat.data_anggota
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const remove = async (req, res, next) => {
    try {
        const { id } = req.params

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: id
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat not found" })
        }

        if (lembagaPemberdayaanMasyarakat.img) {
            fs.unlinkSync(lembagaPemberdayaanMasyarakat.img.path)
        }

        await prisma.lembagaPemberdayaanMasyarakat.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const removeAnggota = async (req, res, next) => {
    try {
        const { gid, anggotaId } = req.params

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const index = lembagaPemberdayaanMasyarakat.data_anggota.findIndex(anggota => anggota.id === anggotaId)

        if (index === -1) {
            return res.status(400).json({ message: "Anggota is not found" });
        }

        const removeAnggota = lembagaPemberdayaanMasyarakat.data_anggota[index]

        if (removeAnggota.img) {
            fs.unlinkSync(removeAnggota.img.path)
        }

        const updatedDataAnggota = [...lembagaPemberdayaanMasyarakat.data_anggota.slice(0, index), ...lembagaPemberdayaanMasyarakat.data_anggota.slice(index + 1)]

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: gid
            },
            data: {
                data_anggota: {
                    set: updatedDataAnggota
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    get,
    getById,
    getAnggotaById,
    create,
    update,
    createAnggota,
    updateAnggota,
    remove,
    removeAnggota
}